import classNames from 'classnames/bind';
import styles from './MainBooks.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalRequestBook from '../Modal/ModalRequestBook';
import { Card, CardContent, CardMedia, Typography, Button, Box, Pagination } from '@mui/material';

const cx = classNames.bind(styles);
const ITEMS_PER_PAGE = 16; // Số lượng sách mỗi trang

function MainBooks({ dataBooks, isMenuOpen }) {
    const [show, setShow] = useState(false);
    const [selectedMasach, setSelectedMasach] = useState('');
    const [selectedTensach, setSelectedTensach] = useState('');
    const [selectedVitri, setSelectedVitri] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại
    const navigate = useNavigate();

    // Tính toán tổng số trang
    const totalPages = Math.ceil(dataBooks.length / ITEMS_PER_PAGE);

    // Lấy dữ liệu cho trang hiện tại
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentBooks = dataBooks.slice(startIndex, endIndex);

    const handleShow = (masach, tensach, vitri) => {
        setShow(true);
        setSelectedMasach(masach);
        setSelectedTensach(tensach);
        setSelectedVitri(vitri || []);
    };

    const handleViewDetail = (masach) => {
        navigate(`/detailbook/${masach}`);
    };

    // Xử lý thay đổi trang
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box className={cx('wrapper')}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${isMenuOpen ? 3 : 4}, minmax(250px, 1fr))`,
                    gap: 3,
                    padding: 2,
                }}
            >
                {currentBooks.map((item) => (
                    <Card
                        key={item._id}
                        sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                    >
                        <CardMedia
                            component="img"
                            image={item.img}
                            alt={item.tensach}
                            sx={{ height: 250, objectFit: 'contain', backgroundColor: '#f5f5f5' }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="div" gutterBottom>
                                {item.tensach}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Mã Sách: {item.masach}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tác Giả: {item.tacgia}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Nhà xuất bản: {item.nhaxuatban}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Số lượng sách còn lại: {item.Tongsoluong}
                            </Typography>
                            {item.vitri && item.vitri.length > 0 && (
                                <Typography variant="body2" color="text.secondary">
                                    Vị trí:{' '}
                                    {item.vitri.map((v) => `${v.mavitri} (${v.soluong - v.soluongmuon})`).join(', ')}
                                </Typography>
                            )}
                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button size="small" color="primary" onClick={() => handleViewDetail(item.masach)}>
                                    Xem Chi Tiết
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleShow(item.masach, item.tensach, item.vitri)}
                                >
                                    Gửi Yêu Cầu
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Phân trang */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}

            <ModalRequestBook
                show={show}
                setShow={setShow}
                masach={selectedMasach}
                tensach={selectedTensach}
                vitri={selectedVitri}
            />
        </Box>
    );
}

export default MainBooks;