import request from 'utils/request';

const productcategoryservice = {
    async getAllCategories() {
        const res = await request.get('/loaihang');
        return res.data;
    },
    async deleteCategory(ma) {
        await request.delete(`/loaihang/${ma}`);
    }
};

export default productcategoryservice;
