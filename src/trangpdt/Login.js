import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const API_BASE_URL = 'https://server-quanlydiemsinhvien-production.up.railway.app';
const API_LOGIN_URL = `${API_BASE_URL}/api/auth/login`;

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Vui lòng nhập tên đăng nhập và mật khẩu');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(API_LOGIN_URL, { username, password });

            const { token, role ,magv } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('magv',magv);
            setIsAuthenticated(true);

            redirectToDashboard(role);
        } catch (error) {
            setError(error.response?.data?.message || 'Đã có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };

    const redirectToDashboard = (role) => {
        switch (role) {
            case 'SV':
                navigate('/sinhvien-dashboard');
                break;
            case 'GV':
                navigate('/giangvien-dashboard');
                break;
            case 'PDT':
                navigate('/trang-chu');
                break;
            default:
                navigate('/dashboard');
                break;
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng nhập</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Tên đăng nhập</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
