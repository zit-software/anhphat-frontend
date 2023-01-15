import { Button } from '@mui/material';
import { IconCirclePlus } from '@tabler/icons';
import MainCard from 'ui-component/cards/MainCard';

function NhaPhanPhoi() {
    return (
        <MainCard
            title="Quản lý nhà phân phối"
            secondary={<Button startIcon={<IconCirclePlus />}>Thêm </Button>}
        ></MainCard>
    );
}

export default NhaPhanPhoi;
