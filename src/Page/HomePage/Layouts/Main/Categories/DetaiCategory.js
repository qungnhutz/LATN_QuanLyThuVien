import classNames from 'classnames/bind';
import styles from './DetailCategory.module.scss';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import MenuLeft from '../../MenuLeft/MenuLeft';
import MainBooks from '../ListBook/Mainbook';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import request from '../../../../../config/Connect';
import { Box, Typography } from '@mui/material';

const cx = classNames.bind(styles);

function DetailCategory() {
    const [books, setBooks] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const { madanhmuc } = useParams(); // Lấy madanhmuc từ URL

    useEffect(() => {
        const fetchBooksByCategory = async () => {
            console.log('madanhmuc từ URL:', madanhmuc); // Debug giá trị madanhmuc
            if (!madanhmuc) {
                setBooks([]);
                setCategoryName('Không có mã danh mục');
                return;
            }

            try {
                const res = await request.get('/api/getBooksByCategory', {
                    params: { madanhmuc: madanhmuc }, // Gửi madanhmuc như CT_PL
                });
                setBooks(res.data.books);

                // Lấy tendanhmuc để hiển thị tên danh mục
                const categoryRes = await request.get('/api/getAllCategories');
                const category = categoryRes.data.data.find(
                    (cat) => cat.madanhmuc === madanhmuc
                );
                setCategoryName(category ? category.tendanhmuc : madanhmuc);
                console.log('Danh sách sách:', res.data.books);
            } catch (error) {
                console.error('Lỗi khi lấy sách theo danh mục:', error);
                if (error.response?.status === 404) {
                    setBooks([]);
                    const categoryRes = await request.get('/api/getAllCategories');
                    const category = categoryRes.data.data.find(
                        (cat) => cat.madanhmuc === madanhmuc
                    );
                    setCategoryName(category ? category.tendanhmuc : madanhmuc);
                } else if (error.response?.status === 400) {
                    setBooks([]);
                    setCategoryName(madanhmuc || 'Không có mã danh mục');
                }
            }
        };

        fetchBooksByCategory();
    }, [madanhmuc]);

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
                    <Box sx={{ padding: 2 }}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: '#2C3E50',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: 1.5,
                                padding: '10px 0',
                                borderBottom: '3px solid #3498DB',
                                display: 'inline-block',
                            }}
                        >
                            📚 {categoryName ? `Danh mục: ${categoryName}` : 'Danh mục sách'}
                        </Typography>
                        {books.length > 0 ? (
                            <MainBooks dataBooks={books} isMenuOpen={true} /> // Giữ nguyên isMenuOpen để hiển thị 3 cột nếu menu mở
                        ) : (
                            <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                                Không có sách nào trong danh mục này.
                            </Typography>
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

export default DetailCategory;