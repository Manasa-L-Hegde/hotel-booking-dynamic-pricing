import axios from 'axios';
import { mockHotels, bookingRows, pricingRows, analyticsData } from '../data/mockData';

const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', headers: { 'Content-Type': 'application/json' } });
client.interceptors.request.use((config) => { const token = localStorage.getItem('smartstay_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });

const fallback = async (request, data) => { try { return await request(); } catch { return data; } };
export const hotelApi = {
  getHotels: (params) => fallback(() => client.get('/hotels', { params }).then((r) => r.data.hotels), mockHotels),
  getHotelById: (id) => fallback(() => client.get(`/hotels/${id}`).then((r) => r.data.hotel), mockHotels.find((hotel) => hotel._id === id)),
};
export const bookingApi = { getBookings: () => fallback(() => client.get('/bookings').then((r) => r.data.bookings), bookingRows), createBooking: (payload) => client.post('/bookings', payload).then((r) => r.data) };
export const pricingApi = { getPricing: () => fallback(() => client.get('/pricing').then((r) => r.data.pricing), pricingRows), predictRoom: (payload) => client.post('/pricing/predict-room', payload).then((r) => r.data) };
export const analyticsApi = { getAnalytics: () => fallback(() => client.get('/analytics').then((r) => r.data), { trends: analyticsData }) };
export const authApi = {
  register: (payload) => client.post('/auth/register', payload).then((r) => r.data),
  login: (payload) => client.post('/auth/login', payload).then((r) => r.data),
  sendOtp: (phone) => client.post('/auth/send-otp', { phone }).then((r) => r.data),
  verifyOtp: (phone, otp) => client.post('/auth/verify-otp', { phone, otp }).then((r) => r.data),
  logout: () => client.post('/auth/logout').then((r) => r.data),
};
export const adminApi = {
  getLoginActivity: (params) => client.get('/admin/login-activity', { params }).then((r) => r.data),
  getActiveUsers: () => client.get('/admin/active-users').then((r) => r.data),
  getLoginStatistics: () => client.get('/admin/login-statistics').then((r) => r.data),
  getDailyLoginStatistics: (params) => client.get('/admin/login-statistics/daily', { params }).then((r) => r.data),
};
export default client;
