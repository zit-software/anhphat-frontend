import { Grid } from '@mui/material';
import Category from './Category';
import QuyCach from './QuyCach';
const { default: MainCard } = require('ui-component/cards/MainCard');

const ProductCategory = () => {
    return (
        <MainCard title="Quản Lý Loại Hàng">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Category />
                </Grid>

                <Grid item xs={12}>
                    <QuyCach />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ProductCategory;
