import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import request from '../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';

function ModalEditClearanceBooks({ showModalEditClearanceBooks, setShowModalEditClearanceBooks, clearanceBookData, onEditSuccess }) {
    const [masachthanhly, setMasachthanhly] = useState('');
    const [masach, setMasach] = useState('');
    const [soluong, setSoluong] = useState('');
    const [mavitri, setMavitri] = useState('');
    const [lydo, setLydo] = useState('');
    const [trangthai, setTrangthai] = useState(true);

    useEffect(() => {
        if (clearanceBookData) {
            setMasachthanhly(clearanceBookData.masachthanhly || '');
            setMasach(clearanceBookData.masach || '');
            setSoluong(clearanceBookData.soluong || '');
            setMavitri(clearanceBookData.mavitri || '');
            setLydo(clearanceBookData.lydo || '');
            setTrangthai(clearanceBookData.trangthai !== undefined ? clearanceBookData.trangthai : true);
            console.log('Initial clearance book data:', clearanceBookData);
        }
    }, [clearanceBookData]);

    const handleClose = () => setShowModalEditClearanceBooks(false);

    const toastOptions = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    };

    const handleEditClearanceBook = async () => {
        try {
            const dataToSend = { masachthanhly, masach, soluong, mavitri, lydo, trangthai };
            const res = await request.put('/api/editClearanceBook', dataToSend);

            toast.success(res.data.message || 'Cập nhật sách thanh lý thành công!', {
                ...toastOptions,
                onClose: () => {
                    handleClose();
                    onEditSuccess();
                },
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!', toastOptions);
            console.error('Error:', error.response?.data || error.message);
        }
    };

    return (
        <>
            <Modal show={showModalEditClearanceBooks} onHide={handleClose} size="lg">
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title style={{ fontSize: ' You1.5rem', fontWeight: 'bold' }}>
                        Chỉnh Sửa Sách Thanh Lý
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Group controlId="formMasachthanhly">
                                    <Form.Label>Mã Sách Thanh Lý</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={masachthanhly}
                                        disabled
                                        className="shadow-sm"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="formMasach">
                                    <Form.Label>Mã Sách</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={masach}
                                        disabled
                                        className="shadow-sm"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="formSoluong">
                                    <Form.Label>Số Lượng</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Nhập số lượng"
                                        value={soluong}
                                        onChange={(e) => setSoluong(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="formMavitri">
                                    <Form.Label>Mã Vị Trí</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập mã vị trí"
                                        value={mavitri}
                                        onChange={(e) => setMavitri(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="formLydo">
                                    <Form.Label>Lý Do</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập lý do thanh lý"
                                        value={lydo}
                                        onChange={(e) => setLydo(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="formTrangthai">
                                    <Form.Label>Trạng Thái</Form.Label>
                                    <Form.Select
                                        value={trangthai}
                                        onChange={(e) => setTrangthai(e.target.value === 'true')}
                                        className="shadow-sm"
                                    >
                                        <option value={true}>Đang Thanh Lý</option>
                                        <option value={false}>Đã Thanh Lý</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button variant="secondary" onClick={handleClose} className="px-4">
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleEditClearanceBook} className="px-4">
                        Lưu Lại
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*<ToastContainer />*/}
        </>
    );
}

export default ModalEditClearanceBooks;