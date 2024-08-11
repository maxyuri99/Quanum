<template>
  <DefaultLayout id="app">
    <transition name="fade" mode="out-in">
      <router-view class="view" />
    </transition>
  </DefaultLayout>
</template>
<script>
import DefaultLayout from "@/components/layouts/Default.vue";
export default {
  components: {
    DefaultLayout,
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0.5;
}
</style>
