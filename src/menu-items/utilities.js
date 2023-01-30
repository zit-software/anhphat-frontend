// assets
import {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconPackage,
    IconBox,
    IconFileInvoice,
    IconDiscount,
} from '@tabler/icons';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconPackage,
    IconBox,
    IconFileInvoice,
    IconDiscount,
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'hanghoa',
    title: 'Hàng hóa',
    type: 'group',
    children: [
        {
            id: 'hanghoa-loaihang',
            title: 'Loại hàng',
            type: 'item',
            url: 'hanghoa/loaihang',
            icon: icons.IconPackage,
            breadcrumbs: true,
        },
        {
            id: 'hanghoa-mathang',
            title: 'Mặt hàng',
            type: 'item',
            url: 'hanghoa/mathang',
            icon: icons.IconBox,
            breadcrumbs: true,
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
                    url: 'hoadon/nhap',
                    breadcrumbs: true,
                },
                {
                    id: 'hoadon-xuat',
                    title: 'Hóa đơn xuất',
                    type: 'item',
                    url: 'hoadon/xuat',
                    breadcrumbs: true,
                },
                {
                    id: 'hoadon-thuhang',
                    title: 'Hóa đơn thu hàng',
                    type: 'item',
                    url: 'hoadon/thuhang',
                    breadcrumbs: true,
                },
            ],
        },
    ],
};

export default utilities;
