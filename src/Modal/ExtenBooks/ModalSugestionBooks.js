import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import request from '../../config/Connect';

// Tùy chỉnh style cho Dialog
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '12px',
        padding: theme.spacing(2),
        maxWidth: '500px',
        width: '100%',
    },
}));

// Tùy chỉnh ListItem
const StyledListItem = styled(ListItem)(({ theme }) => ({
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    marginBottom: theme.spacing(1),
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
    },
}));

const ModalSugestionBooks = ({ show, handleClose }) => {
    const [borrowList, setBorrowList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show) {
            fetchBorrows();
        }
    }, [show]);

    const fetchBorrows = async () => {
        setLoading(true);
        setError(null);
        try {
            // Gọi API để lấy danh sách phiếu mượn
            const response = await request.get('/api/GetBorrowsByStudent', {
                withCredentials: true, // Để gửi cookie chứa token
            });

            if (response.data.message === 'Danh sách phiếu mượn') {
                // Lọc các phiếu mượn sắp hết hạn (còn 3 ngày hoặc ít hơn, chưa quá hạn)
                const today = moment().startOf('day');
                const nearDueBooks = response.data.data.filter((borrow) => {
                    const ngayHentra = moment(borrow.ngayhentra, 'YYYY-MM-DD');
                    const daysUntilDue = ngayHentra.diff(today, 'days');
                    return daysUntilDue >= 0 && daysUntilDue <= 3 && !borrow.ngaytra; // Chưa trả và sắp hết hạn
                });

                setBorrowList(nearDueBooks);
            } else {
                setError('Không tìm thấy phiếu mượn nào!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledDialog open={show} onClose={handleClose} aria-labelledby="modal-title">
            <DialogTitle id="modal-title">
                <Typography variant="h5" fontWeight="bold" color="primary">
                    Sách sắp hết hạn mượn
                </Typography>
            </DialogTitle>
            <DialogContent>
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <CircularProgress />
                    </div>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {!loading && !error && borrowList.length === 0 && (
                    <Typography variant="body1" color="textSecondary" align="center">
                        Không có sách nào sắp hết hạn!
                    </Typography>
                )}
                {!loading && !error && borrowList.length > 0 && (
                    <List>
                        {borrowList.map((borrow, index) => {
                            const ngayHentra = moment(borrow.ngayhentra, 'YYYY-MM-DD');
                            const daysUntilDue = ngayHentra.diff(moment().startOf('day'), 'days');
                            return (
                                <React.Fragment key={borrow.maphieumuon}>
                                    <StyledListItem>
                                        <ListItemText
                                            primary={
                                                <Typography variant="h6" fontWeight="medium">
                                                    {borrow.tensach}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Mã phiếu mượn: {borrow.maphieumuon}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Ngày mượn: {moment(borrow.ngaymuon).format('DD/MM/YYYY')}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Ngày hẹn trả: {ngayHentra.format('DD/MM/YYYY')}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color={daysUntilDue === 0 ? 'error.main' : 'warning.main'}
                                                        fontWeight="bold"
                                                    >
                                                        {daysUntilDue === 0
                                                            ? 'Hôm nay là ngày cuối cùng!'
                                                            : `Còn ${daysUntilDue} ngày`}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </StyledListItem>
                                    {index < borrowList.length - 1 && <Divider />}
                                </React.Fragment>
                            );
                        })}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default ModalSugestionBooks;