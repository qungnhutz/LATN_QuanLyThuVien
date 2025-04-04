import classNames from 'classnames/bind';
import styles from '../ManagementUser/ManagementUser.module.scss';
import request from '../../../../config/Connect';
import { useEffect, useState, useCallback } from 'react';
import ModalAddClearanceBooks from '../../../../Modal/ClearanceBooks/ModalAddClearanceBooks';
import ModalEditClearanceBooks from '../../../../Modal/ClearanceBooks/ModalEditClearanceBooks';
import ModalDeleteClearanceBooks from '../../../../Modal/ClearanceBooks/ModalDeleteClearanceBooks';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const cx = classNames.bind(styles);

const toastOptions = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
};

function ClearanceBooks() {
    const [dataClearanceBooks, setDataClearanceBooks] = useState([]);
    const [showModalAddClearanceBooks, setShowModalAddClearanceBooks] = useState(false);
    const [showModalEditClearanceBooks, setShowModalEditClearanceBooks] = useState(false);
    const [showModalDeleteClearanceBooks, setShowModalDeleteClearanceBooks] = useState(false);
    const [selectedClearanceBook, setSelectedClearanceBook] = useState(null);
    const [selectedMasachthanhly, setSelectedMasachthanhly] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const fetchClearanceBooks = useCallback(async () => {
        setLoading(true);
        try {
            const res = await request.get('/api/getAllClearanceBooks');
            setDataClearanceBooks(res.data.clearanceBooks || []);
            setCurrentPage(1);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sách thanh lý:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi lấy danh sách sách thanh lý!', {
                ...toastOptions,
                toastId: 'fetch-error',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClearanceBooks();
    }, [fetchClearanceBooks, shouldRefresh]);

    const handleExportClearanceBooks = async () => {
        setLoading(true);
        try {
            const res = await request.get('/api/exportClearanceBooks', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'danhsach_thanhly.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Xuất file Excel thành công!', toastOptions);
        } catch (error) {
            console.error('Lỗi khi xuất file:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi xuất file Excel!', toastOptions);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAllClearanceBooks = () => {
        const toastId = 'delete-all-confirm';
        if (toast.isActive(toastId)) {
            return;
        }

        toast(
            <div>
                <p>Bạn có chắc chắn muốn xóa toàn bộ danh sách sách thanh lý không?</p>
                <div className="mt-2 d-flex justify-content-center gap-2">
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const res = await request.delete('/api/deleteAllClearanceBooks');
                                console.log('API response:', res.data);
                                toast.success(res.data.message || 'Xóa toàn bộ danh sách thành công!', toastOptions);
                                setDataClearanceBooks([]);
                                setCurrentPage(1);
                                setShouldRefresh(prev => !prev);
                                // fetchClearanceBooks();
                            } catch (error) {
                                console.error('Lỗi khi xóa toàn bộ:', error);
                                toast.error(error.response?.data?.message || 'Lỗi khi xóa toàn bộ danh sách!', {
                                    ...toastOptions,
                                    toastId: 'delete-all-error',
                                });
                            } finally {
                                setLoading(false);
                                toast.dismiss(toastId);
                            }
                        }}
                    >
                        Xóa
                    </button>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => toast.dismiss(toastId)}
                    >
                        Hủy
                    </button>
                </div>
            </div>,
            {
                ...toastOptions,
                autoClose: false,
                closeButton: false,
                closeOnClick: false,
                toastId: toastId,
            }
        );
    };

    const handleShowAdd = () => setShowModalAddClearanceBooks(true);
    const handleShowEdit = (clearanceBook) => {
        setSelectedClearanceBook(clearanceBook);
        setShowModalEditClearanceBooks(true);
    };
    const handleShowDelete = (masachthanhly) => {
        setSelectedMasachthanhly(masachthanhly);
        setShowModalDeleteClearanceBooks(true);
    };

    const handleSuccess = () => {
        setShouldRefresh(prev => !prev);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Sửa lỗi typo
    const currentItems = dataClearanceBooks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dataClearanceBooks.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer />
            <div className="container my-4">
                <div className="row align-items-center justify-content-between g-3">
                    <div className="col-12 col-md-6 text-center text-md-start">
                        <h4 className="mb-0 fw-bold">Quản Lý Sách Thanh Lý</h4>
                    </div>
                    <div className="col-12 col-md-6 text-center text-md-end">
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                onClick={handleShowAdd}
                                className="btn btn-primary px-4 flex-fill flex-md-grow-0"
                                disabled={loading}
                            >
                                <i className="bi bi-plus-lg me-2"></i>Thêm Sách
                            </button>
                            <button
                                onClick={handleExportClearanceBooks}
                                className="btn btn-success px-4 flex-fill flex-md-grow-0"
                                disabled={loading}
                            >
                                <i className="bi bi-file-earmark-excel me-2"></i>Xuất Excel
                            </button>
                            <button
                                onClick={handleDeleteAllClearanceBooks}
                                className="btn btn-danger px-4 flex-fill flex-md-grow-0"
                                disabled={loading || dataClearanceBooks.length === 0}
                            >
                                <i className="bi bi-trash me-2"></i>Xóa Tất Cả
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {loading ? (
                    <div className="text-center my-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover table-bordered align-middle">
                            <thead className="table-dark">
                            <tr>
                                <th scope="col">Mã Sách Thanh Lý</th>
                                <th scope="col">Mã Sách</th>
                                <th scope="col">Số Lượng</th>
                                <th scope="col">Cơ Sở</th>
                                <th scope="col">Mã Vị Trí</th>
                                <th scope="col">Lý Do</th>
                                <th scope="col">Trạng Thái</th>
                                <th scope="col">Hành Động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <th scope="row">{item.masachthanhly}</th>
                                        <td>{item.masach}</td>
                                        <td>{item.soluong}</td>
                                        <td>{item.coso}</td>
                                        <td>{item.mavitri}</td>
                                        <td>{item.lydo}</td>
                                        <td>{item.trangthai ? 'Đang Thanh Lý' : 'Đã Thanh Lý'}</td>
                                        <td>
                                            <div className="d-flex gap-2 justify-content-center">
                                                <button
                                                    onClick={() => handleShowEdit(item)}
                                                    className="btn btn-warning btn-sm"
                                                    disabled={loading}
                                                >
                                                    <i className="bi bi-pencil me-1"></i> Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleShowDelete(item.masachthanhly)}
                                                    className="btn btn-danger btn-sm"
                                                    disabled={loading}
                                                >
                                                    <i className="bi bi-trash me-1"></i> Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        Không tìm thấy sách thanh lý nào
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && dataClearanceBooks.length > 0 && (
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

            <ModalAddClearanceBooks
                showModalAddClearanceBooks={showModalAddClearanceBooks}
                setShowModalAddClearanceBooks={setShowModalAddClearanceBooks}
                onAddSuccess={handleSuccess}
            />
            <ModalEditClearanceBooks
                clearanceBookData={selectedClearanceBook}
                showModalEditClearanceBooks={showModalEditClearanceBooks}
                setShowModalEditClearanceBooks={setShowModalEditClearanceBooks}
                onEditSuccess={handleSuccess}
            />
            <ModalDeleteClearanceBooks
                showModalDeleteClearanceBooks={showModalDeleteClearanceBooks}
                setShowModalDeleteClearanceBooks={setShowModalDeleteClearanceBooks}
                masachthanhly={selectedMasachthanhly}
                onDeleteSuccess={handleSuccess}
            />
        </div>
    );
}

export default ClearanceBooks;