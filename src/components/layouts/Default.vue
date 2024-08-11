<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway+Dots&family=Raleway:wght@700&display=swap");
</style>
<template>
  <div>
    <header>
      <b-navbar toggleable="md" type="dark" variant="primary" class="fixed-top">
        <b-navbar-brand :to="{ name: 'home' }">
          <strong class="mx-5 logo-nav-font"> {{ applicationName }}</strong>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse">
          <template #default="{ expanded }">
            <b-icon-chevron-bar-up v-if="expanded"></b-icon-chevron-bar-up>
            <b-icon-chevron-bar-down v-else></b-icon-chevron-bar-down>
          </template>
        </b-navbar-toggle>

        <b-collapse id="nav-collapse" class="justify-content-end mx-5" is-nav>
          <b-navbar-nav>
            <template v-if="$store.getters.loggedUser">
              <strong class="text-light"
                ><a
                  href="https://www.youtube.com/watch?v=EFtevXIowAE"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-light btn fw-bold"
                  >{{ $t("tutorialNav") }}</a
                ></strong
              >
              <strong class="text-light"
                ><a
                  href="https://www-pub.iaea.org/MTCD/Publications/PDF/PUB1923_web.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-light btn fw-bold"
                  >{{ $t("manualQuanum") }}</a
                ></strong
              >
            </template>
            <template v-else>
              <b-nav-item
                :active="$route.name === 'login'"
                :to="{ name: 'login' }"
                >{{ $t("login") }}</b-nav-item
              >
              <b-nav-item
                :active="$route.name === 'signUp'"
                :to="{ name: 'signUp' }"
                >{{ $t("signUp") }}</b-nav-item
              >
            </template>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <div class="btn-group my-3 my-md-0 ms-4" role="group">
              <template v-for="entry in languages">
                <input
                  :key="'input' + entry.language"
                  type="radio"
                  class="btn-check"
                  name="langToogle"
                  :id="'langToogle' + entry.language"
                  v-on:change="changeLocale(entry.language)"
                  :checked="entry.language == selectedLanguage"
                />
                <label
                  :key="'label' + entry.language"
                  class="btn btn-outline-light"
                  :for="'langToogle' + entry.language"
                >
                  {{ entry.title }}</label
                >
              </template>
            </div>
            <button
              v-if="$store.getters.loggedUser"
              type="button"
              v-on:click="logout()"
              class="btn btn-danger mx-md-3"
            >
              {{ $t("logout") }}
            </button>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
    <main role="main" class="container py-5">
      <slot></slot>
    </main>

    <footer class="footer w-100 bg-light text-center row">
      <div class="col-12 col-md-4 offset-md-3">
        <div class="row fw-bold">
          <b-link
            :to="{ name: 'about' }"
            class="col-12 col-md-4 col-xl-2 text-dark"
            >{{ $t("about") }}</b-link
          >

          <a
            href="https://forms.gle/U1x9Uk11pwe6KUy17"
            target="_blank"
            rel="noopener noreferrer"
            class="col text-dark text-xl-start"
            >Colabore com a avaliação do sistema</a
          >
        </div>
      </div>
      <div class="col-12 col-md-4">
        <span class="logo-nav-font">{{ applicationName }}</span> v0.1
      </div>
    </footer>
  </div>
</template>
<script>
import apiUser from "@/services/api/users.js";
import i18n from "@/plugins/i18n";

export default {
  data() {
    return {
      applicationName: process.env.VUE_APP_NAME,
      languages: [
        { language: "en", title: "English" },
        { language: "pt-br", title: "Português" },
      ],
    };
  },
  computed: {
    selectedLanguage: function () {
      return this.$store.state?.language ?? "pt-br";
    },
  },
  mounted: function () {
    this.changeLocale(this.selectedLanguage);
  },
  methods: {
    changeLocale(locale) {
      this.$store
        .dispatch("setLanguage", locale)
        .then(() => {
          i18n.locale = locale;
        })
        .catch((err) => {
          if (err) {
            throw err;
          }
        });
    },
    logout() {
      this.$swal.fire({
        title: this.$t("logout"),
        text: this.$t("logoutActionText"),
        showCancelButton: true,
        confirmButtonText: this.$t("confirmY"),
        cancelButtonText: this.$t("cancel"),
        icon: "warning",
        preConfirm: async () => {
          try {
            const response = await apiUser.logout().catch(function (error) {
              if (error.response) {
                return error.response;
              }
            });
            this.$store
              .dispatch("logout")
              .then(() => {
                this.$swal.fire(
                  this.$t("logout"),
                  response.data.success
                    ? response.data.message
                    : this.$t("logoutActionSuccessText"),
                  "success"
                );
                this.$router.push({ name: "login" });
              })
              .catch((err) => {
                if (err) {
                  throw err;
                }
              });
          } catch (ex) {
            console.log(ex);
          }
        },
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !this.$swal.isLoading(),
      });
    },
  },
};
</script>
<style scoped>
main[role="main"].container.py-5 {
  margin-top: 56px;
  margin-bottom: 40px;
}
footer.footer.w-100.bg-light {
  position: fixed;
  bottom: 0;
  background-color: #e3e3e3;
}
</style>
