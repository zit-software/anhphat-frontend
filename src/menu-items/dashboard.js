// assets
import { IconDashboard, IconPackages, IconHome } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconPackages, IconHome };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Thống Kê',
    type: 'group',
    children: [
        {
            id: 'home',
            title: 'Trang chủ',
            type: 'item',
            url: '/',
            icon: icons.IconHome,
            breadcrumbs: true,
        },
        {
            id: 'statistic',
            title: 'Thống Kê',
            type: 'item',
            url: 'dashboard/statistic',
            icon: icons.IconDashboard,
            breadcrumbs: true,
            onlyAdmin: true,
        },
        {
            id: 'storage',
            title: 'Thống Kê Tồn Kho',
            type: 'item',
            url: 'dashboard/storage',
            icon: icons.IconPackages,
            breadcrumbs: true,
        },
    ],
};

export default dashboard;
