import {
    Badge,
    Button,
    CircularProgress,
    FormHelperText,
    Grid,
    IconButton,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import khuyenmaitangService from 'services/khuyenmaitang.service';

import SaveIcon from '@mui/icons-material/Save';
import { IconPlus } from '@tabler/icons';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import ChiTietChinhSua from './ChiTietChinhSua';

const { default: MainCard } = require('ui-component/cards/MainCard');

const EditKhuyenMaiTang = () => {
    const [searchParams] = useSearchParams();
    const [currentEditing, setCurrentEditing] = useState(-1);
    const [kmt, setKMT] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const ma = searchParams.get('ma');
    const type = searchParams.get('type');
    const { data, isLoading } = useQuery(['kmt', type], () => {
        if (type === 'view' || type === 'edit') {
            return khuyenmaitangService.getKMT(ma);
        }
    });

    const [rows, setRows] = useState([]);
    useEffect(() => {
        if (data) {
            const rows = data.chitiet.map((chitiet) => ({
                malh: chitiet.lh.ma,
                tenlh: chitiet.lh.ten,
                madvmua: chitiet.dvmua.ma,
                tendvmua: chitiet.dvmua.ten,
                madvtang: chitiet.dvtang.ma,
                tendvtang: chitiet.dvtang.ten,
                soluongmua: chitiet.soluongmua,
                soluongtang: chitiet.soluongtang,
                isNew: false,
            }));
            setRows(rows);
        }
    }, [data]);

    const handleAdd = () => {
        const row = {
            malh: '',
            tenlh: '',
            madvmua: '',
            tendvmua: '',
            madvtang: '',
            tendvtang: '',
            soluongmua: '',
            soluongtang: '',
            isNew: true,
        };
        setRows((prev) => [...prev, row]);
    };

    const handleSave = async () => {
        // Kiểm tra mã loại hàng có trùng trong rows không
        setIsSaving(true);
        console.log(type);
        console.log(kmt);
        console.log(rows);
        console.log(data);
        if (type === 'edit') {
            await khuyenmaitangService.chinhsuakmt(ma, kmt);
            await khuyenmaitangService.themchitiet(ma, {
                chitiet: rows
                    .filter((row) => row.isNew)
                    .map((row) => ({
                        soluongmua: row.soluongmua,
                        soluongtang: row.soluongtang,
                        madvmua: row.madvmua,
                        madvtang: row.madvtang,
                        malh: row.malh,
                    })),
            });
            for (let row of rows) {
                if (!row.isNew)
                    await khuyenmaitangService.chinhsuachitiet(ma, {
                        malh: row.malh,
                        chitiet: {
                            soluongmua: row.soluongmua,
                            soluongtang: row.soluongtang,
                            madvmua: row.madvmua,
                            madvtang: row.madvtang,
                        },
                    });
            }
        }
        if (type === 'add') {
            const newKMT = {
                kmt: {
                    ten: kmt.ten,
                    ngaybd: '2023-01-07T10:18:19.220Z',
                    ngaykt: '2023-01-16T10:18:19.220Z',
                },
                chitiet: rows.map((row) => ({
                    soluongmua: row.soluongmua,
                    soluongtang: row.soluongtang,
                    madvmua: row.madvmua,
                    madvtang: row.madvtang,
                    malh: row.malh,
                })),
            };
            await khuyenmaitangService.themkmt(newKMT);
        }
        setIsSaving(false);
    };

    if (isLoading) return <LinearProgress />;
    return (
        <MainCard
            title={
                <Badge>
                    <Typography variant="h2">
                        Khuyến Mãi Tặng{' '}
                        <span
                            style={{
                                color: '#aaa',
                            }}
                        >
                            #{data?.ma || ''}
                        </span>
                    </Typography>
                </Badge>
            }
        >
            <Grid justifyContent="flex-end" container>
                <Grid item xs={6}>
                    <Formik
                        validateOnChange
                        onSubmit={(values) => {
                            setKMT({
                                ten: values.ten,
                            });
                        }}
                        initialValues={{ ...data }}
                        validationSchema={Yup.object().shape({
                            ten: Yup.string().required('Vui lòng nhập tên cho khuyễn mãi '),
                        })}
                    >
                        {({ values, errors, handleChange, handleSubmit }) => {
                            return (
                                <form>
                                    {type === 'view' ? (
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Mã</TableCell>
                                                    <TableCell>Tên</TableCell>
                                                    <TableCell size="small">
                                                        Cập Nhật Lần Cuối
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>{values.ma}</TableCell>
                                                    <TableCell>{values.ten}</TableCell>
                                                    <TableCell size="small">
                                                        {values.updatedAt
                                                            ? dayjs(values.updatedAt).format(
                                                                  'DD-MM-YYYY'
                                                              )
                                                            : ''}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div>
                                            <TextField
                                                name="ten"
                                                label="Tên"
                                                placeholder="Nhập Tên Khuyến Mãi Tặng"
                                                error={!!errors.ten}
                                                value={values.ten}
                                                fullWidth
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setKMT({
                                                        ten: e.target.value,
                                                    });
                                                }}
                                            />
                                            <FormHelperText error>{errors.ten}</FormHelperText>
                                        </div>
                                    )}
                                </form>
                            );
                        }}
                    </Formik>
                </Grid>
            </Grid>
            <Grid container marginTop={4}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Loại Hàng</TableCell>
                                <TableCell>Đơn Vị Mua</TableCell>
                                <TableCell>Đơn Vị Tặng</TableCell>
                                <TableCell>Số Lượng Mua</TableCell>
                                <TableCell>Số Lượng Tặng</TableCell>
                                {type === 'view' && <TableCell>Diễn Giải</TableCell>}
                                {type !== 'view' && (
                                    <>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <ChiTietChinhSua
                                    setRows={setRows}
                                    setCurrentEditing={setCurrentEditing}
                                    editingIndex={currentEditing}
                                    key={index}
                                    index={index}
                                    row={row}
                                    type={type}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {type !== 'view' && (
                    <>
                        <Grid container justifyContent="center">
                            <IconButton
                                onClick={() => {
                                    handleAdd();
                                    setCurrentEditing(rows.length);
                                }}
                                sx={{ width: '100%', borderRadius: 'unset' }}
                            >
                                <IconPlus />
                            </IconButton>
                        </Grid>
                        <Grid container justifyContent="flex-start">
                            <Button
                                disabled={currentEditing >= 0}
                                onClick={() => {
                                    handleSave();
                                }}
                                variant="contained"
                            >
                                {isSaving ? (
                                    <CircularProgress
                                        size={30}
                                        sx={{ color: 'white', backGroundColor: 'white' }}
                                    />
                                ) : (
                                    <>
                                        <SaveIcon />
                                        Lưu
                                    </>
                                )}
                            </Button>
                        </Grid>
                    </>
                )}
            </Grid>
        </MainCard>
    );
};

export default EditKhuyenMaiTang;
