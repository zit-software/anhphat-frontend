import PropTypes from 'prop-types';

// material-ui
import { Avatar, Box, Grid, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import { IconPigMoney } from '@tabler/icons';
import formatter from 'views/utilities/formatter';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.success.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.success.main,
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140,
        },
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.success.main,
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70,
        },
    },
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const ThuCard = ({ isLoading, tongthu = 0 }) => {
    const theme = useTheme();

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25, zIndex: 10, position: 'relative' }}>
                        <Grid container>
                            <Grid item container flex={1}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography
                                            sx={{
                                                fontSize: '2.125rem',
                                                fontWeight: 500,
                                                mr: 1,
                                                mt: 1.75,
                                                mb: 0.75,
                                            }}
                                        >
                                            {formatter.format(tongthu)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item sx={{ mb: 1.25 }}>
                                    <Typography
                                        sx={{
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            color: '#fff',
                                        }}
                                    >
                                        Tổng thu
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: '#fff',
                                                mt: 1,
                                                color: theme.palette.success.dark,
                                            }}
                                        >
                                            <IconPigMoney />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

ThuCard.propTypes = {
    isLoading: PropTypes.bool,
};

export default ThuCard;
