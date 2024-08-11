<template>
  <div class="row">
    <div class="col-md-6">
      <div class="form-group">
        <label for="firstNameField">{{ $t("firstName") }}*</label>
        <input
          id="firstNameField"
          class="form-control"
          v-model="userObj.firstname"
          :placeholder="this.$t('firstName')"
          autofocus
          autocomplete
          required
        />
      </div>
    </div>
    <div class="col-md-6">
      <div class="form-group">
        <label for="lastNameField">{{ $t("lastName") }}*</label>
        <input
          id="lastNameField"
          class="form-control"
          v-model="userObj.lastname"
          :placeholder="this.$t('lastName')"
          autocomplete
          required
        />
      </div>
    </div>
    <div class="col-md-6">
      <div class="form-group">
        <label for="emailField">{{ $t("email") }}*</label>
        <input
          id="emailField"
          type="email"
          class="form-control"
          v-model="userObj.email"
          :placeholder="this.$t('email')"
          autocomplete
          required
        />
      </div>
    </div>
    <div class="col-md-6">
      <div class="form-group">
        <label for="roleField">{{ $t("role") }}</label>
        <input
          id="roleField"
          class="form-control"
          v-model="userObj.occupation_role"
          :placeholder="this.$t('roleNMphysician')"
        />
      </div>
    </div>
    <div v-if="!isRegister" class="col-12">
      <div class="form-check form-switch mt-3">
        <input
          class="form-check-input"
          type="checkbox"
          id="updatePasswordSwitch"
          v-on:change="changeUpdatePasswordBooleanField()"
        />
        <label class="form-check-label" for="updatePasswordSwitch">{{
          $t("wantUpdateYourPassword")
        }}</label>
      </div>
    </div>
    <template v-if="isRegister || updatePassword">
      <div class="col-md-6">
        <div class="form-group">
          <label for="passwordField"
            >{{ $t(isRegister ? "password" : "newPassword") }}*</label
          >
          <input
            id="passwordField"
            type="password"
            class="form-control"
            required
            :placeholder="this.$t(this.isRegister ? 'password' : 'newPassword')"
            v-model="userObj.password"
          />
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="passwordConfirmField"
            >{{
              $t(isRegister ? "passwordConfirm" : "confirmNewPassword")
            }}*</label
          >
          <input
            id="passwordConfirmField"
            type="password"
            class="form-control"
            required
            :placeholder="
              this.$t(
                this.isRegister ? 'passwordConfirm' : 'confirmNewPassword'
              )
            "
            v-model="userObj.passwordconfirm"
          />
        </div>
      </div>
    </template>
    <div class="col-md-6">
      <div class="form-group">
        <label for="typeField">{{ $t("type") }}*</label>
        <select
          required
          class="form-select"
          id="typeField"
          v-model="userObj.type"
        >
          <option
            v-for="(userType, i) in userTypes"
            v-bind:key="userType"
            :value="userTypes[i].toLowerCase()"
          >
            {{ $t(userType.toLowerCase()).toUpperCase() }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="!isRegister" class="col-md-6">
      <div class="form-group">
        <label for="avatarUrlField">{{ $t("avatarUrl") }}</label>
        <input
          id="avatarUrlField"
          class="form-control"
          v-model="userObj.avatar_url"
          :placeholder="this.$t('avatarUrl')"
          autofocus
          autocomplete
        />
      </div>
    </div>
  </div>
</template>
<script>
import apiUser from "../../services/api/users.js";
export default {
  data() {
    return {
      userTypesLastUpdate: null,
      userTypes: [],
      updatePassword: false,
      userObjType: "",
    };
  },
  props: ["userObj", "isRegister", "page"],
  mounted: function () {
    this.getUserTypes();
    this.userObjType = this.setUserObjType;
  },

  methods: {
    setUserObjType() {
      console.log(this.getLanguage());
      this.userObjType = this.userObj.type.toUpperCase();
    },
    getLanguage() {
      this.language = this.$store.state?.language;
      return this.language;
    },
    async getUserTypes(update = false) {
      try {
        this.userTypesLastUpdate = this.$store.state?.userTypes?.lastUpdate;
        this.userTypes = this.$store.state?.userTypes?.list ?? [];

        if (update || this.userTypes.length == 0) {
          const response = await apiUser.types();

          if (response.status === 401) {
            this.forceLogout(this.$t(this.page));
          } else {
            this.userTypesLastUpdate = new Date();
            if (response.data.success) {
              this.userTypes = response.data.data;
            } else {
              this.$swal.fire(
                this.$t(this.page),
                response.data.message,
                "error"
              );
            }

            this.$store
              .dispatch("setUserTypes", {
                lastUpdate: this.userTypesLastUpdate,
                list: this.userTypes,
              })
              .then(() => {
                console.log(this.$t("userTypesGetSuccess"));
              })
              .catch((err) => {
                if (err) {
                  throw err;
                }
              });
          }
        }
      } catch (e) {
        if (e) {
          this.$swal.fire(
            this.$t(this.page),
            this.$t("userTypesGetFail"),
            "error"
          );
        }
      }
    },
    changeUpdatePasswordBooleanField() {
      this.updatePassword = !this.updatePassword;
      this.userObj.password = null;
      this.userObj.passwordconfirm = null;
    },
  },
};
</script>
