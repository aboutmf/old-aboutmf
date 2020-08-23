import http from "../http-common";

class BlogDataService {
    index() {
        return http.get("/blogs");
    }

    show(id) {
        return http.get(`/blogs/${id}`);
    }

    detail(slug) {
        return http.get(`/blogs/show/${slug}`);
    }

    create(data) {
        return http.post("/blogs", data);
    }

    update(id, data) {
        return http.put(`/blogs/${id}`, data);
    }

    delete(id) {
        return http.delete(`/blogs/${id}`);
    }
}

export default new BlogDataService();