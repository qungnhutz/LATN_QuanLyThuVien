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
import {
    Box, Chip,
    Fade,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography,
} from '@mui/material';
import Button from '@mui/material/Button';

const cx = classNames.bind(styles);

function HistoryBook() {
    const token = document.cookie;
    const [dataBooks, setDataBooks] = useState([]);
    const [masinhvien, setMasinhvien] = useState('');
    const [show, setShow] = useState(false);

    const handleShowModal = () => {
        setShow(!show);
    };

    const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
    }));

    const StyledTableHead = styled(TableHead)(({ theme }) => ({
        background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
        '& th': {
            color: '#fff',
            fontWeight: 600,
            padding: theme.spacing(2),
            borderBottom: 'none',
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:hover': {
            backgroundColor: theme.palette.grey[100],
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
        },
        transition: 'all 0.2s ease-in-out',
    }));

    const MainLayout = styled(Box)(({ theme }) => ({
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f6fa',
    }));

    useEffect(() => {
        document.title = "Lịch sử mượn";
    }, []);

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
                        <StyledTableContainer component={Paper}>
                            <Table>
                                <StyledTableHead>
                                    <TableRow>
                                        <TableCell>Mã Phiếu</TableCell>
                                        <TableCell>Tên Sách</TableCell>
                                        <TableCell>Ngày Mượn</TableCell>
                                        <TableCell>Ngày Hẹn Trả</TableCell>
                                        <TableCell>Ngày Trả</TableCell>
                                        <TableCell>Quá Hạn</TableCell>
                                        <TableCell>Tình Trạng</TableCell>
                                        <TableCell>Hành Động</TableCell>
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody>
                                    {dataBooks.map((item, index) => {
                                        const ngayHenTra = new Date(item.ngayhentra);
                                        const today = new Date();
                                        const quahan = Math.max(0, Math.floor((today - ngayHenTra) / (1000 * 60 * 60 * 24)));

                                        return (
                                            <Fade in timeout={400 + index * 100} key={index}>
                                                <StyledTableRow>
                                                    <TableCell>{item?.maphieumuon || 'N/A'}</TableCell>
                                                    <TableCell>{item?.tensach || 'N/A'}</TableCell>
                                                    <TableCell>{formatDate(item?.ngaymuon)}</TableCell>
                                                    <TableCell>{formatDate(item?.ngayhentra)}</TableCell>
                                                    <TableCell>
                                                        {item?.ngaytra ? formatDate(item.ngaytra) : 'Chưa trả'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {quahan > 0 && !item.tinhtrang ? (
                                                            <Chip label={`${quahan} ngày`} color="error" size="small" />
                                                        ) : (
                                                            'Không'
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.tinhtrang === true || item.tinhtrang === 1 || item.tinhtrang === '1' ? (
                                                            <Chip
                                                                icon={<FontAwesomeIcon icon={faCheck} />}
                                                                label="Đã trả"
                                                                color="success"
                                                                size="small"
                                                            />
                                                        ) : (
                                                            <Chip
                                                                icon={<FontAwesomeIcon icon={faSpinner} className="fa-spin" />}
                                                                label="Đang mượn"
                                                                color="warning"
                                                                size="small"
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {!item?.tinhtrang && !item?.giahan ? (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => handleExtendBorrowing(item?.maphieumuon)}
                                                                sx={{
                                                                    borderRadius: 20,
                                                                    textTransform: 'none',
                                                                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                                                    '&:hover': {
                                                                        transform: 'scale(1.05)',
                                                                        transition: 'all 0.2s',
                                                                    },
                                                                }}
                                                            >
                                                                Gia Hạn
                                                            </Button>
                                                        ) : item?.giahan && !item?.tinhtrang ? (
                                                            <Typography variant="body2" color="text.secondary">
                                                                Đã gia hạn
                                                            </Typography>
                                                        ) : null}
                                                    </TableCell>
                                                </StyledTableRow>
                                            </Fade>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </StyledTableContainer>
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
