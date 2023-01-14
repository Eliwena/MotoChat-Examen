import http from "../http-common";
import authHeader from './Auth-header';

const API_URL = 'moto/';

class UserService {
  getPublicContent() {
    return http.get(API_URL + 'all');
  }

  getUserBoard() {
    return http.get(API_URL + 'user', { headers: authHeader() });
  }

  getAdminBoard() {
    return http.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();
