import { IconButton, Tooltip } from '@mui/material';
import { DataGrid, viVN } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import khuyenmaitangService from 'services/khuyenmaitang.service';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import { IconFilePlus } from '@tabler/icons';
const { default: MainCard } = require('ui-component/cards/MainCard');

const KhuyenMaiTang = () => {
    const { data: allKMT } = useQuery('getAllKMT', khuyenmaitangService.getAllKMT);
    const navigate = useNavigate();

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
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <IconButton
                        onClick={() => {
                            navigate({
                                pathname: '/quantri/khuyenmai/tang/edit',
                                search: createSearchParams({
                                    type: 'view',
                                    ma: params.row.ma,
                                }).toString(),
                            });
                        }}
                    >
                        <VisibilityIcon color="primary" />
                    </IconButton>
                );
            },
        },
        {
            field: 'edit',
            headerName: '',
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <IconButton
                        onClick={() => {
                            navigate({
                                pathname: '/quantri/khuyenmai/tang/edit',
                                search: createSearchParams({
                                    type: 'edit',
                                    ma: params.row.ma,
                                }).toString(),
                            });
                        }}
                    >
                        <EditIcon color="info" />
                    </IconButton>
                );
            },
        },
        {
            field: 'delete',
            headerName: '',
            flex: 0.2,
            renderCell: () => {
                return (
                    <IconButton onClick={() => {}}>
                        <DeleteIcon color="error" />
                    </IconButton>
                );
            },
        },
    ];

    const arrs = allKMT || [];
    const rows = arrs.map((kmt) => ({ ...kmt, id: kmt.ma }));
    return (
        <MainCard
            title="Các Khuyến Mãi Tặng"
            secondary={
                <Tooltip title="Tạo hóa đơn">
                    <IconButton
                        onClick={() => {
                            navigate({
                                pathname: '/quantri/khuyenmai/tang/edit',
                                search: createSearchParams({
                                    type: 'add',
                                }).toString(),
                            });
                        }}
                    >
                        <IconFilePlus />
                    </IconButton>
                </Tooltip>
            }
        >
            <div style={{ height: '60vh' }}>
                <DataGrid
                    autoPageSize
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
