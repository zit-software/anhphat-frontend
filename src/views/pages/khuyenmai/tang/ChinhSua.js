import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Badge,
    FormHelperText,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { IconPlus } from '@tabler/icons';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import khuyenmaitangService from 'services/khuyenmaitang.service';
import * as Yup from 'yup';

const { default: MainCard } = require('ui-component/cards/MainCard');

const EditKhuyenMaiTang = () => {
    const [searchParams] = useSearchParams();
    const ma = searchParams.get('ma');
    const type = searchParams.get('type');
    const { data, refetch: refetchKMT } = useQuery(
        'getKMT',
        () => {
            return khuyenmaitangService.getKMT(ma);
        },
        {
            initialData: {
                ma: '',
                ten: '',
                ngayBD: '',
                ngayKT: '',
                chitiet: [],
            },
            enabled: false,
        }
    );
    useEffect(() => {
        if (type === 'view' || type === 'edit') refetchKMT();
    }, []);

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
                            #{data.ma || ''}
                        </span>
                    </Typography>
                </Badge>
            }
        >
            <Grid justifyContent="flex-end" container>
                <Grid item xs={6}>
                    <Formik
                        initialValues={
                            data
                                ? { ma: data.ma, ten: data.ten, updatedAt: data.updatedAt }
                                : {
                                      ma: 0,
                                      ten: '',
                                      updatedAt: '',
                                  }
                        }
                        validationSchema={Yup.object().shape({
                            ten: Yup.string().required('Vui lòng nhập tên cho khuyễn mãi '),
                        })}
                    >
                        {({ values, errors, handleChange, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
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
                                                <TableCell>{data.ma}</TableCell>
                                                <TableCell>{values.ten}</TableCell>
                                                <TableCell size="small">
                                                    {data.updatedAt
                                                        ? dayjs(values.updatedAt).format(
                                                              'DD-MM-YYYY'
                                                          )
                                                        : ''}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <>
                                        <TextField
                                            name="ten"
                                            label="Tên"
                                            placeholder="Nhập Tên Khuyến Mãi Tặng"
                                            error={!!errors.ten}
                                            value={values.ten}
                                            fullWidth
                                            onChange={handleChange}
                                        />
                                        <FormHelperText error>{errors.ten}</FormHelperText>
                                    </>
                                )}
                            </form>
                        )}
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
                                <TableCell>Diễn Giải</TableCell>
                                {type !== 'view' && (
                                    <>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {type !== 'add' ? (
                                data.chitiet.map((chitiet) => (
                                    <TableRow key={parseInt(Math.random() * 1000)}>
                                        <TableCell>{chitiet.lh.ten}</TableCell>
                                        <TableCell>{chitiet.dvmua.ten}</TableCell>
                                        <TableCell>{chitiet.dvtang.ten}</TableCell>
                                        <TableCell>{chitiet.soluongmua}</TableCell>
                                        <TableCell>{chitiet.soluongtang}</TableCell>
                                        <TableCell>{`Mua ${chitiet.soluongmua} ${chitiet.dvmua.ten} tặng ${chitiet.soluongtang} ${chitiet.dvtang.ten}`}</TableCell>
                                        {type !== 'view' && (
                                            <>
                                                <TableCell>
                                                    <IconButton onClick={() => {}}>
                                                        <EditIcon color="info" />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => {}}>
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <div></div>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {type !== 'view' && (
                    <Grid container justifyContent="center">
                        <IconButton sx={{ width: '100%', borderRadius: 'unset' }}>
                            <IconPlus />
                        </IconButton>
                    </Grid>
                )}
            </Grid>
        </MainCard>
    );
};

export default EditKhuyenMaiTang;
