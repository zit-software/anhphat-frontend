import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import {
    Breadcrumbs,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Typography,
    Link
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as LinkRouter, useLocation } from 'react-router-dom';

// constant
const headerSX = {
    '& .MuiCardHeader-action': { mr: 0 }
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

const breadcrumbNameMap = {
    '/loaihang': 'Loại hàng',
    '/hoadon': 'Hóa đơn',
    '/hoadon/nhap': 'Hóa đơn nhập',
    '/hoadon/xuat': 'Hóa đơn xuất',
    '/mathang': 'Mặt hàng',
    '/quantri': 'Quản trị',
    '/quantri/taikhoan': 'Quản trị tài khoản'
};

const MainCard = forwardRef(
    (
        {
            border = true,
            boxShadow,
            children,
            content = true,
            contentClass = '',
            contentSX = {},
            darkTitle,
            secondary,
            shadow,
            sx = {},
            title,
            showBreadcrumbs,
            ...others
        },
        ref
    ) => {
        const theme = useTheme();
        const location = useLocation();
        const pathnames = location.pathname.split('/').filter((x) => x);

        return (
            <Card
                ref={ref}
                {...others}
                sx={{
                    border: border ? '1px solid' : 'none',
                    borderColor: theme.palette.primary[200] + 75,
                    ':hover': {
                        boxShadow: boxShadow
                            ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)'
                            : 'inherit'
                    },
                    ...sx
                }}
            >
                {showBreadcrumbs && (
                    <Breadcrumbs sx={{ pl: 3, pr: 3, pt: 3 }}>
                        <Link to="/" color="inherit" component={LinkRouter}>
                            Home
                        </Link>
                        {pathnames.map((value, index) => {
                            const last = index === pathnames.length - 1;
                            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                            return last ? (
                                <Typography color="text.primary" key={to}>
                                    {breadcrumbNameMap[to]}
                                </Typography>
                            ) : (
                                <LinkRouter underline="hover" color="inherit" to={to} key={to}>
                                    {breadcrumbNameMap[to]}
                                </LinkRouter>
                            );
                        })}
                    </Breadcrumbs>
                )}
                {/* card header and action */}
                {!darkTitle && title && (
                    <CardHeader sx={headerSX} title={title} action={secondary} />
                )}
                {darkTitle && title && (
                    <CardHeader
                        sx={headerSX}
                        title={<Typography variant="h3">{title}</Typography>}
                        action={secondary}
                    />
                )}

                {/* content & header divider */}
                {title && <Divider />}

                {/* card content */}
                {content && (
                    <CardContent sx={contentSX} className={contentClass}>
                        {children}
                    </CardContent>
                )}
                {!content && children}
            </Card>
        );
    }
);

MainCard.propTypes = {
    border: PropTypes.bool,
    boxShadow: PropTypes.bool,
    children: PropTypes.node,
    content: PropTypes.bool,
    contentClass: PropTypes.string,
    contentSX: PropTypes.object,
    darkTitle: PropTypes.bool,
    secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    shadow: PropTypes.string,
    sx: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

export default MainCard;
