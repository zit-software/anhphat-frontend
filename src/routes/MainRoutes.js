import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import KhoQua from 'views/pages/qua/qua';
import TangQua from 'views/pages/qua/tang';
import CreatePhieuXuatQuaKhuyenDung from 'views/pages/qua/tang/createPhieu';
import NhapQuaPage from 'views/pages/qua/nhap';
import NewNhapQua from 'views/pages/qua/nhap/new';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const DashboardStorage = Loadable(lazy(() => import('views/dashboard/Storage/DashboardStorage')));

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

const EditKhuyenMaiTang = Loadable(lazy(() => import('views/pages/khuyenmai/tang/ChinhSua')));
const KhuyenMaiTang = Loadable(lazy(() => import('views/pages/khuyenmai/tang/KhuyenMaiTang')));
const HoaDonThuHang = Loadable(lazy(() => import('views/pages/hoadon/thuhang/HoaDonThuHang')));
const KhuyenMaiGiam = Loadable(lazy(() => import('views/pages/khuyenmai/giam/KhuyenMaiGiam')));

const ChinhSuaHoaDonThuHang = Loadable(
    lazy(() => import('views/pages/hoadon/thuhang/chinhsua/ChinhSuaHoaDon'))
);
const HoaDonTra = Loadable(lazy(() => import('views/pages/hoadon/trahang/HoaDonTra')));
const ChinhSuaHoaDonTra = Loadable(
    lazy(() => import('views/pages/hoadon/trahang/chinhsua/ChinhSuaHoaDon'))
);

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: 'dashboard/default',
            element: <DashboardDefault />,
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'statistic',
                    element: <DashboardDefault />,
                },
                {
                    path: 'storage',
                    element: <DashboardStorage />,
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
                {
                    path: 'thuhang',
                    element: <HoaDonThuHang />,
                },
                {
                    path: 'trahang',
                    element: <HoaDonTra />,
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
                {
                    path: 'xuat',
                    children: [
                        {
                            path: ':ma',
                            element: <ChinhSuaHoaDonXuat />,
                        },
                    ],
                },
                {
                    path: 'thuhang',
                    children: [
                        {
                            path: ':ma',
                            element: <ChinhSuaHoaDonThuHang />,
                        },
                    ],
                },
                {
                    path: 'trahang',
                    children: [
                        {
                            path: ':ma',
                            element: <ChinhSuaHoaDonTra />,
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
                        {
                            path: 'giam',
                            element: <KhuyenMaiGiam />,
                        },
                    ],
                },
                {
                    path: 'khuyenmai',
                    children: [
                        {
                            path: 'tang',
                            children: [
                                {
                                    path: 'edit',
                                    element: <EditKhuyenMaiTang />,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            path: 'qua',
            children: [
                {
                    path: 'qua',
                    children: [
                        {
                            path: '',
                            element: <KhoQua />,
                        },
                    ],
                },
                {
                    path: 'nhap',
                    children: [
                        {
                            path: '',
                            element: <NhapQuaPage />,
                        },
                        {
                            path: 'new',
                            element: <NewNhapQua />,
                        },
                    ],
                },
                {
                    path: 'tang',
                    children: [
                        {
                            path: '',
                            element: <TangQua />,
                        },
                        {
                            path: 'create',
                            element: <CreatePhieuXuatQuaKhuyenDung />,
                        },
                    ],
                },
            ],
        },
    ],
};

export default MainRoutes;
