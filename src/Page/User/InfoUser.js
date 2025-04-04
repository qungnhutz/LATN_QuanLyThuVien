import classNames from 'classnames/bind';
import styles from './InfoUser.module.scss';
import homeStyles from '../HomePage/Layouts/HomePage/HomePage.module.scss';
import Header from '../HomePage/Layouts/Header/Header';
import MenuLeft from '../HomePage/Layouts/MenuLeft/MenuLeft';
import Footer from '../HomePage/Layouts/Footer/Footer';
import { useEffect, useState, useRef } from 'react';
import { fetchUserInfo, requestEditProfile } from '../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
const cx = classNames.bind(styles);

// Hàm xử lý định dạng ngày từ yyyy-mm-dd để hiển thị dd/mm/yyyy
const formatDateForDisplay = (dateStr) => {
    if (!dateStr || dateStr === 'undefined/undefined/') return '';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        const [year, month, day] = dateStr.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    }
    return '';
};

// Hàm chuyển đổi định dạng ngày về yyyy-mm-dd để gửi lên server
const formatDateForDatabase = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    }
    return dateStr;
};

function InfoUser() {
    const [dataUser, setDataUser] = useState({});
    const [editData, setEditData] = useState({
        masinhvien: '',
        hoten: '',
        address: '',
        brithday: '',
        email: '',
        typereader: '',
        sdt: '',
    });
    useEffect(() => {
        document.title = "Thông tin người dùng";
    }, []);
    // Lấy thông tin người dùng
    useEffect(() => {
        fetchUserInfo()
            .then((student) => {
                console.log('Dữ liệu từ API:', student);
                setDataUser(student);
                setEditData({
                    masinhvien: student.masinhvien || '',
                    hoten: student.hoten || '',
                    address: student.address || '',
                    brithday: formatDateForDisplay(student.brithday) || '',
                    email: student.email || '',
                    typereader: student.typereader || '',
                    sdt: student.sdt || '',
                });
            })
            .catch((error) => {
                console.error('Lỗi khi lấy thông tin sinh viên:', error);
                toast.error(error.message || 'Lỗi khi lấy thông tin');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSave = async () => {
        if (!editData.hoten || !editData.email || !editData.masinhvien) {
            return toast.error('Vui lòng nhập đủ thông tin bắt buộc (Tên, Email, Mã sinh viên)');
        }

        const formattedData = {
            masinhvien: editData.masinhvien,
            hoten: editData.hoten,
            address: editData.address,
            brithday: formatDateForDatabase(editData.brithday),
            sdt: editData.sdt,
            email: editData.email,
            typereader: editData.typereader,
        };

        try {
            const res = await requestEditProfile(formattedData);
            toast.success(res.message);
            setDataUser({ ...dataUser, ...formattedData });
        } catch (error) {
            toast.error(error.message || 'Lỗi khi cập nhật thông tin');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer />
            <header className={cx('header')}>
                <Header />
            </header>

            <div className={cx('main-container')}>
                <aside className={cx('menu-left')}>
                    <MenuLeft />
                </aside>

                <main className={cx('content')}>
                    <div className="container py-3 d-flex justify-content-center">
                        <div
                            className="card border-0 rounded-4 shadow-sm"
                            style={{ maxWidth: '600px', backgroundColor: '#e8ecef' }}
                        >
                            <div className="card-body p-4">
                                <div className={cx('header-page-admin', 'text-center', 'mb-3')}>
                                    <div className={cx('img-admin', 'mb-2')}>
                                        <img
                                            src="hacker.png"
                                            alt=""
                                            className="img-fluid rounded-circle border border-secondary border-2"
                                            style={{ width: '100px' }}
                                        />
                                    </div>
                                    <div className={cx('info-admin')}>
                                        <h3 className="fw-bold text-dark mb-1">{dataUser?.hoten || 'Chưa có tên'}</h3>
                                        <div className={cx('position')}>
                                            <span className="badge bg-dark text-light me-2">{dataUser?.email || 'Chưa có email'}</span>
                                            <span className="badge bg-success">{dataUser?.typereader || 'User'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('info-account')}>
                                    <h5 className="text-dark mb-3">
                                        <i className="bi bi-person-circle me-2"></i> Thông tin tài khoản
                                    </h5>
                                    <form>
                                        <div className="row g-2">
                                            <div className="col-12">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-dark text-light border-0">
                                                        <i className="bi bi-person-fill"></i>
                                                    </span>
                                                    <input
                                                        id="hoten"
                                                        name="hoten"
                                                        value={editData.hoten}
                                                        onChange={handleChange}
                                                        type="text"
                                                        className="form-control border-0"
                                                        placeholder="Tên"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-dark text-light border-0">
                                                        <i className="bi bi-envelope-fill"></i>
                                                    </span>
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        value={editData.email}
                                                        onChange={handleChange}
                                                        type="email"
                                                        className="form-control border-0"
                                                        placeholder="Email"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-dark text-light border-0">
                                                        <i className="bi bi-card-text"></i>
                                                    </span>
                                                    <input
                                                        id="masinhvien"
                                                        name="masinhvien"
                                                        value={editData.masinhvien}
                                                        onChange={handleChange}
                                                        type="text"
                                                        className="form-control border-0 bg-light"
                                                        readOnly
                                                        placeholder="Mã sinh viên"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-dark text-light border-0">
                                                        <i className="bi bi-geo-alt-fill"></i>
                                                    </span>
                                                    <input
                                                        id="address"
                                                        name="address"
                                                        value={editData.address}
                                                        onChange={handleChange}
                                                        type="text"
                                                        className="form-control border-0"
                                                        placeholder="Địa chỉ"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-dark text-light border-0">
                                                        <i className="bi bi-calendar-fill"></i>
                                                    </span>
                                                    <input
                                                        id="brithday"
                                                        name="brithday"
                                                        value={editData.brithday}
                                                        onChange={handleChange}
                                                        type="text"
                                                        className="form-control border-0"
                                                        placeholder="Ngày sinh (dd/mm/yyyy)"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-dark text-light border-0">
                                                        <i className="bi bi-person-lines-fill"></i>
                                                    </span>
                                                    <input
                                                        id="typereader"
                                                        name="typereader"
                                                        value={editData.typereader}
                                                        onChange={handleChange}
                                                        type="text"
                                                        className="form-control border-0 bg-light"
                                                        readOnly
                                                        placeholder="Loại người dùng"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-dark text-light border-0">
                                                        <i className="bi bi-telephone-fill"></i>
                                                    </span>
                                                    <input
                                                        id="sdt"
                                                        name="sdt"
                                                        value={editData.sdt}
                                                        onChange={handleChange}
                                                        type="text"
                                                        className="form-control border-0"
                                                        placeholder="Số điện thoại"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-center">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm px-4"
                                                onClick={handleSave}
                                            >
                                                <i className="bi bi-save me-2"></i> Lưu Thay Đổi
                                            </button>
                                        </div>
                                    </form>
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

export default InfoUser;