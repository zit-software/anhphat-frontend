// assets
import { IconBrandChrome, IconBuildingStore, IconHelp, IconUser } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp, IconUser, IconBuildingStore };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'quantri',
    title: 'Quản trị',
    type: 'group',
    children: [
        {
            id: 'quantri-taikhoan',
            title: 'Tài khoản',
            type: 'item',
            url: 'quantri/taikhoan',
            icon: icons.IconUser,
            breadcrumbs: true,
        },
        {
            id: 'quantri-npp',
            title: 'Nhà phân phối',
            type: 'item',
            url: 'quantri/npp',
            icon: icons.IconBuildingStore,
            breadcrumbs: true,
        },
    ],
};

export default other;
