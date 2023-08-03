import request from 'utils/request';

class QuakhuyendungService {
    async getAll(filter, page = 0) {
        return (await request.get('/qua', { params: { page, ...filter } })).data;
    }

    async create(payload) {
        return (await request.post('/qua', payload)).data;
    }

    async update(ma, payload) {
        return await request.put(`/qua/${ma}`, payload);
    }

    async delete(ma) {
        return (await request.delete(`/qua/${ma}`)).data;
    }

    async getById(ma) {
        return (await request.get(`/qua/${ma}`)).data;
    }

    async getAllPhieuXuatQuaKD(page = 0) {
        return (await request.get('/qua/xuat', { params: { page } })).data;
    }

    async createPhieuNhap(payload) {
        return (await request.post('/qua/nhap', payload)).data;
    }

    async getAllPhieuNhap(page = 0) {
        return (await request.get('/qua/nhap', { params: { page } })).data;
    }

    async deletePhieuNhapById(ma) {
        return (await request.delete(`/qua/nhap/${ma}`)).data;
    }

    async getPhieuNhapById(ma) {
        return (await request.get(`/qua/nhap/${ma}`)).data;
    }
    async xoaPhieuXuatQuaKD(ma) {
        return (await request.delete(`/qua/xuat/${ma}`)).data;
    }
    async createPhieuXuatQuaKD(body) {
        return await request.post('/qua/xuat', body);
    }
    async getOnePhieuXuatQuaKD(ma) {
        return (await request.get(`/qua/xuat/${ma}`)).data;
    }
}

export default new QuakhuyendungService();
