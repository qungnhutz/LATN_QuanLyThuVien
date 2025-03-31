import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ChangePassword.module.scss';
import homeStyles from '../../HomePage/Layouts/HomePage/HomePage.module.scss';
import Header from '../../HomePage/Layouts/Header/Header';
import MenuLeft from '../../HomePage/Layouts/MenuLeft/MenuLeft';
import Footer from '../../HomePage/Layouts/Footer/Footer';
import { requestChangePassword } from '../../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind({ ...styles, ...homeStyles });

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const footerRef = useRef(null);
    const [menuHeight, setMenuHeight] = useState(window.innerHeight - 60 - 100);

    useEffect(() => {
        const updateMenuHeight = () => {
            const windowHeight = window.innerHeight;
            const footerRect = footerRef.current?.getBoundingClientRect();
            const headerHeight = 60;
            const footerTop = footerRect?.top || windowHeight;
            const availableHeight = Math.min(windowHeight - headerHeight, footerTop - headerHeight);
            setMenuHeight(availableHeight);
        };

        updateMenuHeight();
        window.addEventListener('resize', updateMenuHeight);
        window.addEventListener('scroll', updateMenuHeight);

        return () => {
            window.removeEventListener('resize', updateMenuHeight);
            window.removeEventListener('scroll', updateMenuHeight);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            const response = await requestChangePassword({ oldPass: oldPassword, newPass: newPassword, confirmNewPass: confirmPassword });
            toast.success(response.message);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast.error(err.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer />
            <header className={cx('header')}>
                <Header />
            </header>
            <div className={cx('main-container')}>
                <aside className={cx('menu-left')} style={{ maxHeight: `${menuHeight}px` }}>
                    <MenuLeft />
                </aside>
                <main className={cx('content')}>
                    <h2>Thay Đổi Mật Khẩu</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={cx('input-group')}>
                            <label>Mật khẩu cũ</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={cx('input-group')}>
                            <label>Mật khẩu mới</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={cx('input-group')}>
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={cx('btn-submit')}>Xác nhận</button>
                    </form>
                </main>
            </div>
            <footer className={cx('footer')} ref={footerRef}>
                <Footer />
            </footer>
        </div>
    );
}

export default ChangePassword;
