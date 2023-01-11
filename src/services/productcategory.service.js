import request from 'utils/request';

const productcategoryservice = {
    async getAllCategories() {
        const res = await request.get('/loaihang');
        // get DonVi
        const result = [];
        for (let loaihang of res.data) {
            const allDonViRes = await request.get(`/donvi?loaihang=${loaihang.ma}`);
            result.push({
                ...loaihang,
                donvi: allDonViRes.data
            });
        }
        return result;
    },
    async deleteCategory(ma) {
        await request.delete(`/loaihang/${ma}`);
    },
    async addCategory(newCategory) {
        const res = await request.post('/loaihang', newCategory);
        return res.data;
    },
    async updateCategory(newCategory, ma) {
        await request.put(`/loaihang/${ma}`, newCategory);
    },
    async addDonvi(newDonvi) {
        await request.post('/donvi', newDonvi);
    }
};

export default productcategoryservice;
