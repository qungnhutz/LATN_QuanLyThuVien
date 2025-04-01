import classNames from 'classnames/bind';
import styles from '../ManagementUser/ManagementUser.module.scss';
import request from '../../../../config/Connect';
import { useEffect, useState } from 'react';
import ModalEditLocation from '../../../../Modal/Location/ModalEditLocation';
import ModalDeleteLocation from '../../../../Modal/Location/ModaDeleteLocation';
import ModalAddLocation from '../../../../Modal/Location/ModalAddLocation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const cx = classNames.bind(styles);

function ManagementLocation() {
    const [dataLocation, setDataLocation] = useState([]);
    const [showModalAddLocation, setShowModalAddLocation] = useState(false);
    const [showModalEditLocation, setShowModalEditLocation] = useState(false);
    const [showModalDeleteLocation, setShowModalDeleteLocation] = useState(false);
    const [valueSearch, setValueSearch] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedMavitri, setSelectedMavitri] = useState('');
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [bookDetails, setBookDetails] = useState([]);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const handleModalAddLocation = () => {
        setShowModalAddLocation(!showModalAddLocation);
    };

    const handleModalEditLocation = (location) => {
        setShowModalEditLocation(!showModalEditLocation);
        setSelectedLocation(location);
    };

    const handleModalDeleteLocation = (mavitri) => {
        setShowModalDeleteLocation(!showModalDeleteLocation);
        setSelectedMavitri(mavitri);
    };

    const handleDeleteSuccess = () => {
        setShouldRefresh(!shouldRefresh);
    };

    const handleEditSuccess = () => {
        setShouldRefresh(!shouldRefresh);
    };

    const handleAddSuccess = () => {
        setShouldRefresh(!shouldRefresh);
    };

    const handleShowDetail = async (mavitri) => {
        try {
            const res = await request.get(`/api/getBooksByLocation?mavitri=${mavitri}`);
            console.log('Dữ liệu từ API:', res.data);
            const books = res.data.data || [];
            setBookDetails(books);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sách:', error);
            if (error.response?.status === 404) {
                toast.info('Không có sách nào tại vị trí này!', { autoClose: 3000 });
                setBookDetails([]);
            } else {
                toast.error('Lỗi khi lấy chi tiết sách!', { autoClose: 3000 });
                setBookDetails([]);
            }
            setShowDetailModal(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    useEffect(() => {
        request
            .get('/api/getAllLocations')
            .then((res) => {
                setDataLocation(res.data.data || []);
                setCurrentPage(1);
            })
            .catch((error) => console.error('Error fetching locations:', error));
    }, [shouldRefresh]);

    const filteredLocations = dataLocation.filter((location) =>
        location.mavitri.toLowerCase().includes(valueSearch.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLocations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer />
            <div className="container my-4">
                <div className="row align-items-center justify-content-between g-3">
                    <div className="col-12 col-md-4 text-center text-md-start">
                        <h4 className="mb-0 fw-bold">Quản Lý Vị Trí</h4>
                    </div>
                    <div className="col-12 col-md-5">
                        <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Tìm kiếm theo mã vị trí"
                                aria-label="Search"
                                value={valueSearch}
                                onChange={(e) => setValueSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </form>
                    </div>
                    <div className="col-12 col-md-3 text-center text-md-end">
                        <button
                            onClick={handleModalAddLocation}
                            className="btn btn-primary w-100 w-md-auto"
                        >
                            <i className="bi bi-plus-lg me-2"></i>Thêm Vị Trí
                        </button>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered align-middle">
                        <thead className="table-dark">
                        <tr>
                            <th scope="col">Mã Vị Trí</th>
                            <th scope="col">Cơ Sở</th>
                            <th scope="col">Số Kệ</th>
                            <th scope="col">Hành Động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item._id}>
                                    <th scope="row">{item.mavitri}</th>
                                    <td>{item.coso}</td>
                                    <td>{item.soke}</td>
                                    <td>
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button
                                                onClick={() => handleShowDetail(item.mavitri)}
                                                className="btn btn-info btn-sm"
                                            >
                                                <i className="bi bi-eye me-1"></i> Chi tiết
                                            </button>
                                            <button
                                                onClick={() => handleModalEditLocation(item)}
                                                className="btn btn-warning btn-sm"
                                            >
                                                <i className="bi bi-pencil me-1"></i> Sửa
                                            </button>
                                            <button
                                                onClick={() => handleModalDeleteLocation(item.mavitri)}
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
                                <td colSpan="4" className="text-center">Không có vị trí nào</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {filteredLocations.length > 0 && (
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

            {showDetailModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi Tiết Sách Theo Vị Trí</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDetailModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered">
                                        <thead>
                                        <tr>
                                            <th>Mã Sách</th>
                                            <th>Tên Sách</th>
                                            <th>Tác Giả</th>
                                            <th>Nhà Xuất Bản</th>
                                            <th>Năm XB</th>
                                            <th>Số Lượng</th>
                                            <th>Ngày Cập Nhật</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {bookDetails.length > 0 ? (
                                            bookDetails.map((book) => (
                                                <tr key={book._id}>
                                                    <td>{book.masach}</td>
                                                    <td>{book.tensach}</td>
                                                    <td>{book.tacgia}</td>
                                                    <td>{book.nhaxuatban}</td>
                                                    <td>{book.namxb}</td>
                                                    <td>
                                                        {book.vitri.find(v => v.mavitri === bookDetails[0]?.vitri[0]?.mavitri)?.soluong || 0}
                                                    </td>
                                                    <td>{formatDate(book.ngaycapnhat)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center">
                                                    Không có sách nào tại vị trí này
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetailModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ModalAddLocation
                showModalAddLocation={showModalAddLocation}
                setShowModalAddLocation={setShowModalAddLocation}
                onAddSuccess={handleAddSuccess}
            />
            <ModalEditLocation
                locationData={selectedLocation}
                showModalEditLocation={showModalEditLocation}
                setShowModalEditLocation={setShowModalEditLocation}
                onEditSuccess={handleEditSuccess}
            />
            <ModalDeleteLocation
                showModalDeleteLocation={showModalDeleteLocation}
                setShowModalDeleteLocation={setShowModalDeleteLocation}
                mavitri={selectedMavitri}
                onDeleteSuccess={handleDeleteSuccess}
            />
        </div>
    );
}

export default ManagementLocation;