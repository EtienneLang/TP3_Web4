<template>
    <div class="container">
        <h1 class="p-3 text-center">Transaction</h1>
        <TableauFacture />
        <TableauHistorique />
    </div>
</template>

<script>

import TableauFacture from '../components/tableaux/tableauFacture.vue'
import TableauHistorique from '../components/tableaux/tableauHistorique.vue'
export default {
    name: 'Transaction',
    components: { TableauFacture, TableauHistorique },
    async mounted() {},
}
</script>

<style scoped>
/* Your scoped styles here */
</style>
