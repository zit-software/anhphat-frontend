import {
    CreateNewFolderOutlined,
    DeleteOutline,
    EditOutlined,
    RefreshOutlined,
    ViewDayOutlined,
    Visibility,
} from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
import { useState } from 'react';
import { useQuery } from 'react-query';
import quakhuyendungService from 'services/quakhuyendung.service';
import { IconEye } from '@tabler/icons';

const TangQua = () => {
    const [page, setPage] = useState(0);

    const {
        data: allPhieus,
        isLoading,
        refetch,
    } = useQuery(
        ['getAllPhieuXuatQuaKD', page],
        () => quakhuyendungService.getAllPhieuXuatQuaKD(page),
        { initialData: [] }
    );
    return (
        <MainCard
            title="Tặng quà"
            secondary={
                <Stack direction="row" spacing={1}>
                    <IconButton>
                        <RefreshOutlined />
                    </IconButton>

                    <Button startIcon={<CreateNewFolderOutlined />} variant="outlined">
                        Thêm
                    </Button>
                </Stack>
            }
        >
            <DataGrid
                getRowId={(e) => e.ma}
                page={page}
                onPageChange={setPage}
                paginationMode="server"
                loading={isLoading}
                components={{
                    Toolbar: GridToolbar,
                }}
                columns={[
                    {
                        field: 'ma',
                        headerName: 'Mã',
                        flex: 0.5,
                    },
                    {
                        field: 'nguoinhap',
                        headerName: 'Người tạo',
                        flex: 1,
                        renderCell: ({ value }) => value.ten,
                    },
                    {
                        field: 'npp',
                        headerName: 'Nhà Phân Phối',
                        flex: 1,
                        renderCell: ({ value }) => value.ten,
                    },
                    { field: 'tongsl', headerName: 'Tổng số lượng', flex: 0.8 },
                    { field: 'tongdiem', headerName: 'Tổng điểm', flex: 0.8 },
                    {
                        field: 'actions',
                        headerName: 'Hành động',
                        flex: 1,
                        type: 'actions',
                        getActions({ row }) {
                            return [
                                <GridActionsCellItem
                                    icon={<Visibility />}
                                    key="view"
                                    label="Xem"
                                />,
                                <GridActionsCellItem
                                    icon={<DeleteOutline />}
                                    key="delete"
                                    label="Xóa"
                                />,
                            ];
                        },
                    },
                ]}
                rows={allPhieus.data}
                rowCount={allPhieus.total || 0}
                rowsPerPageOptions={['10']}
                pageSize={10}
                autoHeight
                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            ></DataGrid>
        </MainCard>
    );
};

export default TangQua;
