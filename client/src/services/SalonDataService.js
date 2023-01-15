import http from "../http-common";

class SalonDataService {
  getAll() {
    return http.get("/salon");
  }

  get(id) {
    return http.get(`/salon/${id}`);
  }

  create(data) {
    return http.post("/salon", data);
  }

  update(id, data) {
    return http.put(`/salon/${id}`, data);
  }

  delete(id) {
    return http.delete(`/salon/${id}`);
  }

  findByName(name) {
    return http.get(`/salon?name=${name}`);
  }

  getAllActive() {
    return http.get(`/salon/active`);
  }
}

export default new SalonDataService();