export default {
    methods: {
        forceLogout(pageName) {
            this.$store.dispatch("logout").then(() => {
                this.$swal.fire(pageName, this.$t('expiredAccess'), "warning");
                this.$router.push({ name: "login" });
            });
        },
    }
}