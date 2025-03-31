import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import request from '../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ModalDeleteCategory({ showModalDeleteCategory, setShowModalDeleteCategory, madanhmuc, onDeleteSuccess }) {
    const handleClose = () => setShowModalDeleteCategory(false);

    const handleDeleteCategory = async () => {
        try {
            console.log('Deleting category with madanhmuc:', madanhmuc);
            const res = await request.delete('/api/deleteCategory', {
                data: { madanhmuc },
            });
            toast.success(res.data.message || 'Xóa danh mục thành công!');
            handleClose();
            onDeleteSuccess(); // Gọi callback để thông báo xóa thành công
        } catch (error) {
            console.error('Error deleting category:', error.response);
            if (error.response?.status === 400) {
                toast.error(error.response.data.message || 'Vui lòng cung cấp mã danh mục!');
            } else if (error.response?.status === 404) {
                toast.error('Danh mục không tồn tại!');
            } else {
                toast.error(error.response?.data?.message || 'Lỗi khi xóa danh mục!');
            }
        }
    };

    return (
        <>
            <Modal show={showModalDeleteCategory} onHide={handleClose}>
                <ToastContainer />
                <Modal.Header closeButton>
                    <Modal.Title>Xóa Danh Mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn muốn xóa Danh Mục Có Mã: {madanhmuc}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="danger" onClick={handleDeleteCategory}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteCategory;