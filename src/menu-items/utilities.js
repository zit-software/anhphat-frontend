// assets
import {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconPackage
} from '@tabler/icons';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconPackage
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'hanghoa',
    title: 'Hàng hóa',
    type: 'group',
    children: [
        {
            id: 'hanghoa-loaihoang',
            title: 'Loại hàng',
            type: 'item',
            url: '/hanghoa/loaihang',
            icon: icons.IconPackage,
            breadcrumbs: false
        },
        {
            id: 'hanghoa-mathang',
            title: 'Mặt hàng',
            type: 'item',
            url: '/hanghoa/mathang',
            icon: icons.IconPalette,
            breadcrumbs: false
        },
        {
            id: 'util-shadow',
            title: 'Shadow',
            type: 'item',
            url: '/utils/util-shadow',
            icon: icons.IconShadow,
            breadcrumbs: false
        },
        {
            id: 'icons',
            title: 'Icons',
            type: 'collapse',
            icon: icons.IconWindmill,
            children: [
                {
                    id: 'tabler-icons',
                    title: 'Tabler Icons',
                    type: 'item',
                    url: '/icons/tabler-icons',
                    breadcrumbs: false
                },
                {
                    id: 'material-icons',
                    title: 'Material Icons',
                    type: 'item',
                    url: '/icons/material-icons',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default utilities;
