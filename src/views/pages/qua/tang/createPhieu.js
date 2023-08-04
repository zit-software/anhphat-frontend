import {
    Button,
    FormControlLabel,
    FormHelperText,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { Formik } from 'formik';
import { useState } from 'react';
import { useEffect } from 'react';
import AuthService from 'services/auth.service';
import * as Yup from 'yup';
import SelectNhaPhanPhoi from './selectNhaPhanPhoi';
import SelectGiftModal from '../nhap/new/SelectGiftModal';
import { IconFile, IconPencil, IconTrash, IconX } from '@tabler/icons';
import InputNumber from 'ui-component/input-number';
import { SaveRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import quakhuyendungService from 'services/quakhuyendung.service';
const currentDate = new Date();
const { default: MainCard } = require('ui-component/cards/MainCard');

const GiftRow = ({ gift, setSelectedGift }) => {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <Formik
            initialValues={{ ...gift }}
            validateOnChange
            validationSchema={Yup.object().shape({
                ma: Yup.number().required('Quà không được trống'),
                soluong: Yup.number().min(1, 'Quà tặng phải có ít nhất là 1'),
            })}
        >
            {({ values, handleChange, setFieldValue }) => (
                <TableRow>
                    <TableCell>{gift.ten}</TableCell>
                    <TableCell>
                        {isEditing ? (
                            <>
                                <InputNumber
                                    value={gift.soluong}
                                    onChange={({ target: { value } }) => {
                                        setFieldValue('soluong', value);
                                        setSelectedGift((prev) =>
                                            prev.map((ele) => {
                                                if (ele.ma === gift.ma) {
                                                    ele.soluong = value;
                                                }
                                                return ele;
                                            })
                                        );
                                    }}
                                />
                            </>
                        ) : (
                            gift.soluong
                        )}
                    </TableCell>
                    <TableCell>
                        {isEditing ? (
                            <Button
                                onClick={() => {
                                    setIsEditing(false);
                                    setSelectedGift((prev) =>
                                        prev.map((ele) => {
                                            if (ele.ma === gift.ma) {
                                                ele.soluong = values.soluong;
                                            }
                                            return ele;
                                        })
                                    );
                                }}
                            >
                                <SaveRounded />
                            </Button>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>
                                <IconPencil />
                            </Button>
                        )}
                        <Button
                            onClick={() => {
                                setSelectedGift((prev) => prev.filter((e) => e.ma !== gift.ma));
                            }}
                        >
                            <IconTrash />
                        </Button>
                    </TableCell>
                </TableRow>
            )}
        </Formik>
    );
};

const CreatePhieuXuatQuaKhuyenDung = () => {
    const handleSubmit = async (values) => {
        try {
            await quakhuyendungService.createPhieuXuatQuaKD({
                ngayxuat: values.ngayxuat,
                manpp: values.npp.ma,
                chitiets: selectedGift.map((selected) => ({
                    ma: selected.ma,
                    soluong: selected.soluong,
                })),
            });
            toast.success('Tạo Thành Công');
            navigate('/qua/tang');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        }
    };
    const [currentUser, setCurrentUser] = useState({ ma: '', ten: '' });
    const [selectingNpp, setSelectingNpp] = useState(false);
    const [selectingGift, setSelectingGift] = useState(false);

    const [selectedGift, setSelectedGift] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        const getCurrentUser = async () => {
            const currentUser = (await AuthService.auth()).data;
            setCurrentUser(currentUser);
        };
        getCurrentUser();
    }, []);

    const onSelectedGift = (selected) => {
        setSelectedGift((prev) => {
            let isExist = false;
            prev = [...prev].map((gift) => {
                if (gift.ma === selected.ma) {
                    isExist = true;
                    return { ...gift, soluong: gift.soluong + selected.soluong };
                }
                return gift;
            });
            if (!isExist) prev.push({ ...selected });
            return prev;
        });
    };
    return (
        <MainCard title="Lập Phiếu Xuất Quà Khuyến Dùng">
            <Stack spacing={2} direction="column" sx={{ ml: -2, p: 2 }}>
                <Formik
                    initialValues={{
                        ngayxuat: currentDate,
                        npp: {},
                        currentUser,
                    }}
                    onSubmit={handleSubmit}
                    validateOnMount
                    validationSchema={Yup.object().shape({
                        ngayxuat: Yup.date().required('Ngày Xuất Không Được Trống'),
                        npp: Yup.object().shape({
                            ma: Yup.number().required('Nhà Phân Phối Không Được Trống'),
                        }),
                    })}
                    enableReinitialize
                >
                    {({ values, errors, handleChange, handleSubmit, setFieldValue }) => {
                        return (
                            <>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell rowSpan={2}>Tên hóa đơn</TableCell>
                                            <TableCell rowSpan={2}>Ngày tạo</TableCell>
                                            <TableCell rowSpan={2}>Nhà Phân Phối</TableCell>
                                            <TableCell colSpan={2}>Người tạo</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Mã nhân viên</TableCell>
                                            <TableCell>Tên nhân viên</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell rowSpan={2}>
                                                Hóa Đơn Tặng Quà Khuyến Dùng
                                            </TableCell>
                                            <TableCell>
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
                                                <FormHelperText error>
                                                    {errors?.ngayxuat}
                                                </FormHelperText>
                                            </TableCell>
                                            <TableCell rowSpan={2}>
                                                <Stack direction="column">
                                                    <Typography sx={{ textAlign: 'center' }}>
                                                        {values.npp?.ten}
                                                    </Typography>
                                                    <Button
                                                        sx={{ marginLeft: '8px' }}
                                                        variant="contained"
                                                        onClick={() => setSelectingNpp(true)}
                                                    >
                                                        Chọn {values.npp?.ten && 'khác'}
                                                    </Button>
                                                </Stack>
                                                <FormHelperText error>
                                                    {errors?.npp?.ma}
                                                </FormHelperText>
                                            </TableCell>
                                            <TableCell>{values.currentUser.ma}</TableCell>
                                            <TableCell>{values.currentUser.ten}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Typography>Chi Tiết Xuất Quà</Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tên Quà</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                            <TableCell>Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(selectedGift || []).map((gift) => {
                                            return (
                                                <GiftRow
                                                    key={gift.ma}
                                                    gift={gift}
                                                    setSelectedGift={setSelectedGift}
                                                />
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                                <Button onClick={() => setSelectingGift(true)}>Thêm Quà</Button>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        startIcon={<IconFile />}
                                        disabled={Object.keys(errors).length > 0}
                                        onClick={handleSubmit}
                                    >
                                        Lưu
                                    </Button>
                                    <Button
                                        type="button"
                                        startIcon={<IconX />}
                                        onClick={() => navigate(-1)}
                                    >
                                        Đóng
                                    </Button>
                                </Stack>
                                <SelectNhaPhanPhoi
                                    open={!!selectingNpp}
                                    onClose={() => setSelectingNpp(false)}
                                    onSelect={(npp) => {
                                        setFieldValue('npp', npp);
                                        setSelectingNpp(false);
                                    }}
                                />
                                <SelectGiftModal
                                    open={!!selectingGift}
                                    onClose={() => setSelectingGift(false)}
                                    onSelected={onSelectedGift}
                                />
                            </>
                        );
                    }}
                </Formik>
            </Stack>
        </MainCard>
    );
};

export default CreatePhieuXuatQuaKhuyenDung;
