import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProductCategory from 'views/pages/storage/productCategory/ProductCategory';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const Accounts = Loadable(lazy(() => import('views/pages/manage/accounts/Accounts')));

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'quantri',
            children: [
                {
                    path: 'taikhoan',
                    element: <Accounts />
                }
            ]
        },
        {
            path: 'hanghoa',
            children: [
                {
                    path: 'loaihang',
                    element: <ProductCategory />
                }
            ]
        }
    ]
};

export default MainRoutes;
