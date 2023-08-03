import { AddOutlined, RefreshRounded } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import { Link } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';

const NhapQuaPage = () => {
    return (
        <MainCard
            title="Nhập quà"
            secondary={
                <Stack direction="row">
                    <IconButton>
                        <RefreshRounded />
                    </IconButton>

                    <Link to="/qua/nhap/new">
                        <Button variant="outlined" startIcon={<AddOutlined />}>
                            Nhập
                        </Button>
                    </Link>
                </Stack>
            }
        ></MainCard>
    );
};

export default NhapQuaPage;
