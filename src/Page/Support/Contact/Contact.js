import classNames from 'classnames/bind';
import styles from './Contact.module.scss';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


import Header from '../../HomePage/Layouts/Header/Header';
import MenuLeft from '../../HomePage/Layouts/MenuLeft/MenuLeft'; // Import MenuLeft
import Footer from '../../HomePage/Layouts/Footer/Footer';

const cx = classNames.bind(styles);

function Contact() {
    // State cho biểu mẫu
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    // State cho ý kiến phản hồi
    const [feedback, setFeedback] = useState('');

    // State cho chiều cao của MenuLeft
    const [menuHeight, setMenuHeight] = useState(window.innerHeight - 60 - 100);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            return toast.error('Vui lòng nhập đầy đủ thông tin');
        }
        toast.success('Yêu cầu của bạn đã được gửi!');
        setFormData({ name: '', email: '', message: '' });
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        if (!feedback) {
            return toast.error('Vui lòng nhập ý kiến phản hồi');
        }
        toast.success('Ý kiến phản hồi của bạn đã được gửi!');
        setFeedback('');
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer />
            <header className={cx('header')}>
                <Header />
            </header>
            {/* Phần chính với MenuLeft và Content */}
            <div className={cx('main-container')}>
                <aside className={cx('menu-left')} >
                    <MenuLeft />
                </aside>

                <main className={cx('content')}>
                    <div className="container py-4">
                        <h2 className={cx('section-title')}>Liên hệ</h2>
                        <div className="row g-4">
                            {/* Thông tin liên hệ trung tâm thư viện */}
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <img
                                        src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1000&auto=format&fit=crop"
                                        alt="Library"
                                        className="card-img-top"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">Thông tin liên hệ trung tâm thư viện</h5>
                                        <p className="card-text">
                                            <strong>Cơ sở Hà Nội:</strong><br />
                                            Tầng 1 - HAS - 454 Minh Khai, Q. Hai Bà Trưng, TP. Hà Nội<br />
                                            Tầng 2 - HA10 - 218 Lĩnh Nam, Q. Hoàng Mai, TP. Hà Nội<br />
                                            <strong>Cơ sở Nam Định:</strong><br />
                                            353 Trần Hưng Đạo, TP. Nam Định, Nam Định
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Biểu mẫu */}
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <img
                                        src="/contact.jpg"
                                        alt="Form"
                                        className="card-img-top"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">Biểu mẫu</h5>
                                        <form onSubmit={handleFormSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="name" className="form-label">Họ và tên</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleFormChange}
                                                    placeholder="Nhập họ và tên"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleFormChange}
                                                    placeholder="Nhập email"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="message" className="form-label">Tin nhắn</label>
                                                <textarea
                                                    className="form-control"
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleFormChange}
                                                    rows="3"
                                                    placeholder="Nhập tin nhắn của bạn"
                                                ></textarea>
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100">
                                                Gửi yêu cầu
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            {/* Ý kiến phản hồi */}
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <img
                                        src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1000&auto=format&fit=crop"
                                        alt="Feedback"
                                        className="card-img-top"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">Ý kiến phản hồi</h5>
                                        <form onSubmit={handleFeedbackSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="feedback" className="form-label">Ý kiến của bạn</label>
                                                <textarea
                                                    className="form-control"
                                                    id="feedback"
                                                    value={feedback}
                                                    onChange={handleFeedbackChange}
                                                    rows="5"
                                                    placeholder="Nhập ý kiến phản hồi của bạn"
                                                ></textarea>
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100">
                                                Gửi ý kiến
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <footer className={cx('footer')}>
                <Footer />
            </footer>
        </div>
    );
}

export default Contact;