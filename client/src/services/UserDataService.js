import http from "../http-common";

class UserDataService {
  getAll() {
    return http.get("/admin/users");
  }

  get(id) {
    return http.get(`/admin/users/${id}`);
  }


  update(id, data) {
    return http.put(`/admin/users/${id}`, data);
  }

  delete(id) {
    return http.delete(`/admin/users/${id}`);
  }

  findByName(name) {
    return http.get(`/admin/users?name=${name}`);
  }
}

export default new UserDataService();
