import classNames from 'classnames/bind';
import styles from './ManagementBooks.module.scss';
import { useEffect, useState } from 'react';
import ModalAddBook from '../../../../Modal/Books/ModalAddBook';
import ModalEditBook from '../../../../Modal/Books/ModalEditBook';
import ModalDeleteBook from '../../../../Modal/Books/ModalDeleteBook';
import DetailBookModal from '../../../../Modal/Books/ModalDetailBook'; // Import DetailBookModal
import request from '../../../../config/Connect';
import useDebounce from '../../../../customHook/useDebounce';
import 'bootstrap/dist/css/bootstrap.min.css';

const cx = classNames.bind(styles);

function ManagementBooks() {
    const [showModalAddBook, setShowModalAddBook] = useState(false);
    const [showModalEditBook, setShowModalEditBook] = useState(false);
    const [showModalDeleteBook, setShowModalDeleteBook] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [idBook, setIdBook] = useState('');
    const [masachBook, setMasachBook] = useState('');
    const [selectedMasach, setSelectedMasach] = useState('');
    const [dataBooks, setDataBooks] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const debounce = useDebounce(searchValue, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        request
            .get('/api/GetBooks')
            .then((res) => {
                setDataBooks(res.data);
                setCurrentPage(1);
                console.log('Danh sách sách:', res.data);
            })
            .catch((error) => console.error('Lỗi khi lấy sách:', error));
    }, [showModalAddBook, showModalEditBook, showModalDeleteBook]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                if (searchValue.trim() === '') {
                    const res = await request.get('/api/GetBooks');
                    setDataBooks(res.data);
                    setCurrentPage(1);
                    return;
                }

                const res = await request.get('/api/SearchProduct', {
                    params: { tensach: debounce },
                });

                setDataBooks(res.data);
                setCurrentPage(1);
            } catch (error) {
                console.error('Lỗi khi tìm kiếm:', error);
                if (error.response?.status === 400) {
                    console.log('Thông báo từ server:', error.response.data.message);
                    setDataBooks([]);
                } else if (error.response?.status === 404) {
                    console.log('Thông báo từ server:', error.response.data.message);
                    setDataBooks([]);
                } else {
                    console.error('Lỗi server:', error.response?.data?.message || 'Lỗi không xác định');
                    setDataBooks([]);
                }
            }
        };

        fetchSearchResults();
    }, [debounce]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataBooks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dataBooks.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleShow = () => {
        setShowModalAddBook(!showModalAddBook);
    };

    const handleShow1 = (masach) => {
        setShowModalEditBook(!showModalEditBook);
        setIdBook(masach);
    };

    const handleShow2 = (masach) => {
        console.log('Mã sách được chọn để xóa:', masach);
        setMasachBook(masach);
        setShowModalDeleteBook(true);
    };

    const handleShowDetail = (masach) => {
        setSelectedMasach(masach);
        setShowDetailModal(true);
    };

    const handleCloseDetail = () => {
        setShowDetailModal(false);
        setSelectedMasach('');
    };

    return (
        <div className={cx('wrapper')}>
            <div className="container my-4">
                <div className="row align-items-center justify-content-between g-3">
                    <div className="col-12 col-md-4 text-center text-md-start">
                        <h4 className="mb-0 fw-bold">Quản Lý Sách</h4>
                    </div>
                    <div className="col-12 col-md-5">
                        <form className="d-flex">
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Tìm tên sách"
                                aria-label="Search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </form>
                    </div>
                    <div className="col-12 col-md-3 text-center text-md-end">
                        <button onClick={handleShow} className="btn btn-primary w-100 w-md-auto">
                            <i className="bi bi-plus-lg me-2"></i>Thêm Sách
                        </button>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered align-middle">
                        <thead className="table-dark">
                        <tr>
                            <th scope="col">Mã Sách</th>
                            <th scope="col">Tên Sách</th>
                            <th scope="col">Tác Giả</th>
                            <th scope="col">Nhà Xuất Bản</th>
                            <th scope="col">Phiên Bản</th>
                            <th scope="col">Danh Mục</th>
                            <th scope="col">Năm XB</th>
                            <th scope="col">Vị Trí</th>
                            <th scope="col">Số Lượng Hiện Tại</th>
                            <th scope="col">Ngày Cập Nhật</th>
                            <th scope="col">Hành Động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.masach}>
                                    <th scope="row">{item.masach}</th>
                                    <td>{item.tensach}</td>
                                    <td>{item.tacgia}</td>
                                    <td>{item.nhaxuatban}</td>
                                    <td>{item.phienban}</td>
                                    <td>{item.madanhmuc}</td>
                                    <td>{item.namxb}</td>
                                    <td>{item.vitri.map((e) => `${e.mavitri}, `) || 'N/A'}</td>
                                    <td>{item.Tongsoluong || item.currentQuantity || 0}</td>
                                    <td>{formatDate(item.ngaycapnhat)}</td>
                                    <td>
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button
                                                onClick={() => handleShowDetail(item.masach)}
                                                className="btn btn-info btn-sm"
                                            >
                                                <i className="bi bi-eye me-1"></i> Xem
                                            </button>
                                            <button
                                                onClick={() => handleShow1(item.masach)}
                                                className="btn btn-warning btn-sm"
                                            >
                                                <i className="bi bi-pencil me-1"></i> Sửa
                                            </button>
                                            <button
                                                onClick={() => handleShow2(item.masach)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                <i className="bi bi-trash me-1"></i> Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center">
                                    Không tìm thấy sách nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {dataBooks.length > 0 && (
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

            <ModalAddBook showModalAddBook={showModalAddBook} setShowModalAddBook={setShowModalAddBook} />
            <ModalEditBook
                showModalEditBook={showModalEditBook}
                setShowModalEditBook={setShowModalEditBook}
                idBook={idBook}
            />
            <ModalDeleteBook
                showModalDeleteBook={showModalDeleteBook}
                setShowModalDeleteBook={setShowModalDeleteBook}
                masach={masachBook}
            />
            <DetailBookModal
                open={showDetailModal}
                onClose={handleCloseDetail}
                masach={selectedMasach} // Truyền masach từ selectedMasach
            />
        </div>
    );
}

export default ManagementBooks;