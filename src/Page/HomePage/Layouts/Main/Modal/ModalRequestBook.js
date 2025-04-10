import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import request from '../../../../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ModalRequestBook({ show, setShow, masach, tensach, vitri }) {
    const handleClose = () => setShow(false);
    const [quantity, setQuantity] = useState(1);
    // Đặt ngày mượn mặc định là hôm nay
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setNgaymuon(today);
    }, []);

    const [ngaymuon, setNgaymuon] = useState('');
    const [mavitri, setMavitri] = useState('');
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        if (show && vitri && Array.isArray(vitri)) {
            setLocations(vitri);
            setMavitri(vitri[0]?.mavitri || ''); // Chọn vị trí đầu tiên mặc định
        } else if (show) {
            toast.error('Không có thông tin vị trí sách!');
            setLocations([]);
            setMavitri('');
        }
    }, [show, vitri]);

    const handleRequestBook = async () => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
        try {
            const res = await request.post(
                '/api/requestborrowbook',
                {
                    masach,
                    tensach,
                    quantity: parseInt(quantity),
                    mavitri,
                    ngaymuon,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.data.message === 'Mượn sách thành công !!!') {
                toast.success('Yêu cầu mượn sách thành công!');
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
        }
    };

    return (
        <>
            <ToastContainer />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Yêu Cầu Mượn Sách</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-floating mb-3">
                        <input value={masach || ''} className="form-control" disabled />
                        <label>Mã Sách</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input value={tensach || ''} className="form-control" disabled />
                        <label>Tên Sách</label>
                    </div>
                    <div className="form-floating mb-3">
                        <select
                            className="form-control"
                            value={mavitri}
                            onChange={(e) => setMavitri(e.target.value)}
                        >
                            {locations.length > 0 ? (
                                locations.map((loc) => (
                                    <option key={loc.mavitri} value={loc.mavitri}>
                                        {loc.mavitri} (Số lượng có thể mượn: {loc.soluong - loc.soluongmuon})
                                    </option>
                                ))
                            ) : (
                                <option value="">Không có vị trí nào</option>
                            )}
                        </select>
                        <label>Mã Vị Trí</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="date"
                            className="form-control"
                            value={ngaymuon}
                            onChange={(e) => setNgaymuon(e.target.value)}
                        />
                        <label>Ngày Mượn</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="number"
                            className="form-control"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                        <label>Số Lượng</label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleRequestBook}>
                        Gửi Yêu Cầu
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalRequestBook;