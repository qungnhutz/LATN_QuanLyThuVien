import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import request from '../../config/Connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ModalDeleteBook({ showModalDeleteBook, setShowModalDeleteBook, masach }) {
    const handleClose = () => setShowModalDeleteBook(false);

    const handleDeleteBook = async () => {
        try {
            console.log('Đang xóa sách với mã:', masach); // Debug để kiểm tra masach
            const res = await request.delete('/api/DeleteBook', {
                data: { masach: masach },
            });

            toast.success(res.data.message || 'Xóa sách thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                onClose: () => setShowModalDeleteBook(false),
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa sách';
            console.error('Lỗi khi xóa:', error.response?.data); // Debug lỗi
            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <>
            <Modal show={showModalDeleteBook} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa Sách</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa sách có mã sách: {masach}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="danger" onClick={handleDeleteBook}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export default ModalDeleteBook;