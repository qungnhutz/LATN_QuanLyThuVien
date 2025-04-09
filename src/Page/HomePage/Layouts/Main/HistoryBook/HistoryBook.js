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
    Chip,
    Fade,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import Button from '@mui/material/Button';

const cx = classNames.bind(styles);

function HistoryBook() {
    const token = document.cookie;
    const [dataBooks, setDataBooks] = useState([]);
    const [masinhvien, setMasinhvien] = useState('');
    const [show, setShow] = useState(false);

    const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        overflowX: 'auto', // Cho phép cuộn ngang trên mobile
        background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
        [theme.breakpoints.down('sm')]: {
            minWidth: '100%',
        },
    }));

    const StyledTableHead = styled(TableHead)(({ theme }) => ({
        background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
        '& th': {
            color: '#fff',
            fontWeight: 600,
            padding: theme.spacing(2),
            borderBottom: 'none',
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            whiteSpace: 'nowrap',
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

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        padding: theme.spacing(1.5),
        fontSize: { xs: '0.7rem', sm: '0.875rem' },
        whiteSpace: 'nowrap',
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
                    params: { masinhvien },
                });
                setDataBooks(response.data.data || []);
            } catch (error) {
                setDataBooks([]);
                // toast.error(error.response?.data?.message);
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
                                        <StyledTableCell>Mã Phiếu</StyledTableCell>
                                        <StyledTableCell>Tên Sách</StyledTableCell>
                                        <StyledTableCell>Ngày Mượn</StyledTableCell>
                                        <StyledTableCell>Ngày Hẹn Trả</StyledTableCell>
                                        <StyledTableCell>Ngày Trả</StyledTableCell>
                                        <StyledTableCell>Quá Hạn</StyledTableCell>
                                        <StyledTableCell>Tình Trạng</StyledTableCell>
                                        <StyledTableCell>Hành Động</StyledTableCell>
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody>
                                    {dataBooks.map((item, index) => {
                                        const ngayHenTra = new Date(item.ngayhentra);
                                        const today = new Date();
                                        const quahan = Math.max(
                                            0,
                                            Math.floor((today - ngayHenTra) / (1000 * 60 * 60 * 24))
                                        );

                                        return (
                                            <Fade in timeout={400 + index * 100} key={index}>
                                                <StyledTableRow>
                                                    <StyledTableCell>{item?.maphieumuon || 'N/A'}</StyledTableCell>
                                                    <StyledTableCell>{item?.tensach || 'N/A'}</StyledTableCell>
                                                    <StyledTableCell>{formatDate(item?.ngaymuon)}</StyledTableCell>
                                                    <StyledTableCell>{formatDate(item?.ngayhentra)}</StyledTableCell>
                                                    <StyledTableCell>
                                                        {item?.ngaytra ? formatDate(item.ngaytra) : 'Chưa trả'}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {quahan > 0 && !item.tinhtrang ? (
                                                            <Chip
                                                                label={`${quahan} ngày`}
                                                                color="error"
                                                                size="small"
                                                            />
                                                        ) : (
                                                            'Không'
                                                        )}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {item.tinhtrang === true ||
                                                        item.tinhtrang === 1 ||
                                                        item.tinhtrang === '1' ? (
                                                            <Chip
                                                                icon={<FontAwesomeIcon icon={faCheck} />}
                                                                label="Đã trả"
                                                                color="success"
                                                                size="small"
                                                            />
                                                        ) : (
                                                            <Chip
                                                                icon={
                                                                    <FontAwesomeIcon
                                                                        icon={faSpinner}
                                                                        className="fa-spin"
                                                                    />
                                                                }
                                                                label="Đang mượn"
                                                                color="warning"
                                                                size="small"
                                                            />
                                                        )}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {!item?.tinhtrang && !item?.giahan ? (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => handleExtendBorrowing(item?.maphieumuon)}
                                                                sx={{
                                                                    borderRadius: 20,
                                                                    textTransform: 'none',
                                                                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                                                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                                                    padding: { xs: '4px 8px', sm: '6px 12px' },
                                                                    '&:hover': {
                                                                        transform: 'scale(1.05)',
                                                                        transition: 'all 0.2s',
                                                                    },
                                                                }}
                                                            >
                                                                Gia Hạn
                                                            </Button>
                                                        ) : item?.giahan && !item?.tinhtrang ? (
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                                                            >
                                                                Đã gia hạn
                                                            </Typography>
                                                        ) : null}
                                                    </StyledTableCell>
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