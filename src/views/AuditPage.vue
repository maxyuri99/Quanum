<template>
  <div class="container h-100">
    <div class="row mt-3 mb-4">
      <div class="col-md-12">
        <h1 class="h1" v-if="auditData">
          {{ formatName(auditData.nameInstitution, auditData.createdAt) }}
        </h1>
      </div>
    </div>

    <div class="row mt-3 mb-4">
      <div class="col-md-12">
        <h2 class="h2 fw-light">
          {{ $t("checklists") }}
        </h2>
      </div>
    </div>

    <div v-if="loading" class="d-flex p-5">
      <div class="spinner-border m-auto" role="status">
        <span class="sr-only d-none">{{ $t("loading") }}</span>
      </div>
    </div>

    <div
      v-else
      v-for="form in formsData"
      :key="form.id"
      class="mb-2 card flex-row p-3 justify-content-between"
    >
      <div class="my-2 col-sm-10 fw-bold mr-1">
        {{ $t("checklist").toUpperCase() + " " + form.form_number }} -
        {{
          getLanguage() === "pt-br"
            ? form.form_names[0].name.toUpperCase()
            : form.form_names[1].name.toUpperCase()
        }}
      </div>
      <button @click="goToQuestions(form.form_id)" class="btn-primary col-sm-2">
        {{ $t("readOrEdit") }}
      </button>
    </div>

    <div class="row mt-5 mb-4">
      <div class="col-md-12">
        <h1 class="h3 fw-light">
          {{ $t("auditReports") }}
        </h1>
      </div>
    </div>
    <div class="mb-2 card flex-row p-3 justify-content-between d-none">
      <div class="my-2 col-sm-10 fw-bold mr-1">
        {{ $t("summaryImageProcedures").toUpperCase() }}
      </div>
      <button class="btn-secondary col-sm-2">{{ $t("view") }}</button>
    </div>
    <div class="mb-2 card flex-row p-3 justify-content-between d-none">
      <div class="my-2 col-sm-10 fw-bold mr-1">
        {{ $t("scoringTherapyProcedures").toUpperCase() }}
      </div>
      <button class="btn-secondary col-sm-2">{{ $t("view") }}</button>
    </div>
    <div class="mb-2 card flex-row p-3 justify-content-between">
      <div class="my-2 col-sm-10 fw-bold mr-1">
        {{ $t("radarSummary").toUpperCase() }}
      </div>
      <button class="btn-primary col-sm-2" @click="goToRadarChart()">
        {{ $t("view") }}
      </button>
    </div>
  </div>
</template>
<script>
import apiAudit from "@/services/api/audits.js";
export default {
  data() {
    return {
      loading: false,
      auditData: null,
      formsData: [],
      language: "",
    };
  },
  methods: {
    getLanguage() {
      this.language = this.$store.state?.language;
      return this.language;
    },
    formatName(name, dateCreated) {
      dateCreated = new Date(dateCreated);
      let month = new Intl.DateTimeFormat("en-US", { month: "numeric" }).format(
        dateCreated
      );
      let year = dateCreated.getFullYear();

      return `${name} - ${month}/${year}`;
    },
    async getAudit(auditId) {
      let response = await apiAudit.getById(auditId);
      this.auditData = response.data.data;
    },
    async getForms(auditId) {
      this.loading = true;
      let response = await apiAudit.getForms(auditId);
      this.formsData = response.data.data;
      if (!response.data.success) {
        this.$swal.fire(this.$t("auditForms"), response.data.message, "error");
      }
      this.loading = false;
    },

    goToQuestions(formId) {
      let auditId = this.$route.params.auditId;
      this.$router.push({
        name: "answerForm",
        params: { auditId, formId },
      });
    },

    goToRadarChart() {
      let auditId = this.$route.params.auditId;
      this.$router.push({
        name: "reports",
        params: { auditId },
      });
    },
  },
  mounted: function () {
    this.getForms(this.$route.params.auditId);
    this.getAudit(this.$route.params.auditId);
  },
};
</script>
