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
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import SaveIcon from '@mui/icons-material/Save';
import { IconPlus } from '@tabler/icons';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import ChiTietChinhSua from './ChiTietChinhSua';

const { default: MainCard } = require('ui-component/cards/MainCard');

const EditKhuyenMaiTang = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const ma = searchParams.get('ma');
    const type = searchParams.get('type');
    const { data, isLoading, refetch } = useQuery(['getOneKMT', ma, type], () => {
        if (type === 'view' || type === 'edit') {
            return khuyenmaitangService.getKMT(ma);
        }
    });

    const [currentEditing, setCurrentEditing] = useState(-1);
    const [kmt, setKMT] = useState({
        ten: data?.ten || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const [rows, setRows] = useState([]);
    useEffect(() => {
        refetch();
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
        };
        setRows((prev) => [...prev, row]);
    };

    const handleSave = async () => {
        setIsSaving(true);
        if (type === 'edit') {
            await khuyenmaitangService.chinhsuakmt(ma, kmt);
            await khuyenmaitangService.themchitiet(ma, {
                chitiet: rows.map((row) => ({
                    soluongmua: row.soluongmua,
                    soluongtang: row.soluongtang,
                    madvmua: row.madvmua,
                    madvtang: row.madvtang,
                    malh: row.malh,
                })),
            });
            for (let row of rows) {
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
                                                    handleChange(e, {
                                                        target: {
                                                            ten: e.target.value,
                                                        },
                                                    });
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
                        <Grid gap={[1, 1]} container justifyContent="flex-start">
                            <Grid item>
                                <Button
                                    disabled={currentEditing >= 0 || !kmt.ten}
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
                            <Grid item>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        navigate(-1);
                                    }}
                                >
                                    <KeyboardReturnIcon /> Quay Lại
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Grid>
        </MainCard>
    );
};

export default EditKhuyenMaiTang;
