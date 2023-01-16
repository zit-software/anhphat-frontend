import { IconButton } from '@mui/material';
import { DataGrid, GridToolbar, viVN } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import khuyenmaitangService from 'services/khuyenmaitang.service';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const { default: MainCard } = require('ui-component/cards/MainCard');

const KhuyenMaiTang = () => {
    const { data: allKMT, isLoading } = useQuery('getAllKMT', khuyenmaitangService.getAllKMT);

    const columns = [
        {
            field: 'ma',
            headerName: 'Mã',
            flex: 0.2,
        },
        {
            field: 'ten',
            headerName: 'Tên',
            flex: 1,
        },
        {
            field: 'updatedAt',
            headerName: 'Cập Nhật Lần Cuối',
            flex: 0.6,
            renderCell: (params) => dayjs(params.row.updatedAt).format('DD-MM-YYYY'),
        },
        {
            field: 'view',
            headerName: '',
            flex: 1,
            renderCell: () => {
                return (
                    <IconButton onClick={() => {}}>
                        <VisibilityIcon />
                    </IconButton>
                );
            },
        },
        {
            field: 'edit',
            headerName: '',
            flex: 1,
            renderCell: () => {
                return (
                    <IconButton onClick={() => {}}>
                        <EditIcon color="blue" />
                    </IconButton>
                );
            },
        },
        {
            field: 'delete',
            headerName: '',
            flex: 1,
            renderCell: () => {
                return (
                    <IconButton onClick={() => {}}>
                        <DeleteIcon color="red" />
                    </IconButton>
                );
            },
        },
    ];

    const arrs = allKMT || [];
    const rows = arrs.map((kmt) => ({ ...kmt, id: kmt.ma }));
    return (
        <MainCard title="Các Khuyến Mãi Tặng">
            <div style={{ height: '60vh' }}>
                <DataGrid
                    autoPageSize
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    columns={columns}
                    rows={rows}
                    density="compact"
                />
            </div>
        </MainCard>
    );
};

export default KhuyenMaiTang;
