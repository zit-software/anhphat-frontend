import { IconButton } from '@mui/material';
import { DataGrid, viVN } from '@mui/x-data-grid';
import { IconPencil, IconX } from '@tabler/icons';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import khuyenmaigiamService from 'services/khuyenmaigiam.service';
import MainCard from 'ui-component/cards/MainCard';

const KhuyenMaiGiam = () => {
    let { data, isLoading, refetch } = useQuery('allKMG', () => khuyenmaigiamService.getAllKMG());
    data = data || [];
    console.log(data);
    const columns = [
        {
            field: 'ma',
            headerName: 'Mã Khuyến Mãi',
            flex: 0.2,
        },
        {
            field: 'ten',
            headerName: 'Tên Khuyến Mãi',
            flex: 1,
        },
        {
            field: 'tenlh',
            headerName: 'Tên Loại Hàng',
            flex: 1,
        },
        {
            field: 'tile',
            headerName: 'Tỉ Lệ Giảm (%)',
            flex: 1,
        },
        {
            field: 'updatedAt',
            headerName: 'Chỉnh sửa lần cuối',
            renderCell(params) {
                return dayjs(params.row.updatedAt).format('HH:MM, DD/MM/YYYY');
            },
            flex: 2,
        },
        {
            field: 'edit',
            headerName: '',
            renderCell(params) {
                return (
                    <IconButton size="small">
                        <IconPencil />
                    </IconButton>
                );
            },
        },
        {
            field: 'delete',
            headerName: '',
            renderCell(params) {
                return (
                    <IconButton onClick={() => {}} size="small">
                        <IconX />
                    </IconButton>
                );
            },
        },
    ];
    return (
        <MainCard title="Các Khuyến Mãi Giảm">
            <div style={{ height: '60vh' }}>
                <DataGrid
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    density="compact"
                    loading={isLoading}
                    columns={columns}
                    rows={data.map((kmg) => ({
                        id: kmg.ma,
                        tenlh: kmg.lh.ten,
                        ...kmg,
                    }))}
                />
            </div>
        </MainCard>
    );
};

export default KhuyenMaiGiam;
