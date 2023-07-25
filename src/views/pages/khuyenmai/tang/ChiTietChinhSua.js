import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
    FormHelperText,
    IconButton,
    MenuItem,
    Select,
    TableCell,
    TableRow,
    TextField,
} from '@mui/material';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import * as Yup from 'yup';

const ChiTietChinhSua = ({ type, row, index, setCurrentEditing, editingIndex, setRows }) => {
    const isEditing = editingIndex === index;
    const { data: products, isLoading } = useQuery(
        ['products'],
        productcategoryservice.getAllCategoriesAndDonvi
    );
    const [selectedLH, setSelectedLH] = useState();
    useEffect(() => {
        if (isLoading) return;
        let selected = products.find((e) => e.ma === row.malh);
        if (!selected) selected = products[0];
        setSelectedLH(selected);
    }, [products, row, isLoading]);

    const handleSaveRow = (values) => {
        const newRow = { ...values };
        setRows((prev) => {
            const newRows = [...prev];
            newRows[index] = newRow;
            return newRows;
        });
        setCurrentEditing(-1);
    };
    const handleRemove = () => {
        setRows((prev) => prev.filter((ele, i) => i !== index));
        setCurrentEditing(-1);
    };
    if (isLoading || !selectedLH) return <></>;

    return (
        <>
            {type === 'view' ? (
                <TableRow>
                    <TableCell>{row.tenlh}</TableCell>
                    <TableCell>{row.tendvmua}</TableCell>
                    <TableCell>{row.tendvtang}</TableCell>
                    <TableCell>{row.soluongmua}</TableCell>
                    <TableCell>{row.soluongtang}</TableCell>
                    <TableCell>{`Mua ${row.soluongmua} ${row.tendvmua} tặng ${row.soluongtang} ${row.tendvtang}`}</TableCell>
                </TableRow>
            ) : !isEditing ? (
                <TableRow>
                    <TableCell>{row.tenlh}</TableCell>
                    <TableCell>{row.tendvmua}</TableCell>
                    <TableCell>{row.tendvtang}</TableCell>
                    <TableCell>{row.soluongmua}</TableCell>
                    <TableCell>{row.soluongtang}</TableCell>

                    <TableCell>
                        <IconButton
                            disabled={editingIndex !== -1 && editingIndex !== index}
                            onClick={() => {
                                setCurrentEditing(index);
                            }}
                        >
                            <EditIcon
                                color={
                                    editingIndex !== -1 && editingIndex !== index
                                        ? 'disabled'
                                        : 'info'
                                }
                            />
                        </IconButton>
                    </TableCell>
                    <TableCell>
                        <IconButton onClick={handleRemove}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ) : (
                <Formik
                    onSubmit={(values) => {
                        handleSaveRow(values);
                    }}
                    validate={(values) => {
                        setRows((prev) =>
                            prev.map((v, i) => {
                                if (index === i) v = values;
                                return v;
                            })
                        );
                    }}
                    validateOnChange
                    initialValues={{
                        malh: row.malh || selectedLH.ma,
                        tenlh: row.tenlh || selectedLH.ten,
                        madvmua: row.madvmua || selectedLH.donvi[0].ma,
                        tendvmua: row.tendvmua || selectedLH.donvi[0].ten,
                        madvtang: row.madvtang || selectedLH.donvi[0].ma,
                        tendvtang: row.tendvtang || selectedLH.donvi[0].ten,
                        soluongmua: row.soluongmua || 1,
                        soluongtang: row.soluongtang || 1,
                        isNew: row.isNew,
                    }}
                    validationSchema={Yup.object().shape({
                        malh: Yup.number().required('Vui lòng chọn sản phẩm'),
                        madvmua: Yup.number().required('Vui lòng chọn đơn vị'),
                        madvtang: Yup.number().required('Vui lòng chọn đơn vị'),
                        soluongmua: Yup.number().min(1),
                        soluongtang: Yup.number().min(1),
                    })}
                >
                    {({ values, handleSubmit, errors, handleChange, setFieldValue }) => {
                        return (
                            <TableRow>
                                <TableCell>
                                    <Select
                                        error={!!errors.malh}
                                        value={values.malh || ''}
                                        name="malh"
                                        fullWidth
                                        onChange={(e) => {
                                            const selected = products.find(
                                                (ele) => ele.ma === e.target.value
                                            );
                                            setFieldValue('tenlh', selected.ten);
                                            setFieldValue('madvmua', selected.donvi[0].ma);
                                            setFieldValue('madvtang', selected.donvi[0].ma);
                                            setFieldValue('tendvmua', selected.donvi[0].ten);
                                            setFieldValue('tendvtang', selected.donvi[0].ten);
                                            handleChange(e);

                                            setSelectedLH(selected);
                                        }}
                                    >
                                        {products.map((product) => (
                                            <MenuItem key={product.ma} value={product.ma}>
                                                {product.ten}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText error>{errors.malh}</FormHelperText>
                                </TableCell>
                                <TableCell>
                                    {selectedLH && (
                                        <Select
                                            disabled={!selectedLH}
                                            error={!!errors.madvmua}
                                            fullWidth
                                            value={values.madvmua || ''}
                                            name="madvmua"
                                            onChange={(e) => {
                                                setFieldValue(
                                                    'tendvmua',
                                                    selectedLH.donvi.find(
                                                        (ele) => ele.ma === e.target.value
                                                    ).ten
                                                );
                                                handleChange(e);
                                            }}
                                        >
                                            {selectedLH.donvi.map((donvi) => {
                                                return (
                                                    <MenuItem key={donvi.ma} value={donvi.ma}>
                                                        {donvi.ten}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    )}
                                    <FormHelperText error>{errors.madvmua}</FormHelperText>
                                </TableCell>
                                <TableCell>
                                    {selectedLH && (
                                        <Select
                                            disabled={!selectedLH}
                                            error={!!errors.madvtang}
                                            fullWidth
                                            value={values.madvtang || ''}
                                            name="madvtang"
                                            onChange={(e) => {
                                                setFieldValue(
                                                    'tendvtang',
                                                    selectedLH.donvi.find(
                                                        (ele) => ele.ma === e.target.value
                                                    ).ten
                                                );
                                                handleChange(e);
                                            }}
                                        >
                                            {selectedLH.donvi.map((donvi) => {
                                                return (
                                                    <MenuItem key={donvi.ma} value={donvi.ma}>
                                                        {donvi.ten}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    )}
                                    <FormHelperText error>{errors.madvtang}</FormHelperText>
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        name="soluongmua"
                                        onChange={handleChange}
                                        type="number"
                                        value={values.soluongmua}
                                    />
                                    <FormHelperText error>{errors.soluongmua}</FormHelperText>
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        name="soluongtang"
                                        onChange={handleChange}
                                        type="number"
                                        value={values.soluongtang}
                                    />
                                    <FormHelperText error>{errors.soluongtang}</FormHelperText>
                                </TableCell>

                                <TableCell>
                                    <IconButton
                                        disabled={editingIndex !== -1 && editingIndex !== index}
                                        onClick={handleSubmit}
                                    >
                                        <SaveIcon color="info" />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={handleRemove}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    }}
                </Formik>
            )}
        </>
    );
};
export default ChiTietChinhSua;
