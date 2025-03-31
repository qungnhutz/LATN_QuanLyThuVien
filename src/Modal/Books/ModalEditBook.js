import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import request from '../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ModalEditBook({ showModalEditBook, setShowModalEditBook, idBook }) {
    const handleClose = () => setShowModalEditBook(false);

    // State cho các trường dữ liệu
    const [masach, setMasach] = useState('');
    const [img, setImg] = useState('');
    const [tensach, setTensach] = useState('');
    const [tacgia, setTacgia] = useState('');
    const [nhaxuatban, setNhaxuatban] = useState('');
    const [namxb, setNamxb] = useState('');
    const [phienban, setPhienban] = useState('');
    const [madanhmuc, setMadanhmuc] = useState('');
    const [mota, setMota] = useState('');
    const [vitri, setVitri] = useState([{ mavitri: '', soluong: '' }]);
    const [pages, setPages] = useState('');
    const [price, setPrice] = useState('');

    // State cho danh sách danh mục và vị trí từ database
    const [bookGenres, setBookGenres] = useState([]);
    const [locations, setLocations] = useState([]);

    // Cấu hình toast
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

    // Lấy danh sách danh mục và vị trí từ database
    useEffect(() => {
        const fetchCategoriesAndLocations = async () => {
            try {
                const genresRes = await request.get('/api/getAllCategories');
                setBookGenres(genresRes.data.data || []);

                const locationsRes = await request.get('/api/getAllLocations'); // Giả định endpoint tồn tại
                setLocations(locationsRes.data.data || []);
            } catch (error) {
                console.error('Error fetching categories or locations:', error);
                toast.error('Không thể tải danh mục hoặc vị trí!', toastOptions);
            }
        };
        fetchCategoriesAndLocations();
    }, []);

    // Lấy dữ liệu sách khi modal mở hoặc idBook thay đổi
    useEffect(() => {
        if (showModalEditBook && idBook) {
            fetchBookData();
        }
    }, [showModalEditBook, idBook]);

    const fetchBookData = async () => {
        try {
            const res = await request.get('/api/GetBooks');
            const bookData = res.data.find((book) => book.masach === idBook);
            if (bookData) {
                setMasach(bookData.masach || '');
                setImg(bookData.img || '');
                setTensach(bookData.tensach || '');
                setTacgia(bookData.tacgia || '');
                setNhaxuatban(bookData.nhaxuatban || '');
                setNamxb(bookData.namxb || '');
                setPhienban(bookData.phienban || '');
                setMadanhmuc(bookData.madanhmuc || '');
                setMota(bookData.mota || '');
                setVitri(
                    bookData.vitri.map((v) => ({
                        mavitri: v.mavitri,
                        soluong: v.soluong,
                    })) || [{ mavitri: '', soluong: '' }]
                );
                setPages(bookData.pages || '');
                setPrice(bookData.price || '');
            } else {
                toast.error('Không tìm thấy sách!', toastOptions);
            }
        } catch (error) {
            console.error('Error fetching book data:', error);
            toast.error('Không thể tải dữ liệu sách!', toastOptions);
        }
    };

    // Xử lý thêm vị trí mới
    const handleAddLocation = () => {
        setVitri([...vitri, { mavitri: '', soluong: '' }]);
    };

    // Xử lý thay đổi giá trị trong danh sách vị trí
    const handleLocationChange = (index, field, value) => {
        const newVitri = [...vitri];
        newVitri[index][field] = value;
        setVitri(newVitri);
    };

    const handleEditBook = async () => {
        try {
            if (
                !masach ||
                !tensach ||
                !tacgia ||
                !nhaxuatban ||
                !namxb ||
                !phienban ||
                !madanhmuc ||
                !mota ||
                !pages ||
                !price ||
                vitri.some((loc) => !loc.mavitri || !loc.soluong)
            ) {
                toast.error('Vui lòng nhập đầy đủ thông tin!', toastOptions);
                return;
            }

            const bookData = {
                masach,
                img,
                tensach,
                tacgia,
                nhaxuatban,
                namxb: Number(namxb),
                phienban,
                madanhmuc,
                mota,
                vitri: vitri.map((loc) => ({
                    mavitri: loc.mavitri,
                    soluong: Number(loc.soluong),
                })),
                pages: Number(pages),
                price: Number(price),
            };

            const res = await request.put('/api/UpdateBook', bookData);

            toast.success(res.data.message || 'Cập nhật sách thành công!', {
                ...toastOptions,
                onClose: () => handleClose(),
            });
        } catch (error) {
            console.error('Error updating book:', error.response?.data);
            toast.error(error.response?.data?.message || 'Lỗi khi cập nhật sách!', toastOptions);
        }
    };

    return (
        <>
            <Modal show={showModalEditBook} onHide={handleClose} size="lg">
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Sửa Sách
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form>
                        <Row className="g-3">
                            {/* Cột trái */}
                            <Col md={6}>
                                <Form.Group controlId="formMasach">
                                    <Form.Label>Mã Sách</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={masach}
                                        disabled
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formImg">
                                    <Form.Label>Ảnh Sách</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập URL ảnh sách"
                                        value={img}
                                        onChange={(e) => setImg(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formTensach">
                                    <Form.Label>Tên Sách</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên sách"
                                        value={tensach}
                                        onChange={(e) => setTensach(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formTacgia">
                                    <Form.Label>Tác Giả</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên tác giả"
                                        value={tacgia}
                                        onChange={(e) => setTacgia(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formNhaxuatban">
                                    <Form.Label>Nhà Xuất Bản</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập nhà xuất bản"
                                        value={nhaxuatban}
                                        onChange={(e) => setNhaxuatban(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formNamxb">
                                    <Form.Label>Năm Xuất Bản</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Nhập năm xuất bản"
                                        value={namxb}
                                        onChange={(e) => setNamxb(e.target.value)}
                                        min="1800"
                                        max={new Date().getFullYear()}
                                        step="1"
                                        className="shadow-sm"
                                    />
                                </Form.Group>
                            </Col>

                            {/* Cột phải */}
                            <Col md={6}>
                                <Form.Group controlId="formPhienban">
                                    <Form.Label>Phiên Bản</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập phiên bản"
                                        value={phienban}
                                        onChange={(e) => setPhienban(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formMadanhmuc">
                                    <Form.Label>Mã Danh Mục</Form.Label>
                                    <Form.Select
                                        value={madanhmuc}
                                        onChange={(e) => setMadanhmuc(e.target.value)}
                                        className="shadow-sm"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {bookGenres.map((genre) => (
                                            <option key={genre.madanhmuc} value={genre.madanhmuc}>
                                                {genre.madanhmuc} - {genre.tenLoai}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group controlId="formMota">
                                    <Form.Label>Mô Tả</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Nhập mô tả sách"
                                        value={mota}
                                        onChange={(e) => setMota(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPages">
                                    <Form.Label>Số Trang</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Nhập số trang"
                                        value={pages}
                                        onChange={(e) => setPages(e.target.value)}
                                        min="0"
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPrice">
                                    <Form.Label>Giá Sách</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Nhập giá sách"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        min="0"
                                        className="shadow-sm"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Danh sách vị trí */}
                        <Row className="g-3 mt-3">
                            <Col md={12}>
                                <Form.Label>Vị Trí</Form.Label>
                                {vitri.map((loc, index) => (
                                    <Row key={index} className="mb-2">
                                        <Col md={6}>
                                            <Form.Select
                                                value={loc.mavitri}
                                                onChange={(e) =>
                                                    handleLocationChange(index, 'mavitri', e.target.value)
                                                }
                                                className="shadow-sm"
                                            >
                                                <option value="">Chọn vị trí</option>
                                                {locations.map((location) => (
                                                    <option key={location.mavitri} value={location.mavitri}>
                                                        {location.mavitri} - {location.coso} - {location.soke}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Control
                                                type="number"
                                                placeholder="Nhập số lượng"
                                                value={loc.soluong}
                                                onChange={(e) =>
                                                    handleLocationChange(index, 'soluong', e.target.value)
                                                }
                                                min="0"
                                                className="shadow-sm"
                                            />
                                        </Col>
                                    </Row>
                                ))}
                                <Button variant="outline-primary" onClick={handleAddLocation} className="mt-2">
                                    Thêm Vị Trí
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button variant="secondary" onClick={handleClose} className="px-4">
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleEditBook} className="px-4">
                        Lưu Lại
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </>
    );
}

export default ModalEditBook;