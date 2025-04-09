import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import request from '../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ModalDeleteUser({ showModalDeleteUser, setShowModalDeleteUser, masinhvien, onDeleteSuccess }) {
    const handleClose = () => setShowModalDeleteUser(false);

    const handleDeleteUser = async () => {
        try {
            const res = await request.delete('/api/deleteUser', {
                data: { masinhvien },
            });
            toast.success(res.data.message);
            handleClose();
            onDeleteSuccess();
        } catch (error) {
                toast.error(error.response?.data?.message);
        }
    };

    return (
        <>
            <Modal show={showModalDeleteUser} onHide={handleClose}>
                <ToastContainer />
                <Modal.Header closeButton>
                    <Modal.Title>Xóa Người Dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn muốn xóa Người Dùng Có Mã Sinh Viên: {masinhvien}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteUser;