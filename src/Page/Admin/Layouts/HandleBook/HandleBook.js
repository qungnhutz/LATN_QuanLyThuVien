import { useEffect, useState } from 'react';
import request from '../../../../config/Connect';
import classNames from 'classnames/bind';
import styles from './HandleBooks.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDebounce from '../../../../customHook/useDebounce';

const cx = classNames.bind(styles);

function HandleBook() {
    const [borrowedBooks, setBorrowedBooks] = useState([]); // Danh sách đầy đủ từ /api/GetBorrowedBooks
    const [filteredBooks, setFilteredBooks] = useState([]); // Danh sách hiển thị sau khi lọc
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState('');
    const debounce = useDebounce(searchValue, 500);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const fetchBorrowedBooks = async () => {
        try {
            const response = await request.get('/api/GetBorrowedBooks');
            const data = Array.isArray(response.data) ? response.data : [];
            setBorrowedBooks(data);
            setFilteredBooks(data); // Ban đầu hiển thị toàn bộ danh sách
            setCurrentPage(1);
        } catch (err) {
            console.error('Lỗi khi lấy sách đã mượn:', err);
            setBorrowedBooks([]);
            setFilteredBooks([]);
        }
    };

    const cancelUnconfirmedBorrows = async () => {
        try {
            const response = await request.post('/api/cancelUnconfirmedBorrows');
            if (response.data.success) {
                console.log(response.data.message);
                await fetchBorrowedBooks();
            }
        } catch (err) {
            console.error('Lỗi khi hủy yêu cầu mượn chưa xác nhận:', err.response?.data || err);
        }
    };

    const fetchSearchResults = async () => {
        try {
            if (searchValue.trim() === '') {
                setFilteredBooks(borrowedBooks);
                setCurrentPage(1);
                return;
            }

            const trimmedValue = searchValue.trim();
            // Giả định mã sinh viên bắt đầu bằng "SV" hoặc chỉ chứa số, điều chỉnh theo định dạng thực tế của bạn
            const isStudentId = /^SV\d+$|^\d+$/.test(trimmedValue.toUpperCase());

            let response;
            if (isStudentId) {
                console.log('Tìm kiếm theo masinhvien:', { masinhvien: trimmedValue });
                response = await request.get('/api/SearchBorrows', {
                    params: {
                        masinhvien: trimmedValue,
                        tensach: '',
                    },
                });
            } else {
                console.log('Tìm kiếm theo tensach:', { tensach: trimmedValue });
                response = await request.get('/api/SearchBorrows', {
                    params: {
                        masinhvien: '',
                        tensach: trimmedValue,
                    },
                });
            }

            console.log('Kết quả từ API:', response.data);

            let searchData = Array.isArray(response.data.data) ? response.data.data : [];

            const filtered = borrowedBooks.filter((book) =>
                searchData.some(
                    (searchItem) =>
                        searchItem.maphieumuon === book.maphieumuon &&
                        searchItem.masach === book.masach
                )
            );

            setFilteredBooks(filtered);
            setCurrentPage(1);
        } catch (err) {
            console.error('Lỗi khi tìm kiếm sách mượn:', err.response?.data || err);
            setFilteredBooks([]);
            toast.error(err.response?.data?.message || 'Lỗi khi tìm kiếm sách mượn!');
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await cancelUnconfirmedBorrows();
            await fetchBorrowedBooks();
        };
        initialize();
    }, []);

    useEffect(() => {
        fetchSearchResults();
    }, [debounce, borrowedBooks]);

    const handleConfirmBorrow = async (maphieumuon) => {
        try {
            const response = await request.post('/api/confirmBorrowRequest', { maphieumuon });
            if (response.status === 200) {
                const updatedBooks = borrowedBooks.map((book) =>
                    book.maphieumuon === maphieumuon ? { ...book, confirm: true } : book
                );
                setBorrowedBooks(updatedBooks);
                setFilteredBooks(updatedBooks);
                toast.success('Xác nhận yêu cầu mượn sách thành công!');
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Lỗi khi xác nhận mượn:', err.response?.data || err);
            toast.error(err.response?.data?.message || 'Lỗi khi xác nhận yêu cầu mượn!');
        }
    };

    const handleReturnBook = async (maphieumuon, masach) => {
        const ngaytra = new Date().toISOString().split('T')[0];
        try {
            const response = await request.post('/api/ReturnBook', {
                maphieumuon,
                masach,
                ngaytra,
            });
            if (response.status === 200) {
                const updatedBooks = borrowedBooks.map((book) =>
                    book.maphieumuon === maphieumuon
                        ? { ...book, tinhtrang: true, ngaytra }
                        : book
                );
                setBorrowedBooks(updatedBooks);
                setFilteredBooks(updatedBooks);
                toast.success('Trả sách thành công!');
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Lỗi khi trả sách:', err.response?.data || err);
            toast.error(err.response?.data?.message || 'Lỗi khi trả sách!');
        }
    };

    const handleExtendBorrowing = async (maphieumuon) => {
        try {
            const response = await request.post('/api/ExtendBorrowing', { maphieumuon });
            if (response.status === 200) {
                const updatedBooks = borrowedBooks.map((book) =>
                    book.maphieumuon === maphieumuon
                        ? { ...book, ngayhentra: response.data.newDueDate }
                        : book
                );
                setBorrowedBooks(updatedBooks);
                setFilteredBooks(updatedBooks);
                toast.success('Gia hạn thời gian mượn thành công!');
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Lỗi khi gia hạn:', err.response?.data || err);
            toast.error(err.response?.data?.message || 'Lỗi khi gia hạn thời gian mượn!');
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container my-4">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="row mb-4 align-items-center">
                <div className="col-12 col-md-8 text-center text-md-start">
                    <h4 className="fw-bold mb-0">Quản Lý Sách Mượn</h4>
                </div>
                <div className="col-12 col-md-4">
                    <form className="d-flex justify-content-md-end">
                        <input
                            className="form-control w-100 w-md-75"
                            type="search"
                            placeholder="Tìm mã sinh viên"
                            aria-label="Search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </form>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th scope="col">Mã Phiếu</th>
                        <th scope="col">Mã SV</th>
                        <th scope="col">Mã Sách</th>
                        <th scope="col">Tên Sách</th>
                        <th scope="col">Số Lượng</th>
                        <th scope="col">Ngày Mượn</th>
                        <th scope="col">Ngày Hẹn Trả</th>
                        <th scope="col">Quá Hạn</th>
                        <th scope="col">Trạng Thái</th>
                        <th scope="col">Xác Nhận</th>
                        <th scope="col">Hành Động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((book) => (
                            <tr key={book.maphieumuon}>
                                <td>{book.maphieumuon}</td>
                                <td>{book.masinhvien}</td>
                                <td>{book.masach}</td>
                                <td>{book.tensach}</td>
                                <td>{book.soluong || 1}</td>
                                <td>{formatDate(book.ngaymuon)}</td>
                                <td>{formatDate(book.ngayhentra)}</td>
                                <td className={book.quahan > 0 ? 'text-danger fw-bold' : ''}>
                                    {book.quahan > 0 ? `${book.quahan} ngày` : 'Không'}
                                </td>
                                <td>
                                    {book.tinhtrang ? (
                                        <span className="text-success">
                                            <FontAwesomeIcon icon={faCheck} className="me-1" /> Đã trả
                                        </span>
                                    ) : (
                                        <span className="text-danger">
                                            <FontAwesomeIcon icon={faTimes} className="me-1" /> Chưa trả
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {!book.confirm && !book.tinhtrang && (
                                        <button
                                            className="btn btn-success btn-sm w-100"
                                            onClick={() => handleConfirmBorrow(book.maphieumuon)}
                                        >
                                            Xác nhận
                                        </button>
                                    )}
                                </td>
                                <td>
                                    {book.confirm && !book.tinhtrang ? (
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleReturnBook(book.maphieumuon, book.masach)}
                                            >
                                                Trả Sách
                                            </button>
                                            <button
                                                className="btn btn-info btn-sm"
                                                onClick={() => handleExtendBorrowing(book.maphieumuon)}
                                            >
                                                Gia Hạn
                                            </button>
                                        </div>
                                    ) : book.tinhtrang ? (
                                        <span>{formatDate(book.ngaytra)}</span>
                                    ) : (
                                        <span>-</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center">
                                Không có dữ liệu sách mượn
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {filteredBooks.length > 0 && (
                <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center mt-3">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Trước
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <li
                                key={page}
                                className={`page-item ${currentPage === page ? 'active' : ''}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Sau
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}

export default HandleBook;