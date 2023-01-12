import { useQuery } from 'react-query';
import productcategoryservice from 'services/productcategory.service';
import Category from './Category';
import QuyCach from './QuyCach';
const { default: MainCard } = require('ui-component/cards/MainCard');

const ProductCategory = () => {
    return (
        <MainCard title="Quản Lý Loại Hàng">
            <Category />
            <QuyCach />
        </MainCard>
    );
};

export default ProductCategory;
