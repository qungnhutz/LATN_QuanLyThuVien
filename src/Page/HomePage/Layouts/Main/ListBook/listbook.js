import classNames from 'classnames/bind';
import styles from './listbook.module.scss';
import Header from '../../Header/Header';
import { useEffect, useState } from 'react';
import useDebounce from '../../../../../customHook/useDebounce';
import request from '../../../../../config/Connect';
import MenuLeft from '../../MenuLeft/MenuLeft';
import Footer from '../../Footer/Footer';
import MainBooks from './Mainbook';

const cx = classNames.bind(styles);

function ListBook() {
    const [dataBooks, setDataBooks] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const debounce = useDebounce(searchValue, 500);
    const [sortOption, setSortOption] = useState(''); // Thêm state cho sortOption
    useEffect(() => {
        document.title = "Danh sách sách";
    }, []);

    // Gọi API /api/GetBooks để hiển thị danh sách sách ban đầu
    useEffect(() => {
        request
            .get('/api/GetBooks')
            .then((res) => {
                setDataBooks(res.data);
                console.log('Danh sách sách từ /api/GetBooks:', res.data);
            })
            .catch((error) => console.error('Lỗi khi lấy sách:', error));
    }, []);

    // Tìm kiếm sách bằng API /api/SearchProduct
    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                if (searchValue.trim() === '') {
                    // Nếu không có từ khóa, lấy toàn bộ danh sách sách từ /api/GetBooks
                    const res = await request.get('/api/GetBooks');
                    setDataBooks(res.data);
                    return;
                }

                // Gọi API tìm kiếm với từ khóa
                const res = await request.get('/api/SearchProduct', {
                    params: { tensach: debounce }, // Sửa tham số thành tensach
                });
                setDataBooks(res.data); // Dữ liệu đã được định dạng từ backend
                console.log('Kết quả tìm kiếm từ /api/SearchProduct:', res.data);
            } catch (error) {
                console.error('Lỗi khi tìm kiếm:', error);
                if (error.response?.status === 400) {
                    console.log('Thông báo từ server:', error.response.data.message); // "Vui lòng nhập từ khóa tìm kiếm!"
                    setDataBooks([]);
                } else if (error.response?.status === 404) {
                    console.log('Thông báo từ server:', error.response.data.message); // "Không tìm thấy sách !!!"
                    setDataBooks([]);
                } else {
                    console.error('Lỗi server:', error.response?.data?.message || 'Lỗi không xác định');
                    setDataBooks([]);
                }
            }
        };

        fetchSearchResults();
    }, [debounce]);

    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <Header setSearchValue={setSearchValue} setSortOption={setSortOption} />
            </header>

            <div className={cx('main-container')}>
                <aside className={cx('menu-left')}>
                    <MenuLeft />
                </aside>

                <main className={cx('content')}>
                    <MainBooks
                        dataBooks={dataBooks}
                        searchQuery={searchValue}
                        sortOption={sortOption}
                        isMenuOpen={false}
                    />
                </main>
            </div>

            <footer className={cx('footer')}>
                <Footer />
            </footer>
        </div>
    );
}

export default ListBook;