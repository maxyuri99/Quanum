<template>
  <div class="container h-100">
    <div class="row mt-3 mb-4 justify-content-center text-center text-md-left">
      <div class="col-12">
        <h1 class="h1">
          {{ getLanguage() == "pt-br" ? "LISTA DE VERIFICAÇÃO" : "CHECKLIST" }}
          {{ " " + formData.formNumber }} -
          {{
            getLanguage() == "pt-br"
              ? formData.formNames.portuguese
              : formData.formNames.english
          }}
        </h1>
      </div>
    </div>

    <div v-if="loading" class="d-flex p-5">
      <div class="spinner-border m-auto" role="status">
        <span class="sr-only d-none">{{ $t("loading") }}</span>
      </div>
    </div>
    <form @submit.prevent="submitForm" v-else>
      <div v-for="(topic) in formData.topics" :key="topic.id">
        <div class="row mt-5 justify-content-start">
          <div class="col-12">
            <h1 class="h2">
              {{ getLanguage() == "pt-br" ? topic.portuguese : topic.english }}
              
            </h1>
          </div>
        </div>
        

        <div
          class="justify-content-start mt-5"
          v-for="(question) in topic.questions"
          :key="question.id"
        >
          <b-row class="fw-bold text-uppercase">
            <b-col class="mb-0 b-col" cols="1">{{ question.number }}</b-col>
            <b-col class="justify-content-left m-auto" cols="11">
              {{
                getLanguage() == "pt-br"
                  ? question.portuguese.question
                  : question.english.question
              }}
            </b-col>
          </b-row>
          <div
            class="row text-uppercase fw-bold mt-2 justify-content-sm-between justify-content-lg-start"
          >
            <label class="col-md-3 col-lg-2 col-4 offset-sm-1"
              >{{
                getLanguage() == "pt-br"
                  ? "Nível de conformidade"
                  : "Conformance level"
              }}:</label
            >
            <div class="col-md-3 col-6">
              <select
                class="form-select h-100"
                v-model="
                  formAnswers[getAnswerIndex(question, formAnswers)].conformance_lvl
                "
                required
              >
                <option disabled class="form-select" value="null">
                  {{
                    getLanguage() == "pt-br"
                      ? "Selecione uma opção"
                      : "Select a option"
                  }}
                </option>
                <option selected value="NA">
                  {{
                    getLanguage() == "pt-br"
                      ? "Não Aplicável"
                      : "Not Applicable"
                  }}
                </option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
          <b-row class="">
            <b-col
              offset-sm="1"
              class="d-flex flex-md-column fw-bold text-uppercase my-2"
            >
              {{
                getLanguage() == "pt-br"
                  ? "Comentários / Ações planejadas"
                  : "Comments / Planned actions"
              }}:
              <textarea
                class="h-100"
                v-model="formAnswers[getAnswerIndex(question, formAnswers)].comment"
                :placeholder="$t('commentFieldPlaceholder')"
              >
            </textarea>
            </b-col>
            <b-col offset-sm="1" class="d-flex flex-md-column my-2">
              <p class="fw-bold text-uppercase">
                {{
                  getLanguage() == "pt-br"
                    ? "Exemplos de resultado / Tipos de evidências"
                    : "Example of result / Type of evidence"
                }}:
              </p>
              <p class="offset-md-0 offset-sm-3">
                {{
                  getLanguage() == "pt-br"
                    ? question.portuguese.evidencePlaceholder
                    : question.english.evidencePlaceholder
                }}
              </p>
            </b-col>

            <b-row
              class="d-flex flex-md-column fw-bold text-uppercase my-2 offset-sm-1"
            >
              <label class="p-0">{{
                getLanguage() == "pt-br"
                  ? "Anexo de evidências"
                  : "Evidences attachment"
              }}</label>
              <input
                class="col-md-5"
                :placeholder="$t('evidenceFieldPlaceholder')"
                v-model.trim="
                  formAnswers[getAnswerIndex(question, formAnswers)].evidences
                "
              />
            </b-row>
          </b-row>
        </div>
      </div>
      <div class="row justify-content-center my-5">
        <button type="submit" class="btn btn-primary col-4 offset-2">
          {{ getLanguage() == "pt-br" ? "Enviar" : "Submit" }}
        </button>
        <button
          type="button"
          class="btn btn-danger col-4 offset-1"
          @click="goBack()"
        >
          {{ getLanguage() == "pt-br" ? "Cancelar" : "Cancel" }}
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import apiAudit from "@/services/api/audits.js";
export default {
  data() {
    return {
      loading: false,
      formAnswers: [],
      formData: {
        formId: this.$route.params.formId,
        formNumber: "",
        formNames: {
          portuguese: "",
          english: "",
        },
        topics: [],
      },
    };
  },
  methods: {
    getLanguage() {
      return this.$store.state?.language;
    },
    goBack() {
      this.$router.back();
    },

    async getQuestionsForm() {
      this.loading = true;
      let auditId = this.$route.params.auditId;
      let formId = this.$route.params.formId;
      const response = await apiAudit.getQuestionsForm(auditId, formId);
      this.formData = response.data.data;
      this.initAnswers(this.formData.topics);
      this.loading = false;
    },

    getAnswerIndex(question, form) {
      return form.findIndex(item => item.question_id === question.id);
    },

    async initAnswers(topics) {
      this.loading = true;
      let auditId = this.$route.params.auditId;
      let formId = this.$route.params.formId;
      apiAudit.getAnswers(auditId, formId).then((response) => {
        if (response.data.data.length !== 0) {
          this.formAnswers = response.data.data;
          

          this.loading = false;
        } else {
          for (let topic of topics) {
            for (let question of topic.questions) {
              let answer = {
                question_id: question.id,
                conformance_lvl: null,
                comment: "",
                evidences: "",
              };
              this.formAnswers.push(answer);
            }
          }
        }
        this.loading = false;
      });
    },

    evidencesToArray() {
      this.formAnswers.map((answer) => {
        if (answer.evidences === "") {
          answer.evidences = [];
          return;
        }
        if (typeof answer.evidences === "string")
          answer.evidences = answer.evidences
            .split(",")
            .map((link) => link.trim())
            .filter((link) => link.length > 0);
      });
    },

    async submitForm() {
      try {
        const auditId = this.$route.params.auditId;
        const formId = this.$route.params.formId;

        for (let answer of this.formAnswers) {
          if (
            answer.conformance_lvl === null ||
            answer.conformance_lvl === "null"
          ) {
            throw new Error("All conformance levels must be selected");
          }
        }
        this.evidencesToArray();
        const response = await apiAudit.registerAnswers(
          auditId,
          formId,
          this.formAnswers
        );
        if (response.data.success) {
          let auditId = this.$route.params.auditId;
          this.$router.push({ name: "audit", params: { auditId } });
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        this.$swal.fire(
          this.$t("checklist"),
          `${this.$t("checklistPostFail")}<br>"${err.message}"`,
          "error"
        );
      }
    },
  },
  created: function () {
    this.getQuestionsForm();
  },
};
</script>
