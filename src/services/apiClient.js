// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://67c46a22c4649b9551b38b81.mockapi.io/students',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm đăng nhập chỉ kiểm tra ma_sv
export const login = async (ma_sv) => {
  try {
    const response = await apiClient.get(`/sinh-vien?ma_sv=${ma_sv}`);
    if (response.data.length > 0) {
      localStorage.setItem('user', JSON.stringify(response.data[0]));
      return response.data[0];
    } else {
      throw new Error('Mã sinh viên không tồn tại!');
    }
  } catch (error) {
    console.error('Đăng nhập thất bại:', error.message);
    throw error;
  }
};

// Hàm đăng xuất
export const logout = () => {
  localStorage.removeItem('user');
};

// Hàm kiểm tra đăng nhập
export const isLoggedIn = () => {
  const user = localStorage.getItem('user');
  return user !== null;
};

export default apiClient;

