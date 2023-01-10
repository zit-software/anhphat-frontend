// assets
import { IconBrandChrome, IconHelp, IconUser } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp, IconUser };

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
            url: '/quantri/taikhoan',
            icon: icons.IconUser,
            breadcrumbs: true
        }
    ]
};

export default other;
