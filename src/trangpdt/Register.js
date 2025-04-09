import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css';

const API_BASE_URL = 'https://server-quanlydiemsinhvien-production.up.railway.app/api/auth/register';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password || !role) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(API_BASE_URL, {
                username,
                password,
                role
            });

            alert("Tạo tài khoản thành công!");
            window.location.href = '/login'; // Chuyển hướng sau khi đăng ký thành công
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Đã có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Đăng ký tài khoản</h2>
                <form onSubmit={handleRegister}>
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
                    <div className="input-group">
                        <label>Vai trò</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="">Chọn vai trò</option>
                            <option value="PDT">Phòng đào tạo</option>
                            <option value="SV">Sinh viên</option>
                            <option value="GV">Giảng viên</option>
                        </select>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
