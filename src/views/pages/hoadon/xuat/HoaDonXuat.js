import { AddCircleOutline } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { DataGrid, viVN } from '@mui/x-data-grid';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from 'react-query';
import NppService from 'services/npp.service';
import MainCard from 'ui-component/cards/MainCard';

const CreateModal = () => {
    const { data: npps, isLoading } = useQuery(['npp'], () =>
        NppService.layTatCa().then((res) => res.data)
    );

    const fixedNpps = npps?.data || [];

    return (
        <Dialog open>
            <Formik
                initialValues={{ manpp: '', ngayxuat: new Date() }}
                validationSchema={Yup.object().shape({
                    manpp: Yup.string().required('Vui lòng chọn nhà phân phối'),
                    ngayxuat: Yup.date('Ngày xuất không đúng định dạng').required(
                        'Vui lòng chọn ngày xuất'
                    ),
                })}
            >
                {({ values, errors, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit} style={{ width: 360 }}>
                        <DialogTitle>Tạo hóa đơn xuất</DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Nhà phân phối</InputLabel>
                                <Select
                                    value={values.manpp}
                                    fullWidth
                                    label="Nhà phân phối"
                                    placeholder="Nhà phân phối"
                                    name="manpp"
                                    onChange={handleChange}
                                >
                                    {fixedNpps.map((npp) => (
                                        <MenuItem key={npp.ma} value={npp.ma}>
                                            {npp.ten}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <DatePicker
                                value={values.ngayxuat}
                                inputFormat="DD/MM/YYYY"
                                label="Ngày xuất"
                                renderInput={(props) => (
                                    <TextField
                                        sx={{ mt: 2 }}
                                        placeholder="Ngày xuất"
                                        name="ngayxuat"
                                        {...props}
                                        fullWidth
                                    />
                                )}
                                onChange={(value) =>
                                    handleChange({
                                        target: {
                                            name: 'ngayxuat',
                                            value: value?.$d,
                                        },
                                    })
                                }
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button type="submit" variant="contained">
                                Tạo
                            </Button>
                            <Button type="submit">Hủy</Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

function HoaDonXuat() {
    return (
        <MainCard
            title="Quản lý hóa đơn xuất"
            secondary={
                <Button variant="outlined" startIcon={<AddCircleOutline />}>
                    Tạo
                </Button>
            }
        >
            <div style={{ height: '60vh' }}>
                <DataGrid
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    rows={[]}
                    columns={[]}
                />
            </div>

            <CreateModal />
        </MainCard>
    );
}

export default HoaDonXuat;
