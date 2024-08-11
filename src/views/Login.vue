<template>
  <div class="container h-100">
    <div class="row h-100 justify-content-center align-items-center">
      <div class="col-md-12">
        <div class="d-flex justify-content-center">
          <h1 class="text-primary logo logo-font">
            {{ applicationName }}
          </h1>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card text-white bg-primary w-100 my-3">
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="form-floating text-black mb-3">
                <input
                  type="email"
                  class="form-control"
                  id="emailField"
                  v-model="userCredentials.email"
                  :placeholder="this.$t('email')"
                  autofocus
                  autocomplete
                  required
                />
                <label for="emailField">{{ $t("email") }}</label>
              </div>
              <div class="form-floating text-black">
                <input
                  type="password"
                  class="form-control"
                  id="passwordField"
                  :placeholder="this.$t('password')"
                  autocomplete
                  required
                  v-model="userCredentials.password"
                />
                <label for="passwordField">{{ $t("password") }}</label>
              </div>
              <button
                v-if="!loading"
                type="submit"
                class="btn btn-seccundary w-100 mt-3 btn-lg btn-light"
              >
                {{ $t("login") }}
              </button>
              <button
                v-else
                type="submit"
                disabled
                class="btn btn-seccundary w-100 mt-3 btn-lg btn-light"
              >
                <div class="spinner-border" role="status">
                  <span class="sr-only d-none">{{ $t("loading") }}</span>
                </div>
              </button>
              <a hidden href="/lost-password" class="text-light">{{
                $t("lostPassword")
              }}</a>
              <div class="mt-3 d-flex">
                <p class="mx-auto lead text-center">
                  {{ $t("doesNotHaveAccount") }}<br />
                  <router-link
                    :to="{ name: 'signUp' }"
                    class="m-auto text-light"
                  >
                    {{ $t("signUp") }}
                  </router-link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="row justify-content-center px-md-4">
        <div class="col-md-6 bg-primary col-12 mt-3">
          <div class="text-white p-3 text-center">
            <a
              href="https://www.youtube.com/watch?v=EFtevXIowAE"
              target="_blank"
              rel="noopener noreferrer"
              class="text-light btn btn-seccundary btn-lg"
              >{{ $t("tutorialNav") }}</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiUser from "@/services/api/users.js";
import mixinForceLogout from "@/mixins/forceLogout.js";
export default {
  mixins: [mixinForceLogout],
  data() {
    return {
      userCredentials: {
        email: null,
        password: null,
      },
      loading: false,
      applicationName: process.env.VUE_APP_NAME,
    };
  },
  methods: {
    async login() {
      try {
        this.loading = true;

        const response = await apiUser.login(
          this.userCredentials.email,
          this.userCredentials.password
        );

        if (response.status === 401) {
          this.forceLogout(this.$t("login"));
        } else {
          if (response.data.success) {
            this.$store
              .dispatch("setUserAndToken", {
                user: response.data.data.user,
                token: response.data.data.token,
              })
              .then(() => {
                this.$router.push({ name: "home" });
              })
              .catch((err) => {
                if (err) {
                  throw err;
                }
              });
          } else {
            this.$swal.fire(
              this.$t("login"),
              this.$t("invalidCredentials"),
              "error"
            );
          }
        }
      } catch (e) {
        if (e) {
          this.$swal.fire(this.$t("login"), this.$t("loginFail"), "error");
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
