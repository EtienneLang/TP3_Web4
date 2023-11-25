<template>
    <div class="container">
        <h1 class="p-3 text-center">Transaction</h1>
        <TableauHistorique />
    </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import TableauHistorique from '../components/tableaux/tableauHistorique.vue'
import { toRefs } from 'vue'
export default {
    name: 'Transaction',
    components: { TableauHistorique },
    async mounted() {},
}
</script>

<style scoped>
/* Your scoped styles here */
</style>
