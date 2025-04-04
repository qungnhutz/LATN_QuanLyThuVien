import classNames from 'classnames/bind';
import styles from './HomePage.module.scss';

import Header from '../Header/Header';
import MainPage from './MainPage';
import { useEffect, useState, useRef } from 'react';
import useDebounce from '../../../../customHook/useDebounce';
import request from '../../../../config/Connect';
import MenuLeft from '../MenuLeft/MenuLeft';
import Footer from '../Footer/Footer';

const cx = classNames.bind(styles);

function HomePage() {
    const [dataBooks, setDataBooks] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const debounce = useDebounce(searchValue, 500);
    useEffect(() => {
        document.title = "Thư viện điện tử - Trang chủ";
        try {
            if (searchValue === '') {
                return;
            }
            request.get('/api/search', { params: { nameBook: debounce } }).then((res) => setDataBooks(res.data));
        } catch (error) {
            console.log(error);
        }
    }, [debounce, searchValue]);



    useEffect(() => {
        request.get('/api/GetBooks').then((res) => setDataBooks(res.data));
    }, []);

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
                    <MainPage dataBooks={dataBooks} setDataBooks={setDataBooks} />
                </main>
            </div>

            <footer className={cx('footer')}>
                <Footer />
            </footer>
        </div>
    );
}

export default HomePage;