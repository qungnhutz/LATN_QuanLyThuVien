import classNames from 'classnames/bind';
import styles from './Categories.module.scss';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import MenuLeft from '../../MenuLeft/MenuLeft';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../../../../../config/Connect';
import { Box, Typography, Card, CardContent, Fade, Pagination } from '@mui/material'; // Thêm Pagination
import { motion } from 'framer-motion';

const cx = classNames.bind(styles);

// Dải màu xanh dương
const blueGalaxyColors = [
    '#e0f7fa', // Xanh dương nhạt
    '#80deea', // Xanh ngọc sáng
    '#26c6da', // Xanh dương trung
    '#0288d1', // Xanh dương đậm
    '#01579b', // Xanh dương tối
];

// Hằng số phân trang
const ITEMS_PER_PAGE = 16; // Số danh mục mỗi trang (có thể điều chỉnh)

// Hàm chọn màu ngẫu nhiên từ dải màu
const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * blueGalaxyColors.length);
    return blueGalaxyColors[randomIndex];
};

// Hàm chuyển hex sang RGB
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
};

// Hàm tính độ sáng (luminance) theo công thức W3C
const getLuminance = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const { r, g, b } = rgb;
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

// Hàm chọn màu chữ dựa trên độ sáng
const getTextColor = (bgColor) => {
    const luminance = getLuminance(bgColor);
    return luminance > 0.5 ? '#333' : '#fff'; // Nền sáng -> chữ tối, nền tối -> chữ trắng
};

function Categories() {
    const [categories, setCategories] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Thêm state cho trang hiện tại
    const navigate = useNavigate();

    const fetchAllCategories = async () => {
        try {
            const res = await request.get('/api/getAllCategories');
            setCategories(res.data.data);
            setCurrentPage(1); // Reset về trang 1 khi dữ liệu thay đổi
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
            setCategories([]);
        }
    };

    const searchCategoriesByName = async (query) => {
        try {
            const res = await request.get('/api/searchCategories', {
                params: { tendanhmuc: query },
            });
            setCategories(res.data.data);
            setCurrentPage(1); // Reset về trang 1 khi tìm kiếm thay đổi
        } catch (error) {
            console.error('Lỗi khi tìm kiếm danh mục:', error);
            setCategories([]);
        }
    };

    useEffect(() => {
        if (searchValue.trim() === '') {
            fetchAllCategories();
        } else {
            searchCategoriesByName(searchValue);
        }
    }, [searchValue]);

    // Tính toán tổng số trang
    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

    // Lấy dữ liệu cho trang hiện tại
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentCategories = categories.slice(startIndex, endIndex);

    const handleViewDetailCategory = (madanhmuc) => {
        navigate(`/detailCategory/${madanhmuc}`);
    };

    // Xử lý thay đổi trang
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <Header setSearchValue={setSearchValue} />
            </header>

            <div className={cx('main-container')}>
                <aside className={cx('menu-left')}>
                    <MenuLeft />
                </aside>

                <main className={cx('content')}>
                    <Box sx={{ padding: 2 }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)', // 4 card trên mỗi hàng
                                gap: 4,
                            }}
                        >
                            {currentCategories.length > 0 ? (
                                currentCategories.map((category, index) => {
                                    const backgroundColor = getRandomColor();
                                    const textColor = getTextColor(backgroundColor);

                                    return (
                                        <Fade in={true} timeout={500 + index * 100} key={category.madanhmuc}>
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                            >
                                                <Card
                                                    className={cx('card')}
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: 2,
                                                        cursor: 'pointer',
                                                        backgroundColor: backgroundColor,
                                                    }}
                                                    onClick={() => handleViewDetailCategory(category.madanhmuc)}
                                                >
                                                    <CardContent sx={{ position: 'relative', padding: '20px' }}>
                                                        <Typography
                                                            variant="h6"
                                                            component="div"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: textColor,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            {category.tendanhmuc || 'Không có tên'}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: textColor, mb: 0.5 }}
                                                        >
                                                            Mã Danh Mục: {category.madanhmuc || 'Không có mã'}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </Fade>
                                    );
                                })
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: 'center',
                                        width: '100%',
                                        color: '#666',
                                        py: 4,
                                    }}
                                >
                                    Không tìm thấy danh mục nào
                                </Typography>
                            )}
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
                    </Box>
                </main>
            </div>

            <footer className={cx('footer')}>
                <Footer />
            </footer>
        </div>
    );
}

export default Categories;