import http from "../http-common";

const API_URL = '/auth/';

class AuthService {
  login(data) {
    return http
      .post(API_URL + 'signin', data)
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(data) {
    return http.post(API_URL + 'signup',data);
  }
}

export default new AuthService();
