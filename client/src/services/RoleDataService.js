import http from "../http-common";

class RoleDataService {
  getAll() {
    return http.get("/admin/roles");
  }

//   get(id) {
//     return http.get(`/admin/users/${id}`);
//   }

//   update(id, data) {
//     return http.put(`/admin/users/${id}`, data);
//   }

//   delete(id) {
//     return http.delete(`/admin/users/${id}`);
//   }

//   findByUsername(username) {
//     return http.get(`/admin/users?username=${username}`);
//   }
}

export default new RoleDataService();