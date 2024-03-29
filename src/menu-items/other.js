// assets
import {
    IconBrandChrome,
    IconBuildingStore,
    IconHelp,
    IconUser,
    IconDiscount,
} from '@tabler/icons';

// constant

const icons = { IconBrandChrome, IconHelp, IconUser, IconBuildingStore, IconDiscount };

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
            onlyAdmin: true,
        },
        {
            id: 'quantri-npp',
            title: 'Nhà phân phối',
            type: 'item',
            url: 'quantri/npp',
            icon: icons.IconBuildingStore,
            breadcrumbs: true,
        },
        {
            id: 'quantri-khuyenmai',
            title: 'Khuyến Mãi',
            type: 'collapse',
            url: 'quantri/khuyenmai',
            icon: icons.IconDiscount,
            children: [
                {
                    id: 'khuyenmai-tang',
                    title: 'Khuyến mãi tặng',
                    type: 'item',
                    breadcrumbs: true,
                    url: 'quantri/khuyenmai/tang',
                },
                {
                    id: 'khuyenmai-giam',
                    title: 'Khuyến mãi giảm',
                    type: 'item',
                    breadcrumbs: true,
                    url: 'quantri/khuyenmai/giam',
                },
            ],
        },
    ],
};

export default other;
