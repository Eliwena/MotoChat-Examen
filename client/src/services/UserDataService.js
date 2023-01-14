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

  updateRole(id, data) {
    return http.put(`/admin/users/${id}/role`, data);
  }

  delete(id) {
    return http.delete(`/admin/users/${id}`);
  }

  findByUsername(username) {
    return http.get(`/admin/users?username=${username}`);
  }
}

export default new UserDataService();
