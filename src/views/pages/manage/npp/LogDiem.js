import { LinearProgress, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useQuery } from 'react-query';
import NppService from 'services/npp.service';

const LogDiem = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const { data: allLogs, isLoading } = useQuery(['logDiems', currentPage], () => {
        return NppService.getAllLogsDiem(currentPage);
    });
    const columns = [
        {
            field: 'npp',
            headerName: 'Nhà Phân Phối',
            flex: 1,
            renderCell: ({ value }) => value.ten,
        },
        {
            field: 'diem',
            headerName: 'Số Điểm Thay Đổi',
            flex: 0.8,
        },
        {
            field: 'ghichu',
            headerName: 'Ghi Chú',
            flex: 2,
        },
        {
            field: 'createdAt',
            headerName: 'Thời điểm thực hiện',
            flex: 1,
            renderCell: ({ value }) => dayjs(value).format('DD/MM/YYYY'),
        },
        {
            field: 'user',
            headerName: 'Người thực hiện',
            flex: 1,
            renderCell: ({ value }) => value.ten,
        },
    ];
    if (isLoading) return <LinearProgress />;

    const rows = allLogs.data.map((log) => {
        return {
            ...log,
            id: log.ma,
        };
    });
    return (
        <div style={{ height: '60vh' }}>
            <Typography variant="h3">Tích Lũy Điểm Nhà Phân Phối</Typography>
            <DataGrid
                components={{
                    Toolbar: GridToolbar,
                }}
                columns={columns}
                rows={rows}
                onPageChange={(page) => setCurrentPage(page)}
                rowCount={allLogs.total}
                pageSize={20}
                paginationMode="server"
                page={currentPage}
                initialState={{
                    pagination: {
                        page: currentPage,
                        pageSize: 20,
                    },
                }}
            ></DataGrid>
        </div>
    );
};

export default LogDiem;
