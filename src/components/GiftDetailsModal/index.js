import {
    Dialog,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

/**
 * @type {import('react').FC<{
 *      open: boolean
 *      onClose: () => void
 *      payload: any
 * }>}
 */
const GiftDetailsModal = ({ open, payload, onClose }) => {
    payload = payload || {};

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography variant="h2">
                    {payload.ten} ({payload.ma})
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Điểm</TableCell>
                            <TableCell>Tồn kho</TableCell>
                            <TableCell>Tạo vào</TableCell>
                            <TableCell>Cập nhật vào</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow>
                            <TableCell>{payload.ma}</TableCell>
                            <TableCell>{payload.ten}</TableCell>
                            <TableCell>{payload.diem}</TableCell>
                            <TableCell>{payload.soluong}</TableCell>
                            <TableCell>
                                {dayjs(payload.createdAt).format('DD/MM/YYYY, HH:mm:ss')}
                            </TableCell>
                            <TableCell>
                                {dayjs(payload.updatedAt).format('DD/MM/YYYY, HH:mm:ss')}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
};

export default GiftDetailsModal;
