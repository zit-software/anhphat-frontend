import provincesJson from 'assets/json/provinces.json';

class ProvinceService {
    static getAll() {
        return provincesJson;
    }
    static findByCode(code) {
        return provincesJson.find((e) => e.code === code);
    }
}

export default ProvinceService;
