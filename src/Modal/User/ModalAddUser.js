import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import request from '../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

function ModalAddUser({ showModalAddUser, setShowModalAddUser, onAddSuccess }) {
    const [hoten, setHoten] = useState('');
    const [address, setAddress] = useState('');
    const [brithday, setBrithday] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [masinhvien, setMasinhvien] = useState('');
    const [sdt, setSdt] = useState('');
    const [typereader, setTypereader] = useState('Sinh viên');

    const handleClose = () => {
        setShowModalAddUser(false);
        setHoten('');
        setAddress('');
        setBrithday('');
        setPassword('');
        setEmail('');
        setMasinhvien('');
        setSdt('');
        setTypereader('student');
    };

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

    const handleAddUser = async () => {
        try {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            const phoneRegex = /^\+?\d{10,15}$/;

            if (!masinhvien || !password || !email) {
                toast.error('Vui lòng nhập mã sinh viên, mật khẩu và email!', toastOptions);
                return;
            }

            if (!dateRegex.test(brithday)) {
                toast.error('Vui lòng chọn ngày sinh hợp lệ!', toastOptions);
                return;
            }

            if (sdt && !phoneRegex.test(sdt)) {
                toast.error('Số điện thoại không hợp lệ!', toastOptions);
                return;
            }

            const res = await request.post('/api/createUser', {
                masinhvien,
                password,
                email,
                hoten,
                address,
                brithday,
                sdt,
                typereader,
            });

            toast.success(res.data.message || 'Thêm người dùng thành công!', {
                ...toastOptions,
                onClose: () => {
                    handleClose();
                    onAddSuccess(); // Gọi callback để refresh danh sách
                },
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm người dùng!', toastOptions);
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Modal show={showModalAddUser} onHide={handleClose} size="lg">
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Thêm Người Dùng
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group controlId="formHoten">
                                    <Form.Label>Họ Và Tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập họ và tên"
                                        value={hoten}
                                        onChange={(e) => setHoten(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formAddress">
                                    <Form.Label>Địa Chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập địa chỉ"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBrithday">
                                    <Form.Label>Ngày Sinh</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={brithday}
                                        onChange={(e) => setBrithday(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword">
                                    <Form.Label>Mật Khẩu</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formMasinhvien">
                                    <Form.Label>Mã Sinh Viên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập mã sinh viên"
                                        value={masinhvien}
                                        onChange={(e) => setMasinhvien(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formSdt">
                                    <Form.Label>Số Điện Thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập số điện thoại"
                                        value={sdt}
                                        onChange={(e) => setSdt(e.target.value)}
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formTypereader">
                                    <Form.Label>Loại Độc Giả</Form.Label>
                                    <Form.Select
                                        value={typereader}
                                        onChange={(e) => setTypereader(e.target.value)}
                                        className="shadow-sm"
                                    >
                                        <option value="Sinh viên">Sinh viên</option>
                                        <option value="Giảng viên">Giảng viên</option>
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
                    <Button variant="primary" onClick={handleAddUser} className="px-4">
                        Thêm Mới
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </>
    );
}

export default ModalAddUser;