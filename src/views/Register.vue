<template>
  <div class="container h-100">
    <div class="d-flex mt-0 mt-md-5">
      <h1 class="jumbotron-heading text-primary m-auto mb-0">
        {{ applicationName }}
      </h1>
    </div>
    <div class="d-flex my-2">
      <h4 class="jumbotron-heading text-primary m-auto mt-0 mb-3">
        {{ $t("createAccount") }}
      </h4>
    </div>
    <div class="card text-white bg-primary mb-3">
      <div class="card-header">{{ $t("signUp") }}</div>
      <div class="card-body">
        <form
          @submit.prevent="register"
          class="row h-100 justify-content-center align-items-center"
        >
          <user-form-fields
            :userObj="user"
            :isRegister="true"
            page="signUp"
          ></user-form-fields>
          <div class="col-md-6">
            <button
              v-if="!loading"
              type="submit"
              class="btn btn-success w-100 mt-4"
            >
              {{ $t("submit") }}
            </button>
            <button v-else disabled class="btn btn-light w-100 mt-5">
              <div class="spinner-border" role="status">
                <span class="sr-only d-none">{{ $t("loading") }}</span>
              </div>
            </button>
          </div>
          <div class="col-md-6">
            <button
              v-if="!loading"
              type="button"
              v-on:click="redirectLogin()"
              class="btn btn-light w-100 mt-4"
            >
              {{ $t("cancel") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import apiUser from "../services/api/users.js";
import mixinForceLogout from "../mixins/forceLogout.js";
import UserFormFieldsVue from "../components/layouts/UserFormFields.vue";
export default {
  components: {
    "user-form-fields": UserFormFieldsVue,
  },
  mixins: [mixinForceLogout],
  data() {
    return {
      userTypesLastUpdate: null,
      userTypes: [],
      user: {
        email: null,
        avatar_url: null,
        firstname: null,
        lastname: null,
        occupation_role: null,
        type: null,
        password: null,
        passwordconfirm: null,
      },
      loading: false,
      applicationName: process.env.VUE_APP_NAME,
    };
  },
  methods: {
    redirectLogin() {
      this.$router.push({ name: "login" });
    },
    async register() {
      try {
        if (this.user.password !== this.user.passwordconfirm) {
          this.$swal.fire(
            this.$t("signUp"),
            this.$t("passwordConfirmationFailed"),
            "error"
          );
        } else {
          this.loading = true;
          const response = await apiUser.register(this.user);

          if (response.status === 401) {
            this.forceLogout(this.$t("signUp"));
          } else {
            if (response.data.success) {
              this.$store
                .dispatch("setUserAndToken", {
                  user: response.data.data.user,
                  token: response.data.data.token,
                })
                .then(() => {
                  this.$router.push({ name: "login" });
                  this.$swal.fire(
                    this.$t("signUp"),
                    this.$t("welcome"),
                    "success"
                  );
                })
                .catch((err) => {
                  if (err) {
                    throw err;
                  }
                });
            } else {
              throw new Error(response.data.message);
            }
          }
        }
      } catch (e) {
        if (e) {
          this.$swal.fire(
            this.$t("signUp"),
            this.$t("invalidCredentials"),
            "error"
          );
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
