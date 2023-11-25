<template>
    <div class="container">
        <h1 class="p-3 text-center">Transaction</h1>
        <TableauFacture />
    </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import TableauFacture from '../components/tableaux/tableauFacture.vue'
import { toRefs } from 'vue'
export default {
    name: 'Transaction',
    components: { TableauFacture },
    async mounted() {},
}
</script>

<style scoped>
/* Your scoped styles here */
</style>
