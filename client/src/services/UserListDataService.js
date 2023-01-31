import http from "../http-common";
import authHeader from "./Auth-header";

class UserListDataService {
  getAll() {
    return http.get("/users", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/users/${id}`);
  }

  findByUsername(username) {
    return http.get(`/users?username=${username}`);
  }
}

export default new UserListDataService();
