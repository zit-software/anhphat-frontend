import { CreateNewFolderOutlined, RefreshOutlined } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import MainCard from 'ui-component/cards/MainCard';

const TangQua = () => {
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
        ></MainCard>
    );
};

export default TangQua;
