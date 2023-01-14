import http from "../../http-common";

class SalonDataService {
  getAll() {
    return http.get("/admin/salon");
  }

  get(id) {
    return http.get(`/admin/salon/${id}`);
  }

  create(data) {
    return http.post("/admin/salon", data);
  }

  update(id, data) {
    return http.put(`/admin/salon/${id}`, data);
  }

  delete(id) {
    return http.delete(`/admin/salon/${id}`);
  }

  findByName(name) {
    return http.get(`/admin/salon?name=${name}`);
  }
}

export default new SalonDataService();