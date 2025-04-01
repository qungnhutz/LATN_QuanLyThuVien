import classNames from 'classnames/bind';
import styles from './detailbook.module.scss';
import Header from '../../Header/Header';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import request from '../../../../../config/Connect';
import MenuLeft from '../../MenuLeft/MenuLeft';
import Footer from '../../Footer/Footer';
import ModalRequestBook from '../Modal/ModalRequestBook';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Button, Box } from '@mui/material'; // Thêm Button và Box từ MUI
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Icon mũi tên quay lại

const cx = classNames.bind(styles);

const DetailBook = () => {
    const { masach } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate(); // Hook để điều hướng

    // Hàm định dạng ngày
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Gọi API để lấy thông tin sách
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await request.get('/api/SearchBookByMaSach', {
                    params: { masach },
                });
                setBook(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Lỗi kết nối');
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [masach]);

    // Hàm xử lý quay lại trang trước
    const handleBack = () => {
        navigate(-1); // Quay lại trang trước trong lịch sử
    };

    if (loading) return <p className="text-center text-muted py-5"><i className="bi bi-hourglass-split me-2"></i>Đang tải...</p>;
    if (error) return <p className="text-danger text-center py-5"><i className="bi bi-exclamation-triangle me-2"></i>{error}</p>;
    if (!book) return <p className="text-center text-muted py-5"><i className="bi bi-book me-2"></i>Không tìm thấy sách.</p>;

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
                    <Box sx={{ padding: '0 15px', maxWidth: '1200px', margin: '0 auto' }}>
                        {/* Nút Quay lại */}
                        <Box sx={{ mb: 3, pt: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBack}
                                sx={{
                                    borderColor: '#3498DB',
                                    color: '#3498DB',
                                    '&:hover': {
                                        borderColor: '#2C3E50',
                                        color: '#2C3E50',
                                    },
                                    textTransform: 'none',
                                }}
                            >
                                Quay lại
                            </Button>
                        </Box>

                        <div className="card shadow-lg border-0 rounded-3">
                            <div className="row g-0">
                                <div className="col-md-4 p-4">
                                    <img
                                        src={book.img}
                                        alt={book.tensach}
                                        className="img-fluid rounded shadow-sm"
                                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="col-md-8 p-4">
                                    <h1 className="fw-bold mb-4 text-primary">
                                        <i className="bi bi-book me-2"></i>{book.tensach}
                                    </h1>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <ul className="list-unstyled">
                                                <li className="mb-2">
                                                    <strong><i className="bi bi-upc-scan me-2"></i>Mã sách:</strong>{' '}
                                                    <span>{book.masach}</span>
                                                </li>
                                                <li className="mb-2">
                                                    <strong><i className="bi bi-person-fill me-2"></i>Tác giả:</strong>{' '}
                                                    <span>{book.tacgia}</span>
                                                </li>
                                                <li className="mb-2">
                                                    <strong><i className="bi bi-building me-2"></i>Nhà xuất bản:</strong>{' '}
                                                    <span>{book.nhaxuatban}</span>
                                                </li>
                                                <li className="mb-2">
                                                    <strong><i className="bi bi-tags-fill me-2"></i>Phiên bản:</strong>{' '}
                                                    <span>{book.phienban}</span>
                                                </li>
                                                <li className="mb-2">
                                                    <strong><i className="bi bi-bookmark-fill me-2"></i>Danh mục:</strong>{' '}
                                                    <span>{book.madanhmuc}</span>
                                                </li>
                                                <li className="mb-2">
                                                    <strong><i className="bi bi-calendar-event me-2"></i>Năm xuất bản:</strong>{' '}
                                                    <span>{book.namxb}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <ul className="list-unstyled">
                                                <li className="mb-2">
                                                    <strong><i className="bi bi-box-seam me-2"></i>Tổng số sách:</strong>{' '}
                                                    <span className="badge bg-success">{book.Tongsoluong}</span>
                                                </li>
                                                <li className="mb-2">
                                                    <strong><i className="bi bi-cart-check me-2"></i>Số lượng mượn:</strong>{' '}
                                                    <span className="badge bg-warning text-dark">
                                                        {book.vitri.reduce(
                                                            (total, v) => total + (v.soluongmuon || 0),
                                                            0
                                                        )}
                                                    </span>
                                                </li>
                                                <li className="mb-2">
                                                    <strong><i className="bi bi-file-earmark-text me-2"></i>Số trang:</strong>{' '}
                                                    <span>{book.pages}</span>
                                                </li>
                                                <li className="mb-2">
                                                    <strong><i className="bi bi-currency-dollar me-2"></i>Giá:</strong>{' '}
                                                    <span>{book.price.toLocaleString()} VND</span>
                                                </li>
                                                <li className="mb-2">
                                                    <strong><i className="bi bi-clock-history me-2"></i>Ngày cập nhật:</strong>{' '}
                                                    <span>{formatDate(book.ngaycapnhat)}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h5 className="fw-semibold">
                                            <i className="bi bi-geo-alt-fill me-2"></i>Vị trí lưu trữ:
                                        </h5>
                                        <ul className="list-group list-group-flush">
                                            {book.vitri.map((v, index) => (
                                                <li
                                                    key={index}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                >
                                                    <span>{v.mavitri}</span>
                                                    <div>
                                                        <span className="badge bg-primary me-2">
                                                            Còn: {v.soluong_con}
                                                        </span>
                                                        <span className="badge bg-warning text-dark">
                                                            Mượn: {v.soluongmuon}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        className="btn btn-primary btn-lg mt-4 px-4"
                                        onClick={() => setShowModal(true)}
                                    >
                                        <i className="bi bi-book me-2"></i>Mượn sách
                                    </button>
                                </div>
                            </div>
                            <div className="card-body border-top mt-4">
                                <h4 className="fw-semibold text-muted">
                                    <i className="bi bi-card-text me-2"></i>Mô tả sách
                                </h4>
                                <p className="text-muted">{book.mota}</p>
                            </div>
                        </div>
                    </Box>
                </main>
            </div>

            <footer className={cx('footer')}>
                <Footer />
            </footer>

            <ModalRequestBook
                show={showModal}
                setShow={setShowModal}
                masach={book.masach}
                tensach={book.tensach}
                vitri={book.vitri}
            />
        </div>
    );
};

export default DetailBook;