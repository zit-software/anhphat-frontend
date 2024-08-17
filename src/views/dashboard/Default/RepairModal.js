import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormHelperText,
    LinearProgress,
} from '@mui/material';
import { Formik } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ThongKeService from 'services/thongke.service';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    accept: Yup.bool().oneOf([true], 'Vui lòng xác nhận hành động'),
});

const RepairModal = ({ open, onClose }) => {
    const [isRepairing, setIsRepairing] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsRepairing(true);
            await ThongKeService.repair();

            toast.success('Sửa lỗi thành công');

            onClose();
        } catch (error) {
            toast.error(error.response?.data.message || 'Sửa lỗi thất bại');
        } finally {
            setIsRepairing(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <Formik
                initialValues={{
                    accept: false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogTitle>Sửa lỗi</DialogTitle>

                        <DialogContent>
                            {isRepairing && <LinearProgress />}

                            <DialogContentText>
                                Lưu ý: quá trình sửa lỗi có thể mất nhiều thời gian tùy thuộc vào
                                kích thước dữ liệu và mức độ lỗi. Vui lòng không tạo thêm các hóa
                                đơn cho đến khi quá trình này kết thúc.
                            </DialogContentText>

                            <FormControlLabel
                                checked={values.accept}
                                onChange={(_, checked) => setFieldValue('accept', checked)}
                                control={<Checkbox />}
                                label="Xác nhận"
                            />

                            <FormHelperText error>{errors.accept}</FormHelperText>
                        </DialogContent>

                        <DialogActions>
                            <Button type="submit" onClick={onClose}>
                                Hủy
                            </Button>
                            <Button type="submit" variant="contained">
                                Xác nhận
                            </Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

export default RepairModal;
