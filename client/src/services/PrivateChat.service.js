import http from "../http-common";

class PrivateChatService {
  getAll() {
    return http.get("/privatechat");
  }

  get(id) {
    return http.get(`/privatechat/${id}`);
  }

  create(data) {
    return http.post("/privatechat", data);
  }

  update(id, data) {
    return http.put(`/privatechat/${id}`, data);
  }

  delete(id) {
    return http.delete(`/privatechat/${id}`);
  }

  findByName(name) {
    return http.get(`/privatechat?name=${name}`);
  }

  getAllActive() {
    return http.get(`/privatechat/active`);
  }
}

export default new PrivateChatService();
