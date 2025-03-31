import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import request from '../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ModalDeleteLocation({ showModalDeleteLocation, setShowModalDeleteLocation, mavitri, onDeleteSuccess }) {
    const handleClose = () => setShowModalDeleteLocation(false);

    const handleDeleteLocation = async () => {
        try {
            console.log('Deleting location with mavitri:', mavitri);
            const res = await request.delete('/api/deleteLocation', {
                data: { mavitri },
            });
            toast.success(res.data.message || 'Xóa vị trí thành công!');
            handleClose();
            onDeleteSuccess(); // Gọi callback để thông báo xóa thành công
        } catch (error) {
            console.error('Error deleting location:', error.response);
            if (error.response?.status === 400) {
                toast.error(error.response.data.message || 'Không thể xóa vị trí!');
            } else if (error.response?.status === 404) {
                toast.error('Không tìm thấy vị trí!');
            } else {
                toast.error(error.response?.data?.message || 'Lỗi khi xóa vị trí!');
            }
        }
    };

    return (
        <>
            <Modal show={showModalDeleteLocation} onHide={handleClose}>
                <ToastContainer />
                <Modal.Header closeButton>
                    <Modal.Title>Xóa Vị Trí</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn muốn xóa Vị Trí Có Mã: {mavitri}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="danger" onClick={handleDeleteLocation}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteLocation;