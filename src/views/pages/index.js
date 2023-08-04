import { OpenInNew } from '@mui/icons-material';
import {
    Button,
    Card,
    CardActions,
    CardHeader,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import dashboard from 'menu-items/dashboard';
import other from 'menu-items/other';
import utilities from 'menu-items/utilities';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';

const renderItem = (item, laAdmin) => {
    if (item.onlyAdmin && !laAdmin) return null;

    const Icon = item.icon;

    return (
        <Card variant="outlined" key={item.id}>
            <CardHeader title={item.title} avatar={<Icon />} subheader={item.url} />

            {item.type === 'item' ? (
                <>
                    <Divider />

                    <CardActions>
                        <Link to={item.url || ''}>
                            <Button size="small">Mở</Button>
                        </Link>

                        <Link to={item.url || ''} target="_blank">
                            <Button size="small" variant="outlined" endIcon={<OpenInNew />}>
                                Mở trong tab mới
                            </Button>
                        </Link>
                    </CardActions>
                </>
            ) : (
                <List>
                    {item.children.map((child) => {
                        return (
                            <React.Fragment key={child.id}>
                                <ListItem key={child.id}>
                                    <Link to={child.url}>
                                        <ListItemText
                                            primaryTypographyProps={{
                                                sx: {
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                            primary={child.title}
                                            secondary={child.url}
                                        />
                                    </Link>

                                    <ListItemSecondaryAction>
                                        <Link to={child.url} target="_blank">
                                            <IconButton>
                                                <OpenInNew />
                                            </IconButton>
                                        </Link>
                                    </ListItemSecondaryAction>
                                </ListItem>

                                <Divider />
                            </React.Fragment>
                        );
                    })}
                </List>
            )}
        </Card>
    );
};

const IndexPage = () => {
    const user = useSelector((state) => state.auth.user);

    const { laAdmin } = user;

    return (
        <MainCard title="Trang chủ hệ thống">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Typography variant="h2" my={2}>
                        Thống kê
                    </Typography>
                    <Stack spacing={2}>
                        {dashboard.children.map((item) => renderItem(item, laAdmin))}
                    </Stack>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Typography variant="h2" my={2}>
                        Hàng hóa
                    </Typography>
                    <Stack spacing={2}>
                        {utilities.children.map((item) => renderItem(item, laAdmin))}
                    </Stack>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Typography variant="h2" my={2}>
                        Khác
                    </Typography>
                    <Stack spacing={2}>
                        {other.children.map((item) => renderItem(item, laAdmin))}
                    </Stack>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default IndexPage;
