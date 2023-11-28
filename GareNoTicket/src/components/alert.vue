<template>
  <div>
     <!-- Alert de succès -->
     <div
        v-if="alert === 'success'"
        class="alert alert-success alert-dismissible fade show"
        role="alert"
    >
        L'action a été effectuée avec succès !
    </div>
    <!-- Alert d'erreur -->
    <div
        v-if="alert === 'error'"
        class="alert alert-danger alert-dismissible fade show"
        role="alert"
    >
        Une erreur est survenue, veuillez réessayer.
    </div>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    alert: {
      type: String,
      required: true,
    },
  },

};
</script>

<style scoped>

</style>
