import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import EditKhuyenMaiTang from 'views/pages/khuyenmai/tang/ChinhSua';
import KhuyenMaiGiam from 'views/pages/khuyenmai/giam/KhuyenMaiGiam';

import KhuyenMaiTang from 'views/pages/khuyenmai/tang/KhuyenMaiTang';
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const Accounts = Loadable(lazy(() => import('views/pages/manage/accounts/Accounts')));
const ProductCategory = Loadable(
    lazy(() => import('views/pages/storage/productCategory/ProductCategory'))
);
const HoaDonNhap = Loadable(lazy(() => import('views/pages/hoadon/nhap/HoaDonNhap')));
const ChinhSuaHoaDonNhap = Loadable(
    lazy(() => import('views/pages/hoadon/nhap/chinhsua/ChinhSuaHoaDon'))
);
const HoaDonXuat = Loadable(lazy(() => import('views/pages/hoadon/xuat/HoaDonXuat')));
const Product = Loadable(lazy(() => import('views/pages/storage/product/Product')));
const NhaPhanPhoi = Loadable(lazy(() => import('views/pages/manage/npp/NhaPhanphoi')));
const ChinhSuaHoaDonXuat = Loadable(
    lazy(() => import('views/pages/hoadon/xuat/chinhsua/ChinhSuaHoaDon'))
);

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />,
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />,
                },
            ],
        },

        {
            path: 'hanghoa',
            children: [
                {
                    path: 'loaihang',
                    element: <ProductCategory />,
                },
                {
                    path: 'mathang',
                    element: <Product />,
                },
            ],
        },
        {
            path: 'hoadon',
            children: [
                {
                    path: 'nhap',
                    element: <HoaDonNhap />,
                },
            ],
        },
        {
            path: 'hoadon',
            children: [
                {
                    path: 'nhap',
                    children: [
                        {
                            path: ':ma',
                            element: <ChinhSuaHoaDonNhap />,
                        },
                    ],
                },
            ],
        },
        {
            path: 'hoadon',
            children: [
                {
                    path: 'nhap',
                    element: <HoaDonNhap />,
                },
                {
                    path: 'xuat',
                    element: <HoaDonXuat />,
                },
            ],
        },
        {
            path: 'hoadon',
            children: [
                {
                    path: 'nhap',
                    children: [
                        {
                            path: ':ma',
                            element: <ChinhSuaHoaDonNhap />,
                        },
                    ],
                },
            ],
        },
        {
            path: 'hoadon',
            children: [
                {
                    path: 'xuat',
                    children: [
                        {
                            path: ':ma',
                            element: <ChinhSuaHoaDonXuat />,
                        },
                    ],
                },
            ],
        },
        {
            path: 'quantri',
            children: [
                {
                    path: 'taikhoan',
                    element: <Accounts />,
                },
                {
                    path: 'npp',
                    element: <NhaPhanPhoi />,
                },
                {
                    path: 'khuyenmai',
                    children: [
                        {
                            path: 'tang',
                            element: <KhuyenMaiTang />,
                        },
                    ],
                },
                {
                    path: 'khuyenmai',
                    children: [
                        {
                            path: 'giam',
                            element: <KhuyenMaiGiam />,
                        },
                    ],
                },
                {
                    path: 'khuyenmai/tang/edit',
                    element: <EditKhuyenMaiTang />,
                },
            ],
        },
    ],
};

export default MainRoutes;
