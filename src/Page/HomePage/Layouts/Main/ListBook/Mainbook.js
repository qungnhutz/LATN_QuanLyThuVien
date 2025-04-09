import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalRequestBook from '../Modal/ModalRequestBook';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    Pagination,
    PaginationItem,
    Grow,
    Fade,
    Slide,
} from '@mui/material';
import { styled, keyframes } from '@mui/system';

const ITEMS_PER_PAGE = 16;

const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
`;

const float = keyframes`
    0% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0); }
`;

const pageEnter = keyframes`
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
`;

function MainBooks({ dataBooks, isMenuOpen, searchQuery = '', sortOption = '' }) {
    const [show, setShow] = useState(false);
    const [selectedMasach, setSelectedMasach] = useState('');
    const [selectedTensach, setSelectedTensach] = useState('');
    const [selectedVitri, setSelectedVitri] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredBooks, setFilteredBooks] = useState(dataBooks);
    const [pageLoaded, setPageLoaded] = useState(false);
    const navigate = useNavigate();

    const filterBooks = (query) => {
        if (!query) return dataBooks;
        return dataBooks.filter(
            (book) =>
                book.tensach.toLowerCase().includes(query.toLowerCase()) ||
                book.masach.toLowerCase().includes(query.toLowerCase()) ||
                book.tacgia.toLowerCase().includes(query.toLowerCase())
        );
    };

    const sortBooks = (books) => {
        let sortedBooks = [...books];
        switch (sortOption) {
            case 'newest':
                sortedBooks.sort((a, b) => new Date(b.ngaycapnhat) - new Date(a.ngaycapnhat));
                break;
            case 'oldest':
                sortedBooks.sort((a, b) => new Date(a.ngaycapnhat) - new Date(b.ngaycapnhat));
                break;
            case 'az':
                sortedBooks.sort((a, b) => a.tensach.localeCompare(b.tensach));
                break;
            case 'za':
                sortedBooks.sort((a, b) => b.tensach.localeCompare(a.tensach));
                break;
            case 'mostBorrowed':
                sortedBooks.sort((a, b) => {
                    const borrowA = a.vitri.reduce((sum, v) => sum + v.soluongmuon, 0);
                    const borrowB = b.vitri.reduce((sum, v) => sum + v.soluongmuon, 0);
                    return borrowB - borrowA;
                });
                break;
            default:
                break;
        }
        return sortedBooks;
    };

    useEffect(() => {
        const filtered = filterBooks(searchQuery);
        const sorted = sortBooks(filtered);
        setFilteredBooks(sorted);
        setCurrentPage(1);
        setPageLoaded(false);
        setTimeout(() => setPageLoaded(true), 100);
    }, [dataBooks, searchQuery, sortOption]);

    const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentBooks = filteredBooks.slice(startIndex, endIndex);

    const handleShow = (masach, tensach, vitri) => {
        setShow(true);
        setSelectedMasach(masach);
        setSelectedTensach(tensach);
        setSelectedVitri(vitri || []);
    };

    const handleViewDetail = (masach) => {
        navigate(`/detailbook/${masach}`);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        setPageLoaded(false);
        setTimeout(() => setPageLoaded(true), 100);
    };

    const truncateLocation = (vitri) => {
        if (!vitri || vitri.length === 0) return '';
        const fullText = vitri.map((v) => `${v.mavitri} (${v.soluong - v.soluongmuon})`).join(', ');
        const maxLength = 50;
        return fullText.length <= maxLength ? fullText : `${fullText.substring(0, maxLength - 3)}...`;
    };

    const StyledCard = styled(Card)(({ theme }) => ({
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #ffffff, #eef2f7)',
        transition: 'all 0.4s ease',
        position: 'relative',
        '&:hover': {
            transform: 'translateY(-10px) scale(1.03)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
            background: 'linear-gradient(145deg, #f0faff, #e6f0fa)',
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(30, 144, 255, 0.05)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
        },
        '&:hover:before': {
            opacity: 1,
        },
        display: 'flex',
        flexDirection: 'column',
    }));

    const StyledButton = styled(Button)(({ theme }) => ({
        borderRadius: '10px',
        textTransform: 'none',
        fontWeight: 'bold',
        padding: '6px 12px',
        transition: 'all 0.3s ease',
        background: 'linear-gradient(45deg, #1e90ff, #00ced1)',
        color: '#fff',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 20px rgba(30, 144, 255, 0.5)',
            background: 'linear-gradient(45deg, #00ced1, #1e90ff)',
        },
        '&:active': {
            transform: 'translateY(0)',
            animation: `${pulse} 0.3s ease`,
        },
    }));

    const StyledPaginationItem = styled(PaginationItem)(({ theme }) => ({
        '&.Mui-selected': {
            background: 'linear-gradient(45deg, #1e90ff, #00ced1)',
            color: '#fff',
            fontWeight: 'bold',
            animation: `${float} 2s infinite ease-in-out`,
        },
        '&:hover': {
            backgroundColor: '#1e90ff',
            color: '#fff',
            transform: 'scale(1.15)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
    }));

    const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
        height: 250,
        objectFit: 'contain',
        backgroundColor: '#f8fafc',
        padding: '10px',
        borderBottom: '1px solid #e0e7ff',
        transition: 'transform 0.4s ease',
        '&:hover': {
            transform: 'scale(1.1) rotate(2deg)',
        },
        [theme.breakpoints.down('sm')]: {
            height: 200, // Giảm chiều cao ảnh trên mobile
        },
        [theme.breakpoints.down('xs')]: {
            height: 150, // Giảm thêm trên màn hình rất nhỏ
        },
    }));

    return (
        <Fade in={pageLoaded} timeout={600}>
            <Box
                sx={{
                    padding: { xs: 1, sm: 2, md: 3 }, // Giảm padding trên mobile
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh',
                    animation: pageLoaded ? `${pageEnter} 0.6s ease-out` : 'none',
                }}
            >
                <Slide direction="up" in={pageLoaded} timeout={800}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'repeat(1, minmax(250px, 1fr))', // 1 cột trên mobile nhỏ
                                sm: 'repeat(2, minmax(250px, 1fr))', // 2 cột trên mobile lớn
                                md: `repeat(${isMenuOpen ? 3 : 4}, minmax(250px, 1fr))`, // Desktop
                            },
                            gap: { xs: 1, sm: 2, md: 3 }, // Giảm khoảng cách trên mobile
                        }}
                    >
                        {currentBooks.map((item, index) => (
                            <Grow
                                key={item._id}
                                in={pageLoaded}
                                timeout={500 + index * 150}
                                style={{ transformOrigin: 'bottom center' }}
                            >
                                <StyledCard>
                                    <StyledCardMedia
                                        component="img"
                                        image={item.img}
                                        alt={item.tensach}
                                    />
                                    <CardContent sx={{ flexGrow: 1, padding: { xs: 1, sm: 2 } }}>
                                        <Fade in={pageLoaded} timeout={800 + index * 100}>
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#1e90ff',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: { xs: '1rem', sm: '1.25rem' }, // Giảm font trên mobile
                                                }}
                                            >
                                                {item.tensach}
                                            </Typography>
                                        </Fade>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                        >
                                            <strong>Mã Sách:</strong> {item.masach}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                        >
                                            <strong>Tác Giả:</strong> {item.tacgia}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                        >
                                            <strong>Nhà xuất bản:</strong> {item.nhaxuatban}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                        >
                                            <strong>Tổng số sách:</strong> {item.Tongsoluong}
                                        </Typography>
                                        {item.vitri && item.vitri.length > 0 && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                title={item.vitri
                                                    .map((v) => `${v.mavitri} (${v.soluong - v.soluongmuon})`)
                                                    .join(', ')}
                                                sx={{
                                                    mb: 0.5,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                }}
                                            >
                                                <strong>Vị trí:</strong> {truncateLocation(item.vitri)}
                                            </Typography>
                                        )}
                                        <Slide direction="up" in={pageLoaded} timeout={1000 + index * 100}>
                                            <Box
                                                mt={2}
                                                display="flex"
                                                justifyContent="space-between"
                                                sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}
                                            >
                                                <StyledButton
                                                    size="small"
                                                    color="info"
                                                    onClick={() => handleViewDetail(item.masach)}
                                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                                                >
                                                    Xem Chi Tiết
                                                </StyledButton>
                                                <StyledButton
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleShow(item.masach, item.tensach, item.vitri)}
                                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                                                >
                                                    Gửi Yêu Cầu
                                                </StyledButton>
                                            </Box>
                                        </Slide>
                                    </CardContent>
                                </StyledCard>
                            </Grow>
                        ))}
                    </Box>
                </Slide>

                {totalPages > 1 && (
                    <Slide direction="up" in={pageLoaded} timeout={1200}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                                renderItem={(item) => <StyledPaginationItem {...item} />}
                                sx={{
                                    '& .MuiPagination-ul': {
                                        background: '#fff',
                                        borderRadius: '12px',
                                        padding: '8px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    },
                                }}
                            />
                        </Box>
                    </Slide>
                )}

                <ModalRequestBook
                    show={show}
                    setShow={setShow}
                    masach={selectedMasach}
                    tensach={selectedTensach}
                    vitri={selectedVitri}
                />
            </Box>
        </Fade>
    );
}

export default MainBooks;