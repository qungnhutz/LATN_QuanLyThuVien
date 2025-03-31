import classNames from 'classnames/bind';
import styles from './Categories.module.scss';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import MenuLeft from '../../MenuLeft/MenuLeft';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../../../../../config/Connect';
import { Box, Typography, Card, CardContent } from '@mui/material';

const cx = classNames.bind(styles);

function Categories() {
    const [categories, setCategories] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const fetchAllCategories = async () => {
        try {
            const res = await request.get('/api/getAllCategories');
            setCategories(res.data.data);
            console.log('Danh sách danh mục:', res.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
            setCategories([]);
        }
    };

    const searchCategoriesByName = async (query) => {
        try {
            const res = await request.get('/api/searchCategories', { // Sửa endpoint
                params: { tendanhmuc: query },
            });
            setCategories(res.data.data);
            console.log('Kết quả tìm kiếm:', res.data.data);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm danh mục:', error);
            if (error.response?.status === 400) {
                console.log('Thông báo từ server:', error.response.data.message);
                setCategories([]);
            } else if (error.response?.status === 404) {
                console.log('Thông báo từ server:', error.response.data.message);
                setCategories([]);
            } else {
                console.error('Lỗi server:', error.response?.data?.message || 'Lỗi không xác định');
                setCategories([]);
            }
        }
    };

    useEffect(() => {
        if (searchValue.trim() === '') {
            fetchAllCategories();
        } else {
            searchCategoriesByName(searchValue);
        }
    }, [searchValue]);

    const handleViewDetailCategory = (madanhmuc) => {
        navigate(`/detailCategory/${madanhmuc}`);
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
                                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                gap: 3,
                            }}
                        >
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <Card
                                        key={category.madanhmuc}
                                        sx={{
                                            boxShadow: 3,
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            '&:hover': { boxShadow: 6 },
                                        }}
                                        onClick={() => handleViewDetailCategory(category.madanhmuc)}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" component="div">
                                                {category.tendanhmuc || 'Không có tên'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Mã Danh Mục: {category.madanhmuc || 'Không có mã'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Mô tả: {category.description || 'Không có mô tả'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography variant="body1" sx={{ textAlign: 'center', width: '100%' }}>
                                    Không tìm thấy danh mục nào
                                </Typography>
                            )}
                        </Box>
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