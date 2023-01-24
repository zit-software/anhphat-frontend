// assets
import { IconDashboard, IconPackages } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconPackages };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Thống Kê',
    type: 'group',
    children: [
        {
            id: 'statistic',
            title: 'Thống Kê',
            type: 'item',
            url: 'dashboard/statistic',
            icon: icons.IconDashboard,
            breadcrumbs: true,
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
