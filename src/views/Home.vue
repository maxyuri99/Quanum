<template>
  <div class="row h-100 justify-content-center align-items-center">
    <div class="row bg-light border p-0 m-0">
      <div class="col-xl-3 col-md-3 p-3 d-flex row">
        <img
          :src="userData.avatar_url"
          class="rounded-circle m-auto"
          style="max-width: 230px"
          alt="Avatar"
        />
      </div>
      <div
        class="col-xl-9 col-md-9 p-3 d-flex justify-content-md-start justify-content-center"
      >
        <div class="my-auto">
          <h5 class="mb-2 h2">
            <strong>{{ `${userData.firstname} ${userData.lastname}` }}</strong>
          </h5>
          <p class="text-muted m-0">{{ userData.email }}</p>
          <p class="text-muted m-0" v-if="userData.occupation_role">
            {{
              userData.occupation_role.charAt(0).toUpperCase() +
              userData.occupation_role.slice(1)
            }}
          </p>
          <small class="text-muted fw-bold" v-if="userData.type">{{
            $t(userData.type).charAt(0).toUpperCase() +
            $t(userData.type).slice(1)
          }}</small>
          <div class="btn btn-primary col-12 mt-4 mt-md-4 mb-md-0">
            <a
              href="#"
              v-on:click="goToProfilePage()"
              class="text-light text-decoration-none"
              >{{ $t("editProfile") }}</a
            >
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3 mx-0 px-0 justify-content-between align-items-center">
      <small class="text-muted mx-3">{{ lastUpdateAuditsText }}</small>
      <div class="col-md-6 mx-3 justify-content-center">
        <h1 class="offset-3 offset-md-0 my-3 my-md-0">
          {{ $t("audits") }}
          <button
            type="button"
            v-if="!loading"
            v-on:click="getAudits(true)"
            class="btn btn-warning col-3 col-md-1"
          >
            <b-icon icon="arrow-repeat" aria-hidden="true"></b-icon>
          </button>
        </h1>
      </div>
      <div class="col-md-3 d-grid p-3">
        <button
          type="button"
          class="btn btn-success"
          v-if="userData.type == 'manager'"
          v-on:click="goToNewAuditPage()"
        >
          <b-icon icon="plus" aria-hidden="true"></b-icon>
          {{ $t("includeAudit") }}
        </button>
      </div>
      <div v-if="loading" class="d-flex p-5">
        <div class="spinner-border m-auto" role="status">
          <span class="sr-only d-none">{{ $t("loading") }}</span>
        </div>
      </div>
      <div v-else>
        <div name="filters" class="row gx-2">
          <div class="form-floating col-12 col-xl-6">
            <input
              id="filterAuditField"
              class="form-control"
              v-model="nameFilter"
              :placeholder="this.$t('filterByName')"
              autofocus
              autocomplete
            />
            <label for="filterAuditField">{{ $t("filterByName") }}</label>
          </div>
          <div class="form-floating col-6 mt-1 col-xl-3 mt-xl-0">
            <select class="form-select" v-model="orderBySelected">
              <option value="orderByName" selected>{{ $t("name") }}</option>
              <option value="orderByDate">{{ $t("date") }}</option>
              <option value="orderByNC">{{ $t("nonConformances") }}</option>
            </select>
            <label for="floatingSelect">{{ $t("orderBy") }}</label>
          </div>
          <div class="form-floating col-6 mt-1 col-xl-3 mt-xl-0">
            <select class="form-select" v-model="orderRelationSelected">
              <option value="ascendent" selected>{{ $t("ascendent") }}</option>
              <option value="descendent">{{ $t("descendent") }}</option>
            </select>
            <label for="floatingSelect">{{ $t("relation") }}</label>
          </div>
        </div>
        <div
          v-for="audit in filterAudits"
          :key="audit.id"
          class="card text-white bg-primary my-3 p-0"
        >
          <div class="card-header row card-link m-0">
            <h5 class="card-title m-0 fw-bold" @click="goToAuditPage(audit.id)">
              {{ formatName(audit.nameInstitution, audit.createdAt) }}
            </h5>
          </div>
          <div class="card-body row px-0 mx-2">
            <div class="row">
              <div class="col-md-8">
                <p class="card-text m-0">
                  {{ $t("auditCardDate") }} {{ formatDate(audit.createdAt) }}
                </p>
                <p class="card-text m-0">
                  {{ $t("auditCardInstituition") }} {{ audit.nameInstitution }}
                </p>
                <p class="card-text m-0">
                  {{ $t("auditCardAddress") }} {{ audit.addressInstitution }}
                </p>
              </div>
              <div class="col-md-4">
                <p class="card-text m-0">
                  {{ $t("auditCardScore") }}
                  <span
                    :class="
                      audit.scoreCriticalLimit > audit.score
                        ? 'text-danger'
                        : 'text-light-green'
                    "
                    >{{ audit.score }}</span
                  >/{{ audit.scoreMax }}
                </p>
                <div class="row align-items-start">
                  <p class="card-text m-0 col">
                    {{ $t("auditCardNonConformances") }}
                    {{ audit.nonConformances }}
                  </p>
                </div>
                <div class="card-text m-0 row">
                  <div class="col p-0 me-1">
                    {{ `${$t("criticals")}: ${audit.criticals}` }}
                  </div>
                  <div class="col p-0 me-1">
                    {{ `${$t("majors")}: ${audit.majors}` }}
                  </div>
                  <div class="col p-0 me-1">
                    {{ `${$t("minors")}: ${audit.minors}` }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer col">
            <div class="mt-2 row mb-2">
              <a
                href="#"
                class="text-dark btn bg-light card-link"
                @click.prevent.stop="goToAuditPage(audit.id)"
              >
                {{ $t("auditForms") }}
              </a>
            </div>

            <div
              class="row my-2 position-relative"
              @click="getNCPriorities(audit)"
            >
              <a href="#" class="text-dark btn bg-light card-link">
                {{ $t("assignPriorities") }}
              </a>

              <span
                v-if="audit.nonConformancesUnclassified > 0"
                class="position-absolute top-50 translate-middle badge rounded-pill bg-danger rounded-circle"
                style="width: 2rem; left: 95%"
              >
                {{ audit.nonConformancesUnclassified }}
                <span class="visually-hidden">unread messages</span>
              </span>
            </div>

            <div class="row my-2">
              <a
                href="#"
                class="text-dark btn bg-light card-link"
                @click.prevent.stop="getTeam(audit)"
              >
                {{ $t("auditorsTeamInfo") }}
              </a>
            </div>

            <div class="mt-0 row">
              <a
                href="#"
                class="text-dark btn bg-light card-link"
                @click.prevent.stop="goToReport(audit.id)"
              >
                {{ $t("auditCardViewReport") }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      ref="teamModal"
      tabindex="-1"
      aria-labelledby="teamModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="teamModalLabel">
              {{ $t("auditors") }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="modal.hide()"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body row justify-content-center">
            <div
              v-for="user in this.currentTeam"
              :key="user.id"
              class="card col-sm-4 p-sm-0 m-sm-2 col-xl-3 p-xl-0 m-xl-2"
            >
              <img class="card-img-top" v-bind:src="user.avatar_url" />
              <div class="card-body m-0">
                <h5 class="card-title">
                  {{ `${user.firstname} ${user.lastname}` }}
                </h5>
                <p class="m-0 p-0">{{ user.email }}</p>
                <p class="m-0 p-0">{{ `${user.occupation_role}` }}</p>
                <p class="m-0 p-0 fw-bold">
                  {{
                    `${
                      $t(user.type).charAt(0).toUpperCase() +
                      $t(user.type).slice(1)
                    }`
                  }}
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="modal.hide()">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      ref="modalPriorities"
      tabindex="-1"
      aria-labelledby="modalPrioritiesLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalPrioritiesLabel">
              {{ $t("prioritiesAssignments") }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="modalPriorities.hide()"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div
              v-for="(answer, i) in this.currentNCs"
              :key="answer.id"
              class="card mb-3"
            >
              <div class="card-body m-0">
                <h5 class="card-title">
                  <strong class="fw-bold">{{
                    `${answer.questionNumber}`
                  }}</strong>
                  {{ ` - ${answer.portuguese}` }}
                </h5>
                <div class="row mx-5">
                  <p class="m-0 p-0 col fw-bold">
                    {{ $t("conformanceLevel") }}: {{ answer.conformanceLevel }}
                  </p>
                  <div class="col">
                    <label for="priority" class="mx-3 p-0 fw-bold"
                      >{{ $t("priority") }}:
                    </label>
                    <select name="priority" v-model="currentNCs[i].ncPriority">
                      <option
                        selected
                        disabled
                        class="form-select"
                        value="null"
                      >
                        {{
                          getLanguage() == "pt-br"
                            ? "Selecione uma opção"
                            : "Select a option"
                        }}
                      </option>
                      <option value="0">Minor</option>
                      <option value="1">Major</option>
                      <option value="2">Critical</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              @click="modalPriorities.hide()"
            >
              {{ $t("close") }}
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="submitPriorities()"
            >
              {{ $t("submit") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import apiAudit from "@/services/api/audits.js";
import mixinForceLogout from "@/mixins/forceLogout.js";
import { Modal } from "bootstrap";
export default {
  mixins: [mixinForceLogout],
  computed: {
    lastUpdateAuditsText: function () {
      if (this.auditsLastUpdate != null) {
        return `${this.$t("auditsLastUpdate")} ${this.auditsLastUpdate}`;
      }

      return null;
    },

    filterAudits: function () {
      return this.orderAuditsBySelected(this.filterAuditsByName(this.audits));
    },
  },
  data() {
    return {
      modal: null,
      currentTeam: null,
      modalPriorities: null,
      currentNCs: null,
      currentAudit: null,
      userData: {
        id: null,
        email: null,
        firstname: null,
        lastname: null,
        occupation_role: null,
        type: null,
        avatar_url: null,
      },
      audits: [],
      auditsLastUpdate: null,
      loading: false,
      active: false,
      nameFilter: "",
      orderBySelected: "orderByName",
      orderRelationSelected: "ascendent",
    };
  },

  methods: {
    getLanguage() {
      return this.$store.state?.language;
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    formatName(name, dateCreated) {
      dateCreated = new Date(dateCreated);
      let month = new Intl.DateTimeFormat("en-US", { month: "numeric" }).format(
        dateCreated
      );
      let year = dateCreated.getFullYear();

      return `${name} - ${month}/${year}`;
    },
    getUserData() {
      const user = this.$store.state?.user.user;
      const defaultPhotoUrl = process.env.VUE_APP_USER_PROFILE_DEFAULT_PHOTO;

      if (user !== null) {
        this.userData = this.$store.state?.user.user;
      }

      if (
        this.userData.avatar_url === null ||
        this.userData.avatar_url === "null"
      ) {
        this.userData.avatar_url = defaultPhotoUrl;
      }
    },
    goToNewAuditPage() {
      this.$router.push({ name: "newAudit" });
    },
    goToAuditPage(auditId) {
      this.$router.push({ name: "audit", params: { auditId } });
    },
    goToProfilePage() {
      this.$router.push({ name: "profile" });
    },
    goToReport(auditId) {
      this.$router.push({ name: "reports", params: { auditId } });
    },
    async getAudits(update = false) {
      try {
        this.loading = true;

        this.auditsLastUpdate = new Date(
          this.$store.state?.audits?.lastUpdate
        ).toLocaleString();
        this.audits = this.$store.state?.audits?.list ?? [];

        if (update || this.audits.length === 0) {
          const userId = this.$store.state?.user.user.id;
          const response = await apiAudit.get(userId);

          if (response.status !== 200) {
            this.forceLogout(this.$t("home"));
          } else {
            this.auditsLastUpdate = new Date().toLocaleString();
            if (response.data.success) {
              this.audits = response.data.data.sort(
                (a, b) => a.createdAt < b.createdAt
              );
            } else {
              this.$swal.fire(this.$t("home"), response.data.message, "error");
            }
            this.$store
              .dispatch("setAudits", {
                lastUpdate: this.auditsLastUpdate,
                list: this.audits,
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
          this.$swal.fire(this.$t("home"), this.$t("auditsGetFail"), "error");
        }
      } finally {
        this.loading = false;
      }
    },

    filterAuditsByName(audits) {
      return audits.filter(
        (audit) =>
          !audit.nameInstitution
            .toLowerCase()
            .indexOf(this.nameFilter.toLowerCase())
      );
    },

    orderAuditsBySelected(audits) {
      if (this.orderBySelected === "orderByDate") {
        if (this.orderRelationSelected === "ascendent") {
          return audits.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return audits.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      if (this.orderBySelected === "orderByNC") {
        if (this.orderRelationSelected === "ascendent") {
          return audits.sort(
            (a, b) =>
              a.nonConformancesUnclassified - b.nonConformancesUnclassified
          );
        }
        return audits.sort(
          (a, b) =>
            b.nonConformancesUnclassified - a.nonConformancesUnclassified
        );
      }

      if (this.orderRelationSelected === "ascendent") {
        return audits.sort((a, b) =>
          a.nameInstitution.localeCompare(b.nameInstitution)
        );
      }
      return audits.sort((a, b) =>
        b.nameInstitution.localeCompare(a.nameInstitution)
      );
    },

    async getTeam(audit) {
      let response = await apiAudit.getUsers(audit.id);
      this.currentTeam = response.data.data;
      for (let user of this.currentTeam) {
        if (user.avatar_url === "null" || user.avatar_url === null) {
          user.avatar_url = process.env.VUE_APP_USER_PROFILE_DEFAULT_PHOTO;
        }
      }
      this.modal.show();
    },
    async getNCPriorities(audit) {
      let response = await apiAudit.getNCAnswers(audit.id);
      this.currentNCs = response.data.data;
      this.currentAudit = audit;
      this.modalPriorities.show();
    },
    async submitPriorities() {
      try {
        let answersArray = [];
        for (let answer of this.currentNCs) {
          const { id, ncPriority } = answer;
          answersArray.push({ answer_id: String(id), ncPriority });
        }
        let response = await apiAudit.registerNCPriorities(
          this.currentAudit.id,
          answersArray
        );
        if (response.data.data) {
          this.modalPriorities.hide();
          this.getAudits(true);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        this.$swal.fire(this.$t("prioritiesAssignments"), err.message, "error");
      }
    },
  },

  mounted: function () {
    this.getAudits(true);
    this.getUserData();
    this.modal = new Modal(this.$refs.teamModal);
    this.modalPriorities = new Modal(this.$refs.modalPriorities);
  },
};
</script>
<style scoped>
.card-link:hover {
  opacity: 0.7;
  -webkit-transition: all 300ms ease;
  -moz-transition: all 300ms ease;
  -o-transition: all 300ms ease;
  -ms-transition: all 300ms ease;
  transition: all 300ms ease;
}

.card-link {
  cursor: pointer;
}
.text-light-green {
  color: #90ee90;
}
</style>
