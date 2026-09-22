import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import LoginActivity from '../models/LoginActivity.js';
import OtpChallenge from '../models/OtpChallenge.js';
import User from '../models/User.js';
import { sendOtp as sendSmsOtp } from '../services/smsService.js';
import { normalizePhone } from '../utils/phone.js';

const otpExpirySeconds = Number(process.env.OTP_EXPIRY_SECONDS || 60);
const otpHash = (phone, otp) => crypto.createHmac('sha256', process.env.OTP_HASH_SECRET || process.env.JWT_SECRET || 'development-only-secret').update(`${phone}:${otp}`).digest('hex');
const clientMeta = (req) => ({ ipAddress: req.ip || '', userAgent: String(req.get('user-agent') || '').slice(0, 500) });
const issueToken = (user, sessionId) => jwt.sign({ id: user._id, email: user.email, phone: user.phone, role: user.role, sessionId }, process.env.JWT_SECRET || 'development-only-secret', { expiresIn: process.env.JWT_EXPIRY || '1d' });
const record = (req, details) => LoginActivity.create({ ...clientMeta(req), ...details });

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ success: false, message: 'Name, email, and an 8-character password are required.' });
    const normalizedPhone = phone ? normalizePhone(phone) : null;
    if (phone && !normalizedPhone) return res.status(400).json({ success: false, message: 'Invalid mobile number. Use +91XXXXXXXXXX.' });
    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, ...(normalizedPhone ? [{ phone: normalizedPhone }] : [])] });
    if (exists) return res.status(409).json({ success: false, message: 'An account already uses this email or mobile number.' });
    const user = await User.create({ name, email, phone: normalizedPhone || undefined, passwordHash: await bcrypt.hash(password, 12) });
    return res.status(201).json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) { return res.status(500).json({ success: false, message: 'Registration failed.' }); }
};

export const loginWithEmail = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: String(email || '').toLowerCase() }).select('+passwordHash');
    if (!user || !user.passwordHash || !(await bcrypt.compare(String(password || ''), user.passwordHash))) {
      await record(req, { email: String(email || '').toLowerCase(), loginMethod: 'EMAIL', status: 'FAILED' });
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const sessionId = crypto.randomUUID();
    await record(req, { userId: user._id, name: user.name, email: user.email, phone: user.phone, loginMethod: 'EMAIL', status: 'SUCCESS', sessionId });
    return res.json({ success: true, token: issueToken(user, sessionId), user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch { return res.status(500).json({ success: false, message: 'Login failed. Please try again.' }); }
};

export const sendOtp = async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  if (!phone) return res.status(400).json({ success: false, message: 'Invalid mobile number. Use +91XXXXXXXXXX.' });
  try {
    const now = new Date();
    let challenge = await OtpChallenge.findOne({ phone });
    if (challenge && now - challenge.lastSentAt < 30_000) return res.status(429).json({ success: false, message: 'Please wait before requesting another OTP.' });
    const windowExpired = !challenge || now - challenge.requestWindowStartedAt > 60 * 60 * 1000;
    const requestCount = windowExpired ? 1 : challenge.requestsInWindow + 1;
    if (requestCount > 5) return res.status(429).json({ success: false, message: 'Too many OTP requests. Please try again later.' });
    const otp = crypto.randomInt(100000, 1_000_000).toString();
    const values = { otpHash: otpHash(phone, otp), expiresAt: new Date(now.getTime() + otpExpirySeconds * 1000), lastSentAt: now, requestWindowStartedAt: windowExpired ? now : challenge.requestWindowStartedAt, requestsInWindow: requestCount, attempts: 0, usedAt: undefined };
    challenge = challenge ? Object.assign(challenge, values) : new OtpChallenge({ phone, ...values });
    await challenge.save();
    try { await sendSmsOtp(phone, otp); } catch (error) { await OtpChallenge.deleteOne({ _id: challenge._id }); return res.status(503).json({ success: false, message: 'Unable to send OTP. Please try again later.' }); }
    return res.json({ success: true, message: process.env.SMS_PROVIDER === 'mock' || !process.env.SMS_PROVIDER ? 'OTP prepared in development mock mode; no SMS was delivered.' : 'OTP sent successfully.', expiresIn: otpExpirySeconds });
  } catch { return res.status(500).json({ success: false, message: 'Unable to send OTP. Please try again later.' }); }
};

export const verifyOtp = async (req, res) => {
  const phone = normalizePhone(req.body.phone); const otp = String(req.body.otp || '');
  if (!phone || !/^\d{6}$/.test(otp)) return res.status(400).json({ success: false, message: 'Enter a valid mobile number and 6-digit OTP.' });
  try {
    const challenge = await OtpChallenge.findOne({ phone });
    if (!challenge || challenge.usedAt || challenge.expiresAt <= new Date()) return res.status(400).json({ success: false, message: 'OTP has expired. Request a new one.' });
    if (challenge.attempts >= 5) return res.status(429).json({ success: false, message: 'Too many OTP attempts. Request a new OTP.' });
    if (!crypto.timingSafeEqual(Buffer.from(challenge.otpHash), Buffer.from(otpHash(phone, otp)))) { challenge.attempts += 1; await challenge.save(); await record(req, { phone, loginMethod: 'MOBILE_OTP', status: 'FAILED' }); return res.status(401).json({ success: false, message: 'Incorrect OTP.' }); }
    challenge.usedAt = new Date(); await challenge.save();
    const user = await User.findOne({ phone });
    if (!user) return res.status(200).json({ success: true, requiresOnboarding: true, message: 'Mobile verified. Complete registration to create your account.', phone });
    const sessionId = crypto.randomUUID();
    await record(req, { userId: user._id, name: user.name, email: user.email, phone, loginMethod: 'MOBILE_OTP', status: 'SUCCESS', sessionId });
    return res.json({ success: true, message: 'Login successful.', token: issueToken(user, sessionId), user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch { return res.status(500).json({ success: false, message: 'OTP verification failed. Please try again.' }); }
};

export const logout = async (req, res) => { if (req.user?.sessionId) await LoginActivity.updateOne({ sessionId: req.user.sessionId, logoutTime: null }, { $set: { logoutTime: new Date() } }); return res.json({ success: true }); };
