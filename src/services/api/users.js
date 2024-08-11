import getApi from "./index";

export default {
  login(email, password) {
    return getApi().post("/auth", {
      email,
      password,
    });
  },
  register(user) {
    return getApi().post("/register", user);
  },
  types() {
    return getApi().get("/users/types");
  },
  user(userId) {
    return getApi().get(`/users/${userId}`);
  },
  usersList() {
    return getApi().get("/users");
  },
  update(user) {
    let objToSendToApi = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      occupation_role: user.occupation_role,
      type: user.type,
      avatar_url: user.avatar_url,
    };

    if (user.password != null) {
      objToSendToApi["password"] = user.password;
      objToSendToApi["confirmpassword"] = user.confirmpassword;
    }

    return getApi().patch("/users/" + user.id, objToSendToApi);
  },
  logout() {
    return getApi().post("/logout");
  },
};
