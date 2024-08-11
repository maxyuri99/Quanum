import getApi from "./index";

export default {
  get(userId) {
    return getApi().get(`/users/${userId}/audits/`);
  },
  getById(auditId) {
    return getApi().get(`/audits/${auditId}`);
  },
  types() {
    return getApi().get("/audits/types");
  },
  register(audit) {
    return getApi().post("/audits", audit);
  },
  getForms(auditId) {
    return getApi().get(`/audits/${auditId}/forms`);
  },
  getQuestionsForm(auditId, formId) {
    return getApi().get(`/audits/${auditId}/forms/${formId}`);
  },
  getUsers(auditId) {
    return getApi().get(`/audits/${auditId}/users`);
  },
  registerAnswers(auditId, formId, formAnswers) {
    return getApi().put(
      `/audits/${auditId}/forms/${formId}/answers`,
      formAnswers
    );
  },
  getAnswers(auditId, formId) {
    return getApi().get(`/audits/${auditId}/forms/${formId}/answers`);
  },
  getNCAnswers(auditId) {
    return getApi().get(`/audits/${auditId}/nconformances`);
  },
  registerNCPriorities(auditId, answers) {
    return getApi().patch(`/audits/${auditId}/nconformances`, answers);
  },
  getReports(auditId) {
    return getApi().get(`/audits/${auditId}/reports`);
  },
};
