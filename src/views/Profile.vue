<template>
  <div class="container h-100">
    <div class="card text-white bg-primary mb-3">
      <div class="card-header">{{ $t("profile") }}</div>
      <div class="card-body">
        <form
          @submit.prevent="update"
          class="row h-100 justify-content-center align-items-center"
        >
          <user-form-fields
            :userObj="user"
            :isRegister="false"
            :userTypes="userTypes"
            page="profile"
          ></user-form-fields>
          <div class="col-12">
            <button
              v-if="!loading"
              type="submit"
              class="btn btn-light w-100 mt-4"
            >
              {{ $t("update") }}
            </button>
            <button v-else disabled class="btn btn-light w-100 mt-5">
              <div class="spinner-border" role="status">
                <span class="sr-only d-none">{{ $t("loading") }}</span>
              </div>
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
  mounted: function () {
    this.getUserData();
  },
  data() {
    return {
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
    };
  },
  methods: {
    getUserData() {
      this.userTypes = this.$store.state?.userTypes;
      this.user = this.$store.state?.user.user;
    },
    async update() {
      try {
        if (this.user.password !== this.user.passwordconfirm) {
          this.$swal.fire(
            this.$t("profile"),
            this.$t("passwordConfirmationFailed"),
            "error"
          );
        } else {
          this.loading = true;
          const response = await apiUser.update(this.user);
          if (response.status === 401) {
            this.forceLogout(this.$t("profile"));
          } else {
            if (response.data.success) {
              this.$store
                .dispatch("setUser", { user: response.data.data })
                .then(() => {
                  this.$router.push({ name: "home" });
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
            this.$t("profile"),
            this.$t("errorUpdatingProfile"),
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
