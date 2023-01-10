import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from '@mui/material';
import { IconPencil, IconTrash } from '@tabler/icons';
import { useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import time from 'utils/time';

const { default: MainCard } = require('ui-component/cards/MainCard');

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

const ProductCategory = () => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleCategoryIndex, setDeleteCategoryIndex] = useState(-1);
    const {
        data: categories,
        isLoading,
        refetch: refetchAllCategories
    } = useQuery('allProductsCategory', productcategoryservice.getAllCategories, {
        initialData: []
    });

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
                                        <Tooltip title="Chỉnh sửa">
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
                {openDeleteModal && (
                    <DeleteModal
                        open={openDeleteModal}
                        onClose={handleCloseDeleteModal}
                        onSubmit={handleSubmitDelete}
                        categoryName={categories[deleCategoryIndex].ten}
                    />
                )}
            </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button>Thêm Loại Hàng</Button>
            </div>
        </MainCard>
    );
};

export default ProductCategory;
