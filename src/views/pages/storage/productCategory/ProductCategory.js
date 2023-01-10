import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Input,
    Modal,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { Box, height, style } from '@mui/system';
import { IconPencil, IconTrash } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import time from 'utils/time';

const { default: MainCard } = require('ui-component/cards/MainCard');

// Styling
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90%',
    width: 600,
    height: 'fit-content',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    borderRadius: '12px',
    padding: '16px'
};
const inputContainerStyle = {
    padding: '16px',
    borderRadius: '10px',
    marginTop: '8px'
};

const RowSkeletion = () => (
    <TableRow>
        <TableCell>
            <Skeleton />
        </TableCell>
        <TableCell>
            <Skeleton />
        </TableCell>
        <TableCell>
            <Skeleton />
        </TableCell>
        <TableCell>
            <Skeleton />
        </TableCell>
        <TableCell>
            <Skeleton />
        </TableCell>
    </TableRow>
);

const DeleteModal = ({ open, onClose, categoryName, onSubmit }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Xóa Loại Hàng</DialogTitle>
        <DialogContent>
            <p>
                Bạn có chắc chắc muốn xóa loại hàng <strong>{categoryName}</strong>?
            </p>
            <DialogContentText>
                Điều này có thể <strong>làm ảnh hướng</strong> đến các mặt hàng thuộc loại hàng này
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button color="error" onClick={onSubmit}>
                Xóa
            </Button>
        </DialogActions>
    </Dialog>
);

const InputLoaiHangModal = ({ index, categories, onClose, onSubmit, refetch }) => {
    const isUpdating = index !== -1;
    const [loaiHang, setLoaiHang] = useState({
        ten: isUpdating ? categories[index].ten : '',
        gianhap: isUpdating && categories[index].gianhap,
        giaban: isUpdating && categories[index].giaban
    });
    const [loading, setLoading] = useState(false);
    const isValid = loaiHang.ten && loaiHang.giaban > 0 && loaiHang.gianhap > 0;
    return (
        <Modal open={Number.isInteger(index)} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h2" justifyContent="center" textAlign="center">
                    {isUpdating ? 'Cập Nhật Loại Hàng' : 'Thêm Loại Hàng Mới'}
                </Typography>
                {loading ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '10px 0'
                        }}
                    >
                        <CircularProgress />
                    </div>
                ) : (
                    <div>
                        <div style={inputContainerStyle}>
                            <TextField
                                sx={{ marginTop: '12px' }}
                                fullWidth
                                placeholder="Nhập tên loại hàng"
                                defaultValue={loaiHang.ten}
                                label="Tên Loại Hàng"
                                onChange={(e) => {
                                    setLoaiHang({
                                        ...loaiHang,
                                        ten: e.target.value
                                    });
                                }}
                            />
                            <TextField
                                sx={{ marginTop: '12px' }}
                                fullWidth
                                type="number"
                                placeholder="Giá Nhập"
                                defaultValue={loaiHang.gianhap}
                                label="Giá Nhập"
                                onChange={(e) => {
                                    setLoaiHang({
                                        ...loaiHang,
                                        gianhap: +e.target.value
                                    });
                                }}
                            />
                            <TextField
                                sx={{ marginTop: '12px' }}
                                fullWidth
                                type="number"
                                placeholder="Giá Bán"
                                defaultValue={loaiHang.giaban}
                                label="Giá Bán"
                                onChange={(e) => {
                                    setLoaiHang({
                                        ...loaiHang,
                                        giaban: +e.target.value
                                    });
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                disabled={!isValid}
                                onClick={async () => {
                                    if (isValid) {
                                        setLoading(true);
                                        await onSubmit(isUpdating, loaiHang, categories[index]?.ma);
                                        setLoading(false);
                                        refetch();
                                    }
                                }}
                                variant="contained"
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                )}
            </Box>
        </Modal>
    );
};

const ProductCategory = () => {
    const {
        data: categories,
        isLoading,
        refetch: refetchAllCategories
    } = useQuery('allProductsCategory', productcategoryservice.getAllCategories, {
        initialData: []
    });

    // DELTE MODAL
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleCategoryIndex, setDeleteCategoryIndex] = useState(-1);
    const handleOpenDeleteModal = (index) => {
        setOpenDeleteModal(true);
        setDeleteCategoryIndex(index);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setDeleteCategoryIndex(-1);
    };

    const handleSubmitDelete = async () => {
        try {
            await productcategoryservice.deleteCategory(categories[deleCategoryIndex].ma);
            refetchAllCategories();
            handleCloseDeleteModal();
        } catch (error) {
            console.log(error);
        }
    };

    // INPUT MODAL
    const [openInputModal, setOpenInputModal] = useState(null);
    const handleOpenInputModal = (index) => {
        if (index >= 0) setOpenInputModal(index);
        else setOpenInputModal(-1);
    };
    const handleCloseInputModal = () => {
        setOpenInputModal(null);
    };
    const handleSubmitInputModal = async (isUpdating, value, ma) => {
        try {
            if (isUpdating) {
                await productcategoryservice.updateCategory(value, ma);
            } else {
                await productcategoryservice.addCategory(value);
            }
            handleCloseInputModal();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <MainCard title="Loại Hàng">
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Giá Nhập</TableCell>
                            <TableCell>Giá Bán</TableCell>
                            <TableCell>Sửa Lần Cuối</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <RowSkeletion />
                        ) : (
                            categories.map((category, index) => (
                                <TableRow key={category.ma}>
                                    <TableCell>{category.ma}</TableCell>
                                    <TableCell>{category.ten}</TableCell>
                                    <TableCell>{category.gianhap}</TableCell>
                                    <TableCell>{category.giaban}</TableCell>
                                    <TableCell>{time.toDateandTime(category.updatedAt)}</TableCell>
                                    <TableCell>
                                        <Tooltip
                                            onClick={() => {
                                                handleOpenInputModal(index);
                                            }}
                                            title="Chỉnh sửa"
                                        >
                                            <IconButton aria-label="edit">
                                                <IconPencil color="blue" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Xóa">
                                            <IconButton
                                                onClick={() => {
                                                    handleOpenDeleteModal(index);
                                                }}
                                                aria-label="del"
                                            >
                                                <IconTrash color="red" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {Number.isInteger(openDeleteModal) && (
                    <DeleteModal
                        open={openDeleteModal}
                        onClose={handleCloseDeleteModal}
                        onSubmit={handleSubmitDelete}
                        categoryName={categories[deleCategoryIndex].ten}
                    />
                )}
                {Number.isInteger(openInputModal) && (
                    <InputLoaiHangModal
                        index={openInputModal}
                        onClose={handleCloseInputModal}
                        onSubmit={handleSubmitInputModal}
                        categories={categories}
                        refetch={refetchAllCategories}
                    />
                )}
            </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button
                    variant="contained"
                    onClick={() => {
                        handleOpenInputModal();
                    }}
                >
                    Thêm Loại Hàng
                </Button>
            </div>
        </MainCard>
    );
};

export default ProductCategory;
