import {
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
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
import { Box } from '@mui/system';
import { IconPencil } from '@tabler/icons';
import { memo, useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import { titleCase } from 'utils/commonutils';

// STYLING
const modalStyle = {
    position: 'absolute',
    top: '40%',
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
const RowSkeleton = () => (
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
    </TableRow>
);

// INPUT MODAL
const _InputModal = ({ open, onClose, onSubmit, refetch }) => {
    const [loading, setLoading] = useState(false);
    const [selectedloaihang, setselectedloaihang] = useState('');
    const [selecteddonvilon, setselecteddonvilon] = useState('');
    const [selecteddonvinho, setselecteddonvinho] = useState('');
    const [soluong, setsoluong] = useState(0);

    const { data: donvis } = useQuery(
        ['allDonVisAddQuyCach', selectedloaihang],
        productcategoryservice.getAllDonVisByLoaiHang,
        {
            initialData: [],
            enabled: !!selectedloaihang
        }
    );
    const { data: categories } = useQuery(
        'allProductsCategoryAddQuyCach',
        productcategoryservice.getAllCategories,
        {
            initialData: []
        }
    );
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h2" justifyContent="center" textAlign="center">
                    Thêm Quy Cách Loại Hàng
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
                            <div
                                style={{ display: 'flex', flexDirection: 'row', columnGap: '4px' }}
                            >
                                <FormControl fullWidth>
                                    <InputLabel id="all-categories-label">Loại Hàng</InputLabel>
                                    <Select
                                        value={selectedloaihang}
                                        onChange={(e) => {
                                            setselectedloaihang(e.target.value);
                                        }}
                                        labelId="allcategories-label"
                                        label="Loại Hàng"
                                    >
                                        {categories?.map((category) => (
                                            <MenuItem key={category.ma} value={category.ma}>
                                                {category.ten}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="donvilon-label">Đơn Vị Lớn</InputLabel>
                                    <Select
                                        disabled={!selectedloaihang}
                                        value={selecteddonvilon}
                                        onChange={(e) => {
                                            setselecteddonvilon(e.target.value);
                                        }}
                                        labelId="donvilon-label"
                                        label="Đơn Vị Lớn"
                                    >
                                        {donvis?.map((donvi) => (
                                            <MenuItem key={donvi.ma} value={donvi.ma}>
                                                {donvi.ten}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="donvinho-label">Đơn Vị Nhỏ</InputLabel>
                                    <Select
                                        value={selecteddonvinho}
                                        onChange={(e) => {
                                            setselecteddonvinho(e.target.value);
                                        }}
                                        disabled={!selectedloaihang || !selecteddonvilon}
                                        labelId="donvinho-label"
                                        label="Đơn Vị Nhỏ"
                                    >
                                        {donvis
                                            ?.filter((donvi) => donvi.ma !== selecteddonvilon)
                                            ?.map((donvi) => (
                                                <MenuItem key={donvi.ma} value={donvi.ma}>
                                                    {donvi.ten}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <TextField
                                onChange={(e) => {
                                    setsoluong(+e.target.value);
                                }}
                                sx={{ marginTop: '12px' }}
                                fullWidth
                                type="number"
                                placeholder="Số Lượng"
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                disabled={
                                    !selectedloaihang ||
                                    !selecteddonvilon ||
                                    !selecteddonvinho ||
                                    !soluong
                                }
                                onClick={async () => {
                                    setLoading(true);
                                    await onSubmit(selecteddonvilon, selecteddonvinho, soluong);
                                    setLoading(false);
                                    refetch();
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

const InputModal = memo(_InputModal);

const QuyCach = () => {
    // State là mã của quy cách đang chỉnh sửa, nếu đang không chỉnh sửa thì state là null
    const [editingMa, setEditingMa] = useState(null);
    const [editingOriginalData, setEditingOriginData] = useState({
        dv1: '',
        dv2: '',
        soluong: ''
    });
    const [editingData, setEditingData] = useState({ ...editingOriginalData });
    const {
        data: quycachs,
        isLoading,
        refetch: refetchAllQuyCachs
    } = useQuery('allQuyCachs', productcategoryservice.getAllQuyCachs, { initialData: [] });

    const handleStartEdit = (quycach) => {
        setEditingMa(quycach.ma);
        setEditingOriginData({
            dv1: quycach.dv1.ten,
            dv2: quycach.dv2.ten,
            soluong: quycach.soluong
        });
        setEditingData({
            dv1: quycach.dv1.ten,
            dv2: quycach.dv2.ten,
            soluong: quycach.soluong
        });
    };

    const handleSaveEdit = async (newQuyCach) => {
        if (newQuyCach.dv1 !== editingOriginalData.dv1)
            await productcategoryservice.updateDonVi(newQuyCach.madv1, { ten: newQuyCach.dv1 });
        if (newQuyCach.dv2 !== editingOriginalData.dv2)
            await productcategoryservice.updateDonVi(newQuyCach.madv2, { ten: newQuyCach.dv2 });
        if (newQuyCach.soluong !== editingOriginalData.soluong)
            await productcategoryservice.updateQuyCach(newQuyCach.ma, {
                soluong: newQuyCach.soluong
            });
        refetchAllQuyCachs();
        handleCancelEdit();
    };

    const handleCancelEdit = () => {
        setEditingMa(null);
        setEditingOriginData({
            dv1: '',
            dv2: '',
            soluong: ''
        });
        setEditingData({
            dv1: '',
            dv2: '',
            soluong: ''
        });
    };

    // THÊM QUY CÁCH
    const [openInputModal, setOpenInputModal] = useState(false);
    const handleOpenInputModal = () => {
        setOpenInputModal(true);
    };
    const handleCloseInputModal = () => {
        setOpenInputModal(false);
    };
    const handleSubmitInputModal = async (madv1, madv2, soluong) => {
        try {
            await productcategoryservice.addQuyCach({ madv1, madv2, soluong });
            handleCloseInputModal();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Typography variant="subtitle1">Quy cách</Typography>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Loại Hàng</TableCell>
                            <TableCell>Đơn Vị Lớn</TableCell>
                            <TableCell>Đơn Vị Nhỏ</TableCell>
                            <TableCell>Số Lượng</TableCell>
                            <TableCell>Diễn Giải</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <>
                                <RowSkeleton />
                                <RowSkeleton />
                                <RowSkeleton />
                            </>
                        ) : (
                            quycachs.map((quycach, index) => {
                                const currentMa = quycach.ma;
                                const isCurrentEdit = editingMa === currentMa;
                                return (
                                    <TableRow key={currentMa}>
                                        <TableCell>{quycach.lh.ten}</TableCell>
                                        <TableCell>
                                            {isCurrentEdit ? (
                                                <TextField
                                                    onChange={(e) => {
                                                        setEditingData({
                                                            ...editingData,
                                                            dv1: e.target.value
                                                        });
                                                    }}
                                                    defaultValue={editingOriginalData.dv1}
                                                />
                                            ) : (
                                                quycach.dv1.ten
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isCurrentEdit ? (
                                                <TextField
                                                    onChange={(e) => {
                                                        setEditingData({
                                                            ...editingData,
                                                            dv2: e.target.value
                                                        });
                                                    }}
                                                    defaultValue={editingOriginalData.dv2}
                                                />
                                            ) : (
                                                quycach.dv2.ten
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isCurrentEdit ? (
                                                <TextField
                                                    onChange={(e) => {
                                                        setEditingData({
                                                            ...editingData,
                                                            soluong: e.target.value
                                                        });
                                                    }}
                                                    defaultValue={editingOriginalData.soluong}
                                                    type="number"
                                                />
                                            ) : (
                                                quycach.soluong
                                            )}
                                        </TableCell>
                                        <TableCell>{`1 ${quycach.dv1.ten} ${titleCase(
                                            quycach.lh.ten
                                        )} có ${quycach.soluong} ${quycach.dv2.ten}`}</TableCell>
                                        <TableCell>
                                            {isCurrentEdit ? (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row'
                                                    }}
                                                >
                                                    <Button
                                                        onClick={() => {
                                                            handleSaveEdit({
                                                                ...editingData,
                                                                ma: quycach.ma,
                                                                madv1: quycach.dv1.ma,
                                                                madv2: quycach.dv2.ma
                                                            });
                                                        }}
                                                        variant="text"
                                                    >
                                                        Lưu
                                                    </Button>
                                                    <Button
                                                        onClick={handleCancelEdit}
                                                        variant="text"
                                                    >
                                                        Hủy
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Tooltip
                                                    onClick={() => {
                                                        handleStartEdit(quycach);
                                                    }}
                                                    title="Chỉnh sửa"
                                                >
                                                    <IconButton aria-label="edit">
                                                        <IconPencil color="blue" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                {openInputModal && (
                    <InputModal
                        open={openInputModal}
                        onClose={handleCloseInputModal}
                        onSubmit={handleSubmitInputModal}
                        refetch={refetchAllQuyCachs}
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
                    Thêm Quy Cách
                </Button>
            </div>
        </>
    );
};

export default QuyCach;
