import {
    Grid,
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
import { useQuery } from 'react-query';
import nppService from 'services/npp.service';

const { default: MainCard } = require('ui-component/cards/MainCard');

const RowSkeleton = () => {
    return (
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
            <TableCell>
                <Skeleton />
            </TableCell>
            <TableCell>
                <Skeleton />
            </TableCell>
        </TableRow>
    );
};

const NhaPhanPhoi = () => {
    const {
        data: allNPP,
        isLoading,
        refetch: refecthAllNPP
    } = useQuery(['getAllNPP'], nppService.getAllNPP, { initialData: { data: [], total: 0 } });
    return (
        <MainCard title="Nhà Phân Phối">
            <Grid container>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã</TableCell>
                                    <TableCell>Tên</TableCell>
                                    <TableCell>Tỉnh</TableCell>
                                    <TableCell>SĐT</TableCell>
                                    <TableCell>Chiết Khấu {'(%)'}</TableCell>
                                    <TableCell>Điểm</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <>
                                        <RowSkeleton />
                                        <RowSkeleton />
                                        <RowSkeleton />
                                        <RowSkeleton />
                                        <RowSkeleton />
                                    </>
                                ) : (
                                    allNPP.data.map((npp) => (
                                        <TableRow key={npp.ma}>
                                            <TableCell size="small">{npp.ma}</TableCell>
                                            <TableCell size="medium">{npp.ten}</TableCell>
                                            <TableCell>{npp.tinh}</TableCell>
                                            <TableCell>{npp.sdt}</TableCell>
                                            <TableCell>{npp.chietkhau}</TableCell>
                                            <TableCell>{npp.diem}</TableCell>
                                            <TableCell size="small">
                                                <Tooltip onClick={() => {}} title="Chỉnh sửa">
                                                    <IconButton aria-label="edit">
                                                        <IconPencil color="blue" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell size="small">
                                                <Tooltip onClick={() => {}} title="Xóa">
                                                    <IconButton aria-label="delete">
                                                        <IconTrash color="red" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </MainCard>
    );
};
export default NhaPhanPhoi;
