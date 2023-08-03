// assets
import {
    IconBox,
    IconDiscount,
    IconFileInvoice,
    IconGift,
    IconPackage,
    IconPalette,
    IconShadow,
    IconTypography,
    IconWindmill,
    IconTicket,
    IconPackgeExport,
    IconPackages,
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
    IconGift,
    IconTicket,
    IconPackgeExport,
    IconPackages,
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
                {
                    id: 'hoadon-trahang',
                    title: 'Hóa đơn trả hàng',
                    type: 'item',
                    url: 'hoadon/trahang',
                    breadcrumbs: true,
                },
            ],
        },
        {
            id: 'qua',
            title: 'Quà khuyến dùng',
            type: 'collapse',
            icon: icons.IconGift,
            children: [
                {
                    id: 'qua',
                    title: 'Kho',
                    type: 'item',
                    url: 'qua/qua',
                    breadcrumbs: true,
                    icon: icons.IconPackage,
                },
                {
                    id: 'nhap',
                    title: 'Nhập',
                    type: 'item',
                    url: 'qua/nhap',
                    breadcrumbs: true,
                    icon: icons.IconPackages,
                },
                {
                    id: 'tang',
                    title: 'Tặng quà',
                    type: 'item',
                    url: 'qua/tang',
                    breadcrumbs: true,
                    icon: icons.IconPackgeExport,
                },
            ],
        },
    ],
};

export default utilities;
