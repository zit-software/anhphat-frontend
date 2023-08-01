import request from 'utils/request';

const productcategoryservice = {
    async getAllCategories() {
        const res = await request.get('/loaihang');
        return res.data;
    },
    async getAllCategoriesAndDonvi() {
        const res = await request.get('/loaihang');

        return res.data;
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
    async getAllDonVis({ madv1 }) {
        return await (
            await request.get(`/donvi`, {
                params: {
                    madv1,
                },
            })
        ).data;
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
    async xoaQuyCach(ma) {
        await request.delete(`/quycach/${ma}`);
    },
    async getAllMatHang({ queryKey: [, params] }) {
        try {
            const lh = params?.malh || '';
            const dv = params?.madv || '';
            const ngaynhap = params?.ngaynhap || '';
            const order = params?.order || '';
            const page = params?.page || '';
            const group = params?.group || '';
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
    async laymotquycach({ madv1, madv2 }) {
        if (!madv1 || !madv2) return;
        return await (
            await request.get(`quycach/laymot?madv1=${madv1}&madv2=${madv2}`)
        ).data;
    },
    async phanra({ ma, madvphanra }) {
        return await request.post(`mathang/phanra/${ma}`, {
            madvphanra,
        });
    },
    async xoamathang(ma) {
        return await (
            await request.delete(`mathang/${ma}`)
        ).data;
    },
};

export default productcategoryservice;
