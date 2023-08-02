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
}

export default new QuakhuyendungService();
