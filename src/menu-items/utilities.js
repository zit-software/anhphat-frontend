// assets
import {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconPackage,
    IconBox,
    IconFileInvoice
} from '@tabler/icons';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconPackage,
    IconBox,
    IconFileInvoice
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
            icon: icons.IconBox,
            breadcrumbs: false
        },
        {
            id: 'hoadon',
            title: 'Hóa đơn',
            type: 'collapse',
            icon: icons.IconFileInvoice,
            children: [
                {
                    id: 'hoadon-nhap',
                    title: 'Hóa đơn nhập',
                    type: 'item',
                    url: '/hoadon/nhap',
                    breadcrumbs: false
                },
                {
                    id: 'hoadon-xuat',
                    title: 'Hóa đơn xuất',
                    type: 'item',
                    url: '/hoadon/xuat',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default utilities;
