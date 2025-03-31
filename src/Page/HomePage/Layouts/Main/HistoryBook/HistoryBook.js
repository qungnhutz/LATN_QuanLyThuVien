import classNames from 'classnames/bind';
import styles from './HistoryBook.module.scss';
import Header from '../../Header/Header';
import MenuLeft from '../../MenuLeft/MenuLeft';
import Footer from '../../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import request from '../../../../../config/Connect';
import { jwtDecode } from 'jwt-decode';
import ModalExtendBook from '../../../../../Modal/ExtenBooks/ModalExtendBook';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const cx = classNames.bind(styles);

function HistoryBook() {
    const token = document.cookie;
    const [dataBooks, setDataBooks] = useState([]);
    const [masinhvien, setMasinhvien] = useState('');
    const [show, setShow] = useState(false);

    const handleShowModal = () => {
        setShow(!show);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleExtendBorrowing = async (maphieumuon) => {
        try {
            const response = await request.post('/api/ExtendBorrowing', { maphieumuon });
            toast.success(response.data.message);
            if (response.status === 200) {
                fetchDataAndUpdate();
            }
        } catch (error) {
            console.error('Lỗi khi gia hạn sách:', error);
            toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi gia hạn!');
        }
    };

    const fetchDataAndUpdate = async () => {
        if (token && masinhvien) {
            try {
                const response = await request.get('/api/GetBorrowsByStudent', {
                    params: { masinhvien }
                });
                setDataBooks(response.data.data || []);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                setDataBooks([]);
                toast.error(error.response?.data?.message || 'Lỗi khi lấy danh sách phiếu mượn!');
            }
        }
    };

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setMasinhvien(decoded.masinhvien);
            } catch (error) {
                console.error('Lỗi khi giải mã token:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        fetchDataAndUpdate();
    }, [masinhvien, token]);

    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <Header />
            </header>

            <div className={cx('main-container')}>
                <aside className={cx('menu-left')}>
                    <MenuLeft />
                </aside>

                <main className={cx('content')}>
                    <div className="container mt-4">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover rounded-3 overflow-hidden shadow-sm">
                                <thead className="table-info">
                                <tr>
                                    <th scope="col">Mã Phiếu Mượn</th>
                                    <th scope="col">Tên Sách</th>
                                    <th scope="col">Ngày Mượn</th>
                                    <th scope="col">Ngày Hẹn Trả</th>
                                    <th scope="col">Ngày Trả</th>
                                    <th scope="col">Quá Hạn</th>
                                    <th scope="col">Tình Trạng</th>
                                    <th scope="col">Hành Động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {dataBooks.map((item, index) => {
                                    const ngayHenTra = new Date(item.ngayhentra);
                                    const today = new Date();
                                    const quahan = Math.max(0, Math.floor((today - ngayHenTra) / (1000 * 60 * 60 * 24)));

                                    return (
                                        <tr key={index}>
                                            <td>{item?.maphieumuon || 'N/A'}</td>
                                            <td>{item?.tensach || 'N/A'}</td>
                                            <td>{formatDate(item?.ngaymuon)}</td>
                                            <td>{formatDate(item?.ngayhentra)}</td>
                                            <td>{item?.ngaytra ? formatDate(item.ngaytra) : 'Chưa trả'}</td>
                                            <td className={quahan > 0 && !item.tinhtrang ? 'text-danger' : ''}>
                                                {quahan > 0 && !item.tinhtrang ? `${quahan} ngày` : 'Không'}
                                            </td>
                                            <td>
                                                {item?.tinhtrang ? (
                                                    <span className="text-success fw-medium">
                                                        <FontAwesomeIcon icon={faCheck} /> Đã trả
                                                    </span>
                                                ) : (
                                                    <span className="text-danger fw-medium">
                                                        <FontAwesomeIcon icon={faSpinner} className={cx('loading')} /> Đang mượn
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {!item?.tinhtrang && !item?.giahan && (
                                                    <button
                                                        onClick={() => handleExtendBorrowing(item?.maphieumuon)}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        Gia Hạn
                                                    </button>
                                                )}
                                                {item?.giahan && !item?.tinhtrang && (
                                                    <span className="text-muted">Đã gia hạn</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            <footer className={cx('footer')}>
                <Footer />
            </footer>

            <ModalExtendBook show={show} setShow={setShow} masinhvien={masinhvien} />
            <ToastContainer />
        </div>
    );
}

export default HistoryBook;
