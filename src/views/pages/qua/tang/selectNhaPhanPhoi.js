const { SearchOutlined, PlusOneRounded } = require('@mui/icons-material');
const {
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    LinearProgress,
    IconButton,
    Button,
} = require('@mui/material');
const { Stack } = require('@mui/system');
const { default: useDelay } = require('hooks/useDelay');
const { useState } = require('react');
const { useQuery } = require('react-query');
const { default: NppService } = require('services/npp.service');

const SelectNhaPhanPhoi = ({ open, onClose, onSelect }) => {
    const [search, setSearch] = useState('');
    const delayedKeyword = useDelay(search, 500);

    const { data: npps, isLoading } = useQuery(['getAllNpp', delayedKeyword], () =>
        NppService.layTatCa().then((response) => response.data)
    );

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Chọn nhà phân phối</DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={2}>
                    <TextField
                        InputProps={{
                            endAdornment: <SearchOutlined />,
                        }}
                        placeholder="Nhập để tìm kiếm nhà phân phối theo tên"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã</TableCell>
                                <TableCell>Tên</TableCell>
                                <TableCell>SĐT</TableCell>
                                <TableCell>Điểm</TableCell>
                                <TableCell>Chọn</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <LinearProgress />
                            ) : (
                                (npps?.data || []).map((npp) => (
                                    <TableRow key={npp.ma}>
                                        <TableCell>{npp.ma}</TableCell>
                                        <TableCell>{npp.ten}</TableCell>
                                        <TableCell>{npp.sdt}</TableCell>
                                        <TableCell>{npp.diem}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => onSelect(npp)}>Chọn</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default SelectNhaPhanPhoi;
