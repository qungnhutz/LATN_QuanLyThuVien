import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import request from '../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ModalDeleteClearanceBooks({ showModalDeleteClearanceBooks, setShowModalDeleteClearanceBooks, masachthanhly, onDeleteSuccess }) {
    const handleClose = () => setShowModalDeleteClearanceBooks(false);

    const handleDeleteClearanceBook = async () => {
        try {
            const res = await request.delete('/api/deleteClearanceBook', {
                params: { masachthanhly }, // Sử dụng params thay vì data vì API dùng query
            });
            toast.success(res.data.message || 'Xóa sách thanh lý thành công!');
            handleClose();
            onDeleteSuccess(); // Gọi callback để thông báo xóa thành công
        } catch (error) {
            console.error('Error deleting clearance book:', error.response);
            if (error.response?.status === 400) {
                toast.error(error.response.data.message || 'Không thể xóa sách thanh lý!');
            } else if (error.response?.status === 404) {
                toast.error('Không tìm thấy sách thanh lý!');
            } else {
                toast.error(error.response?.data?.message || 'Lỗi khi xóa sách thanh lý!');
            }
        }
    };

    return (
        <>
            <Modal show={showModalDeleteClearanceBooks} onHide={handleClose}>
                <ToastContainer />
                <Modal.Header closeButton>
                    <Modal.Title>Xóa Sách Thanh Lý</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn muốn xóa sách thanh lý có mã: {masachthanhly}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="danger" onClick={handleDeleteClearanceBook}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteClearanceBooks;