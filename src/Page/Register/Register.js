import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { useState } from 'react';
import request from '../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Thêm icon mũi tên

const cx = classNames.bind(styles);

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [masinhvien, setMasinhvien] = useState('');
    const [address, setAddress] = useState('');
    const [birthday, setBirthday] = useState('');
    const [sdt, setSdt] = useState('');
    const [typereader, setTypereader] = useState('Sinh viên');
    const navigate = useNavigate(); // Hook để điều hướng

    const handleRegister = async () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        try {
            const checkEmail = emailPattern.test(email);
            if (!checkEmail) {
                toast.error('Email không đúng định dạng');
                return;
            }
            if (!masinhvien || !password || !email) {
                toast.error('Vui lòng nhập mã sinh viên, mật khẩu và email!');
                return;
            }

            const res = await request.post('/api/createUser', {
                masinhvien,
                password,
                email,
                hoten: username,
                address,
                brithday: birthday,
                sdt,
                typereader,
            });
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi server');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer />
            <div className={cx('inner')}>
                <div className={cx('column-left')}>
                    <div className={cx('text-container')}>
                        <h1>Thư viện trực tuyến</h1>
                        <h2>Đại Học Kinh Tế - Kĩ Thuật Công Nghiệp</h2>
                    </div>
                    <div className={cx('image-container')}>
                        <img
                            src="/Books_preview.png"
                            alt="Library Image"
                            className={cx('animated-image')}
                        />
                    </div>
                </div>
                <div className={cx('column-right')}>
                    <div className={cx('back-icon')} onClick={() => navigate('/')}>
                        <ArrowBackIcon />
                    </div>
                    <h1>Đăng Ký</h1>
                    <span>Chào mừng đến với cơ sở dữ liệu trực tuyến</span>
                    <div className={cx('field-group')}>
                        <div>
                            <TextField
                                id="username"
                                label="Họ Và Tên"
                                variant="outlined"
                                size="medium"
                                fullWidth
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <TextField
                                id="masinhvien"
                                label="Mã Sinh Viên"
                                variant="outlined"
                                size="medium"
                                fullWidth
                                onChange={(e) => setMasinhvien(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={cx('field-group')}>
                        <div>
                            <TextField
                                id="email"
                                label="Email"
                                variant="outlined"
                                size="medium"
                                fullWidth
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <TextField
                                id="address"
                                label="Địa Chỉ"
                                variant="outlined"
                                size="medium"
                                fullWidth
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={cx('field-group')}>
                        <div>
                            <TextField
                                id="birthday"
                                label="Ngày Sinh"
                                type="date"
                                variant="outlined"
                                size="medium"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => setBirthday(e.target.value)}
                            />
                        </div>
                        <div>
                            <TextField
                                id="sdt"
                                label="Số Điện Thoại"
                                variant="outlined"
                                size="medium"
                                fullWidth
                                onChange={(e) => setSdt(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={cx('field-group')}>
                        <div>
                            <TextField
                                id="typereader"
                                select
                                label="Loại Độc Giả"
                                variant="outlined"
                                size="medium"
                                fullWidth
                                value={typereader}
                                onChange={(e) => setTypereader(e.target.value)}
                            >
                                <MenuItem value="Sinh viên">Sinh viên</MenuItem>
                                <MenuItem value="Giảng viên">Giảng viên</MenuItem>
                            </TextField>
                        </div>
                        <div>
                            <TextField
                                id="password"
                                label="Mật Khẩu"
                                variant="outlined"
                                type="password"
                                size="medium"
                                fullWidth
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <Button onClick={handleRegister} variant="contained" fullWidth size="large">
                            Đăng Ký
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;