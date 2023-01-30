import {
    Badge,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { IconEqual, IconX } from '@tabler/icons';
import { Formik } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import * as Yup from 'yup';

function PhanRaForm({ value = {}, onClose, onSubmit }) {
    const loaihang = value.loaihang;
    const donvi = value.donvi;
    const [selectedDV2, setSelectedDV2] = useState(null);
    const { data: donvis, isLoading: loadingDonvi } = useQuery([donvi], () =>
        productcategoryservice.getAllDonVis({ madv1: donvi.ma })
    );
    const { data: quycach, isLoading: loadingQuyCach } = useQuery([donvi, selectedDV2], () =>
        productcategoryservice.laymotquycach({ madv1: donvi.ma, madv2: selectedDV2 })
    );

    const fixedDonvi = donvis || [];
    if (loadingQuyCach || loadingDonvi) return <LinearProgress />;
    return (
        <Formik
            initialValues={{
                malh: value.malh || '',
                madv1: donvi.ma || '',
                madv2: selectedDV2 || '',
                soluong: quycach?.soluong || 0,
            }}
            enableReinitialize
            validateOnMount
            validationSchema={Yup.object().shape({
                madv2: Yup.number()
                    .required('Vui lòng chọn đơn vị nhỏ')
                    .test(
                        'khac_donvi_hientai',
                        'Đơn vị phân rã phải khác đơn vị hiện tại',
                        (value) => value !== donvi.ma
                    ),
            })}
            onSubmit={(values) =>
                onSubmit({
                    ma: value.ma,
                    madvphanra: values.madv2,
                })
            }
        >
            {({ values, errors, handleChange, handleSubmit, setFieldValue }) => {
                return (
                    <form onSubmit={handleSubmit}>
                        {loadingDonvi && <LinearProgress />}
                        <DialogTitle>
                            <Badge>
                                <Typography variant="h2">
                                    Phân Rã Mặt Hàng{' '}
                                    <span
                                        style={{
                                            color: '#aaa',
                                        }}
                                    >
                                        #{value.ma}
                                    </span>
                                </Typography>
                            </Badge>
                        </DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth sx={{ mt: 1 }} error={!!errors.malh}>
                                <TextField value={loaihang.ten} label="Loại hàng" />
                            </FormControl>
                            <Grid container spacing={2} mt={1}>
                                <Grid item xs={3}>
                                    <FormControl fullWidth error={!!errors.madv1}>
                                        <TextField value={donvi.ten} label="Đơn vị hiện tại" />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={1}>
                                    <IconButton disabled>
                                        <IconEqual />
                                    </IconButton>
                                </Grid>

                                <Grid item xs={3}>
                                    <FormControl fullWidth error={!!errors.madv2}>
                                        <InputLabel>Đơn vị nhỏ</InputLabel>
                                        <Select
                                            name="madv2"
                                            value={values.madv2}
                                            label="Đơn vị nhỏ"
                                            placeholder="Đơn vị nhỏ"
                                            onChange={(e) => {
                                                handleChange(e);
                                                setSelectedDV2(e.target.value);
                                            }}
                                        >
                                            {fixedDonvi
                                                .filter((e) => e.ma !== values.madv1 && values.malh)
                                                .map((e) => (
                                                    <MenuItem key={e.ma} value={e.ma}>
                                                        {e.ten}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                        <FormHelperText error>{errors.madv2}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton disabled>
                                        <IconX />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth error={!!errors.madv2}>
                                        <TextField
                                            fullWidth
                                            label="Số lượng quy đổi"
                                            placeholder="12"
                                            name="soluong"
                                            value={values.soluong}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                disabled={Object.keys(errors).length !== 0}
                                type="submit"
                                variant="contained"
                            >
                                Phân Rã
                            </Button>
                            <Button type="button" onClick={onClose}>
                                Hủy
                            </Button>
                        </DialogActions>
                    </form>
                );
            }}
        </Formik>
    );
}

const PhanRaModal = ({ value = {}, open, onClose, onSubmit }) => {
    const [selected, setSelected] = useState(null);

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                {open && (
                    <PhanRaForm
                        value={value}
                        onClose={onClose}
                        onSubmit={(values) => {
                            setSelected(values);
                        }}
                    />
                )}
            </Dialog>
            <Dialog open={!!selected} onClose={() => setSelected(null)}>
                <Formik
                    initialValues={{ accept: false }}
                    validationSchema={Yup.object().shape({
                        accept: Yup.bool().equals([true], 'Vui lòng xác nhận để phân rã mặt hàng'),
                    })}
                    onSubmit={() => {
                        onSubmit(selected);
                        onClose();
                        setSelected(null);
                    }}
                >
                    {({ values, handleChange, errors, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogTitle>Phân rã mặt hàng</DialogTitle>
                            <DialogContent sx={{ maxWidth: 360 }}>
                                <DialogContentText>
                                    Bạn chắc chắn muốn phân rã mặt hàng này?
                                </DialogContentText>
                                <DialogContentText>
                                    Mặt hàng sau khi phân rã thành đơn vị nhỏ sẽ không thể phục hồi
                                    lại
                                </DialogContentText>

                                <FormControlLabel
                                    label="Xác nhận phân rã mặt hàng này"
                                    name="accept"
                                    value={values.accept}
                                    control={<Checkbox />}
                                    onChange={handleChange}
                                />

                                <FormHelperText error>{errors.accept}</FormHelperText>
                            </DialogContent>

                            <DialogActions>
                                <Button type="submit" variant="contained">
                                    Xác Nhận
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setSelected(null);
                                        onClose();
                                    }}
                                >
                                    Hủy
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default PhanRaModal;
