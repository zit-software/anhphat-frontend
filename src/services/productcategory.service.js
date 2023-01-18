import request from 'utils/request';

const productcategoryservice = {
    async getAllCategories() {
        const res = await request.get('/loaihang');
        return res.data;
    },
    async getAllCategoriesAndDonvi() {
        const res = await request.get('/loaihang');
        // get DonVi
        const result = [];
        for (let loaihang of res.data) {
            const allDonViRes = await request.get(`/donvi?loaihang=${loaihang.ma}`);
            result.push({
                ...loaihang,
                donvi: allDonViRes.data,
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
    async updateDonVi(ma, newDonvi) {
        await request.put(`/donvi/${ma}`, newDonvi);
    },
    async getAllDonVis() {
        const res = await request.get(`/donvi`);
        return res.data;
    },
    async getAllDonVisByLoaiHang({ queryKey: [malh] }) {
        if (!malh) return;
        const res = await request.get(`/donvi?loaihang=${malh}`);
        return res.data;
    },
    async addDonvi(newDonvi) {
        await request.post('/donvi', newDonvi);
    },
    async getAllQuyCachs() {
        const res = await request.get('/quycach');
        return res.data;
    },
    async addQuyCach(newQuyCach) {
        await request.post('/quycach', newQuyCach);
    },
    async updateQuyCach(ma, newQuyCach) {
        await request.put(`/quycach/${ma}`, newQuyCach);
    },
    async getAllMatHang({ queryKey: [_, params] }) {
        try {
            const lh = params.malh || '';
            const dv = params.madv || '';
            const ngaynhap = params.ngaynhap || '';
            const order = params.order || '';
            const page = params.page || '';
            const group = params.group || '';
            const res = await request.get(
                `/mathang?loaihang=${lh}&donvi=${dv}&ngaynhap=${ngaynhap}&order=${order}&page=${page}&group=${group}`
            );
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },
    async getSoluongMathang(madv) {
        return await request.get(`mathang/soluong/${madv}`);
    },
    async getMatHang(ma) {
        return await request.get(`mathang/${ma}`);
    },
};

export default productcategoryservice;
