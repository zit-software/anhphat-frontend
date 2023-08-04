import { SearchOutlined } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Pagination,
    Popover,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import useDelay from 'hooks/useDelay';
import { useState } from 'react';
import { useQuery } from 'react-query';
import quakhuyendungService from 'services/quakhuyendung.service';
import InputNumber from 'ui-component/input-number';

const SelectGiftModal = ({ open = false, onClose = () => {}, onSelected = () => {} }) => {
    const [page, setPage] = useState(0);
    const [ten, setTen] = useState('');

    const [selectPayload, setSelectPayload] = useState(null);
    const [noAnchor, setNoAnchor] = useState(null);
    const [soluong, setSoluong] = useState(1);

    const delayedTen = useDelay(ten);

    const { data: listQua, isLoading: isLoadingListQua } = useQuery(
        [
            'qua',
            {
                page,
                ten: delayedTen,
            },
        ],
        () =>
            quakhuyendungService.getAll(
                {
                    ten: delayedTen,
                },
                page
            )
    );

    const handleSelected = () => {
        onSelected?.({
            ...selectPayload,
            soluong,
        });

        setNoAnchor(null);
        setSelectPayload(null);
        setSoluong(1);
        onClose?.();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Chọn quà</DialogTitle>

                <DialogContent>
                    <Stack spacing={2} py={2}>
                        <TextField
                            autoFocus
                            label="Tìm kiếm"
                            placeholder="Nhập tên quà tặng để tìm kiếm"
                            InputProps={{
                                endAdornment: <SearchOutlined />,
                            }}
                            value={ten}
                            onChange={({ target: { value } }) => setTen(value)}
                        />

                        {isLoadingListQua && <LinearProgress />}

                        {listQua && (
                            <>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Mã quà</TableCell>
                                            <TableCell>Tên quà</TableCell>
                                            <TableCell>Điểm</TableCell>
                                            <TableCell>Tồn kho</TableCell>
                                            <TableCell>Chọn</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {listQua.data.map((qua) => (
                                            <TableRow key={qua.ma}>
                                                <TableCell>{qua.ma}</TableCell>
                                                <TableCell>{qua.ten}</TableCell>
                                                <TableCell>{qua.diem}</TableCell>
                                                <TableCell>{qua.soluong}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={({ currentTarget }) => {
                                                            setSelectPayload(qua);
                                                            setNoAnchor(currentTarget);
                                                        }}
                                                    >
                                                        Chọn
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <Pagination
                                    variant="outlined"
                                    color="primary"
                                    page={page + 1}
                                    count={Math.floor(listQua.total / 10 + 0.9)}
                                    onChange={(_, page) => setPage(page - 1)}
                                />
                            </>
                        )}
                    </Stack>
                </DialogContent>
            </Dialog>

            <Popover anchorEl={noAnchor} open={!!noAnchor} onClose={() => setNoAnchor(null)}>
                <Stack width={400} spacing={2} p={4}>
                    <InputNumber
                        value={soluong}
                        autoFocus
                        label="Số lượng"
                        placeholder="Nhập số lượng"
                        onChange={({ target: { value } }) => setSoluong(value)}
                    />

                    <Button variant="contained" onClick={handleSelected}>
                        Thêm
                    </Button>
                </Stack>
            </Popover>
        </>
    );
};

export default SelectGiftModal;
