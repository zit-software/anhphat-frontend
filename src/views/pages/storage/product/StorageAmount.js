import { Box } from '@mui/system';
import { DataGrid, GridToolbar, viVN } from '@mui/x-data-grid';
import { useState } from 'react';
import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import MainCard from 'ui-component/cards/MainCard';

const StorageAmount = () => {
    const columns = [
        {
            field: 'loaihang',
            headerName: 'Loại hàng',
            flex: 3,
            renderCell: ({ value }) => value.ten,
        },
        {
            field: 'donvi',
            headerName: 'Đơn Vị',
            flex: 2,
            renderCell: ({ value }) => value.ten,
        },
        {
            field: 'soluong',
            headerName: 'Số lượng',
            flex: 1,
        },
    ];
    const { data, isLoading } = useQuery(
        ['productStorageCount'],
        productcategoryservice.countProductStorage,
        {
            initialData: [],
        }
    );
    return (
        <MainCard title="Số Lượng Tồn Kho">
            <Box sx={{ height: '60vh', width: '100%' }}>
                <DataGrid
                    loading={isLoading}
                    columns={columns}
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    density="compact"
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    rows={data.map((count) => ({ ...count, id: count.donvi.ma }))}
                ></DataGrid>
            </Box>
        </MainCard>
    );
};

export default StorageAmount;
