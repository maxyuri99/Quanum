<template>
  <div class="container h-100">
    <h2>{{ $t("newAudit") }}</h2>
    <hr />
    <form @submit.prevent="register" class="row g-3">
      <h3>{{ $t("generalData") }}</h3>
      <div class="col-md-6">
        <label for="nameInstitutionField" class="form-label"
          >{{ $t("auditedInstitutionName") }}*</label
        >
        <input
          required
          v-model="audit.name_institution"
          class="form-control"
          id="nameInstitutionField"
        />
      </div>
      <div class="col-md-6">
        <label for="auditTypeField" class="form-label"
          >{{ $t("auditType") }}*</label
        >
        <select
          required
          class="form-control"
          id="auditTypeField"
          v-model="audit.audit_type"
        >
          <option
            v-for="auditType in auditTypes"
            v-bind:key="String(auditType)"
            :selected="audit.audit_type == String(auditType)"
            :value="String(auditType)"
          >
            {{ $t(String(auditType).toLowerCase()).toUpperCase() }}
          </option>
        </select>
      </div>
      <div class="col-12">
        <label for="postalAddressField" class="form-label"
          >{{ $t("postalAddress") }}*</label
        >
        <input
          required
          v-model="audit.postal_address"
          class="form-control"
          id="postalAddressField"
        />
      </div>

      <div class="col-md-6">
        <label for="cityField" class="form-label">{{ $t("city") }}*</label>
        <input
          required
          v-model="audit.city"
          class="form-control"
          id="cityField"
        />
      </div>
      <div class="col-md-6">
        <label for="countryField" class="form-label"
          >{{ $t("country") }}*</label
        >
        <input
          required
          v-model="audit.country"
          class="form-control"
          id="countryField"
        />
      </div>

      <div class="col-md-6">
        <label for="mainContactField" class="form-label"
          >{{ $t("mainContact") }}*</label
        >
        <input
          required
          v-model="audit.main_contact"
          class="form-control"
          id="mainContactField"
        />
      </div>
      <div class="col-md-6">
        <label for="phoneNumberField" class="form-label"
          >{{ $t("phoneNumber") }}*</label
        >
        <input
          required
          v-model="audit.phone_number"
          class="form-control"
          id="phoneNumberField"
        />
      </div>

      <h3>{{ $t("auditorsTeamInfo") }}</h3>

      <div class="col-12">
        <label for="phoneNumberField" class="form-label">{{
          $t("auditors")
        }}</label>
        <div class="list-group mb-1">
          <label class="list-group-item">
            <input
              class="form-check-input me-1"
              type="checkbox"
              checked="checked"
              disabled
              readonly
            />
            {{ user.firstname }} {{ user.lastname }} ({{ user.email }}) -
            {{ user.occupation_role }}
          </label>
        </div>
        <div
          class="list-group mb-1"
          v-for="user in usersToBeAuditors"
          v-bind:key="user.id"
        >
          <label class="list-group-item">
            <input
              class="form-check-input me-1"
              type="checkbox"
              :value="{ id: user.id }"
              v-model="audit.auditors"
            />
            {{ user.firstname }} {{ user.lastname }} ({{ user.email }}) -
            {{ user.occupation_role }}
          </label>
        </div>
      </div>

      <div class="col-12">
        <button :disabled="loading" type="submit" class="btn btn-primary">
          {{ $t("submit") }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import apiUser from "@/services/api/users.js";
import apiAudit from "@/services/api/audits.js";
import mixinForceLogout from "@/mixins/forceLogout.js";
export default {
  mixins: [mixinForceLogout],
  data() {
    return {
      usersToBeAuditorsLastUpdate: null,
      usersToBeAuditors: [],
      loading: false,
      auditTypesLastUpdate: null,
      auditTypes: [],
      audit: {
        name_institution: null,
        postal_address: null,
        city: null,
        country: null,
        main_contact: null,
        phone_number: null,
        audit_type: null,
        auditors: [],
      },
    };
  },
  computed: {
    user() {
      return this.$store.state?.user.user;
    },
  },
  mounted: function () {
    this.getPageData();
    this.getAuditTypes();
  },
  methods: {
    getPageData() {
      this.auditTypes = this.$store.state?.auditTypes;
      this.getUsersToBeAuditors(true);
    },
    async register() {
      try {
        this.loading = true;
        let tempUser = this.$store.state.user.user;
        this.audit.auditors = [...this.audit.auditors, { id: tempUser.id }];
        const response = await apiAudit.register(this.audit);
        if (response.data.success) {
          this.$router.push({ name: "home" });
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        this.$swal.fire(this.$t("newAudit"), err.message, "error");
      } finally {
        this.loading = false;
      }
    },
    async getAuditTypes(update = false) {
      try {
        this.auditTypesLastUpdate = this.$store.state?.auditTypes?.lastUpdate;
        this.auditTypes = this.$store.state?.auditTypes?.list ?? [];

        if (update || this.auditTypes.length == 0) {
          const response = await apiAudit.types();
          if (response.status === 401) {
            this.forceLogout(this.$t("newAudit"));
          } else {
            this.auditTypesLastUpdate = new Date();
            if (response.data.success) {
              this.auditTypes = response.data.data;
            } else {
              this.$swal.fire(
                this.$t("newAudit"),
                response.data.message,
                "error"
              );
            }

            this.$store
              .dispatch("setAuditTypes", {
                lastUpdate: this.auditTypesLastUpdate,
                list: this.auditTypes,
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
            this.$t("newAudit"),
            this.$t("auditTypesGetFail"),
            "error"
          );
        }
      }
    },
    async getUsersToBeAuditors(update = false) {
      try {
        this.usersToBeAuditorsLastUpdate =
          this.$store.state?.usersToBeAuditors?.lastUpdate;
        this.usersToBeAuditors =
          this.$store.state?.usersToBeAuditors?.list ?? [];

        if (update || this.usersToBeAuditors.length == 0) {
          const response = await apiUser.usersList();
          if (response.status === 401) {
            this.forceLogout(this.$t("newAudit"));
          } else {
            this.usersToBeAuditorsLastUpdate = new Date();
            if (response.data.success) {
              let auditorsFiltered = response.data.data.filter(
                (i) => i.id !== this.$store.state.user.user.id
              );
              this.usersToBeAuditors = auditorsFiltered;
            } else {
              this.$swal.fire(
                this.$t("newAudit"),
                response.data.message,
                "error"
              );
            }

            this.$store
              .dispatch("setUsersToBeAuditors", {
                lastUpdate: this.usersToBeAuditorsLastUpdate,
                list: this.usersToBeAuditors,
              })
              .then(() => {
                console.log(this.$t("usersToBeAuditorsGetSuccess"));
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
            this.$t("newAudit"),
            this.$t("usersToBeAuditorsGetFail"),
            "error"
          );
        }
      }
    },
  },
};
</script>
