import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import request from '../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ModalDeleteUser({ showModalDeleteUser, setShowModalDeleteUser, masinhvien, onDeleteSuccess }) {
    const handleClose = () => setShowModalDeleteUser(false);

    const handleDeleteUser = async () => {
        try {
            console.log('Deleting user with masinhvien:', masinhvien);
            const res = await request.delete('/api/deleteUser', {
                data: { masinhvien },
            });
            toast.success(res.data.message);
            handleClose();
            onDeleteSuccess(); // Gọi callback để thông báo xóa thành công
        } catch (error) {
            console.error('Error deleting user:', error.response);
            if (error.response?.status === 403) {
                toast.error('Không thể xóa tài khoản admin!');
            } else if (error.response?.status === 404) {
                toast.error('Không tìm thấy người dùng');
            } else {
                toast.error(error.response?.data?.message || 'Lỗi khi xóa người dùng');
            }
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