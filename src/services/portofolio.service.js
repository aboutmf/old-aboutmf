import http from "../http-common";

class PortofolioDataService {
    index() {
        return http.get("/portofolios");
    }

    show(id) {
        return http.get(`/portofolios/${id}`);
    }

    create(data) {
        return http.post("/portofolios", data);
    }

    update(id, data) {
        return http.put(`/portofolios/${id}`, data);
    }

    delete(id) {
        return http.delete(`/portofolios/${id}`);
    }
}

export default new PortofolioDataService();