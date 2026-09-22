import LoginActivity from '../models/LoginActivity.js';

const activeSince = () => new Date(Date.now() - Number(process.env.ACTIVE_SESSION_TIMEOUT_MINUTES || 30) * 60 * 1000);

export const getLoginActivity = async (req, res) => {
  try {
    const { search = '', method = '', status = '', date = '', page = 1, limit = 20 } = req.query;
    const filter = {};
    if (method && ['EMAIL', 'MOBILE_OTP'].includes(method)) filter.loginMethod = method;
    if (status === 'SUCCESS' || status === 'FAILED') filter.status = status;
    if (status === 'ACTIVE') { filter.status = 'SUCCESS'; filter.logoutTime = null; filter.loginTime = { $gte: activeSince() }; }
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) { const start = new Date(`${date}T00:00:00.000Z`); const end = new Date(start); end.setUTCDate(end.getUTCDate() + 1); filter.loginTime = { $gte: start, $lt: end }; }
    if (search.trim()) { const pattern = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); filter.$or = ['name', 'email', 'phone'].map((field) => ({ [field]: { $regex: pattern, $options: 'i' } })); }
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100); const safePage = Math.max(Number(page) || 1, 1);
    const [data, total] = await Promise.all([LoginActivity.find(filter).sort({ loginTime: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).select('name email phone loginMethod loginTime logoutTime status').lean(), LoginActivity.countDocuments(filter)]);
    return res.json({ success: true, data, pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) } });
  } catch { return res.status(500).json({ success: false, message: 'Unable to load login activity.' }); }
};

export const getActiveUsers = async (_req, res) => {
  try {
    const active = await LoginActivity.aggregate([{ $match: { status: 'SUCCESS', logoutTime: null, loginTime: { $gte: activeSince() } } }, { $group: { _id: '$userId' } }, { $count: 'count' }]);
    return res.json({ success: true, activeUsers: active[0]?.count || 0, activeSessionTimeoutMinutes: Number(process.env.ACTIVE_SESSION_TIMEOUT_MINUTES || 30) });
  } catch { return res.status(500).json({ success: false, message: 'Unable to load active users.' }); }
};

export const getLoginStatistics = async (_req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const rows = await LoginActivity.aggregate([{ $match: { loginTime: { $gte: start } } }, { $group: { _id: { method: '$loginMethod', status: '$status' }, count: { $sum: 1 } } }]);
    const summary = { totalLoginsToday: 0, emailLoginsToday: 0, mobileOtpLoginsToday: 0, failedAttemptsToday: 0 };
    rows.forEach(({ _id, count }) => { if (_id.status === 'SUCCESS') { summary.totalLoginsToday += count; if (_id.method === 'EMAIL') summary.emailLoginsToday += count; if (_id.method === 'MOBILE_OTP') summary.mobileOtpLoginsToday += count; } else summary.failedAttemptsToday += count; });
    return res.json({ success: true, ...summary });
  } catch { return res.status(500).json({ success: false, message: 'Unable to load login statistics.' }); }
};

export const getDailyLoginStatistics = async (req, res) => {
  try {
    const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 90); const start = new Date(); start.setDate(start.getDate() - (days - 1)); start.setHours(0, 0, 0, 0);
    const data = await LoginActivity.aggregate([{ $match: { loginTime: { $gte: start }, status: 'SUCCESS' } }, { $group: { _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$loginTime' } }, method: '$loginMethod' }, count: { $sum: 1 } } }, { $sort: { '_id.date': 1 } }]);
    return res.json({ success: true, data });
  } catch { return res.status(500).json({ success: false, message: 'Unable to load login trends.' }); }
};
