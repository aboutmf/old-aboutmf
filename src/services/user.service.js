import http from "../http-common";

class UserDataService {
    index() {
        return http.get("/portofolios");
    }

    login(data) {
        return http.post(`/login/`, data);
    }
}

export default new UserDataService();