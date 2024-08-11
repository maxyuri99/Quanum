<template>
  <div id="chart" v-if="!loading">
    <apex-chart
      :options="chartOptions"
      :series="series"
      @beforeMount="beforeMount"
    ></apex-chart>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
import apiAudit from "../services/api/audits.js";
export default {
  components: {
    "apex-chart": VueApexCharts,
  },
  methods: {
    beforeMount: async function () {
      let auditId = this.$route.params.auditId;
      apiAudit.getReports(auditId).then((response) => {
        let responseData = response.data.data;
        for (let form of responseData.forms) {
          this.applicables.push(form.applicables);
          this.totalScore.push(form.totalScore);
          let percentualScore = form.totalScore / (form.applicables * 4);
          percentualScore
            ? this.percentageScore.push(percentualScore)
            : this.percentageScore.push(0);
          this.nonConformancies.push(form.nonConformances);
        }
        this.series = [
          {
            name: "Applicables",
            data: this.applicables,
          },
          {
            name: "Total Score",
            data: this.totalScore,
          },
          {
            name: "% Scoring",
            data: this.percentageScore,
          },
          {
            name: "NL Of NC",
            data: this.nonConformancies,
          },
        ];
      });
      this.loading = false;
    },
    async getData() {},
  },
  data() {
    return {
      loading: false,
      applicables: [],
      totalScore: [],
      percentageScore: [],
      nonConformancies: [],
      series: [],
      chartOptions: {
        chart: {
          height: 1500,
          width: 1500,
          type: "radar",
          dropShadow: {
            enabled: true,
            blur: 1,
            left: 1,
            top: 1,
          },
          toolbar: {
            show: true,
            tools: {
              download: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
            },
          },
        },
        title: {
          text: this.$t("reportTitle"),
        },
        stroke: {
          width: 1,
        },
        fill: {
          opacity: 0.1,
        },
        markers: {
          size: 2,
        },
        xaxis: {
          categories: [
            `1. ${this.$t("management")}`,
            `2. ${this.$t("radiationRegulationsAndSafety")}`,
            `3. ${this.$t("patientRadiationProtection")}`,
            `4. ${this.$t("evaluationOfQualitySystem")}`,
            `5. ${this.$t("qualityControlOfEquipment")}`,
            `6. ${this.$t("computerSystemsAndDataHandling")}`,
            `7. ${this.$t("diagnosticClinicalServices")}`,
            `8. ${this.$t("assessmentOfImagingDiagnosticProcedure")}`,
            `9. ${this.$t("radionuclideTherapy")}`,
            `10. ${this.$t("assessmentOfTherapy")}`,
            `11. ${this.$t("radiopharmacyOperationalLevelOne")}`,
            `12. ${this.$t("radiopharmacyOperationalLevelTwo")}`,
            `13. ${this.$t("radiopharmacyOperationalLevelThree")}`,
            `14. ${this.$t("hormonesAndTumourMarkers")}`,
          ],
        },
      },
    };
  },
};
</script>
