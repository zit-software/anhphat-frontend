import { Grid } from '@mui/material';
import Category from './Category';
import QuyCach from './QuyCach';
const { default: MainCard } = require('ui-component/cards/MainCard');

const ProductCategory = () => {
    return (
        <MainCard title="Quản Lý Loại Hàng">
            <Grid container spacing={2}>
                <Grid item md={12} lg={6}>
                    <Category />
                </Grid>

                <Grid md={12} item lg={6}>
                    <QuyCach />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ProductCategory;
