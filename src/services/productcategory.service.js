import request from 'utils/request';

const productcategoryservice = {
    async getAllCategories() {
        const res = await request.get('/loaihang');
        return res.data;
    },
    async deleteCategory(ma) {
        await request.delete(`/loaihang/${ma}`);
    },
    async addCategory(newCategory) {
        await request.post('/loaihang', newCategory);
    },
    async updateCategory(newCategory, ma) {
        await request.put(`/loaihang/${ma}`, newCategory);
    }
};

export default productcategoryservice;
