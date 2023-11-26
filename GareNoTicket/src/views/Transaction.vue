<template>
    <div class="container">
        <h1 class="p-3 text-center">Transaction</h1>
        <div class="text-center">
            <div class="d-flex justify-content-center align-items-center">
                <div class="d-flex align-items-center m-3">
                    <p class="m-2">Total à payer:</p>
                    <p v-if="!(prixTotal >= 20)" class="bg-primary text-white p-2 m-2 rounded">
                        <strong>{{ prixTotal }}$</strong>
                    </p>
                    <div v-else>
                        <p class="bg-danger text-white p-2 m-2 rounded">
                            <strong>{{ prixTotal }}$</strong>
                        </p>
                    </div>
                </div>
                <button :disabled="prixTotal <= 0" @click="payerFacture" class="btn btn-primary m-3">Payer ma facture</button>
            </div>
            <p v-if="prixTotal >= 20" class="text-danger">
                Vous devez payer votre facture, sinon le service vous est coupé!
            </p>
        </div>

        <TableauFacture />
        <TableauHistorique />
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
import TableauFacture from '../components/tableaux/tableauFacture.vue'
import TableauHistorique from '../components/tableaux/tableauHistorique.vue'
export default {
    name: 'Transaction',
    components: { TableauFacture, TableauHistorique },
    data() {
        return {
            prixTotal: 0,
        }
    },
    async mounted() {
        const JWT = Cookies.get('token')
        const response = await axios.get('http://localhost:3000/totalAPayer', {
            headers: {
                Authorization: `Bearer ${JWT}`,
            },
        })
        this.prixTotal = response.data.prixTotal
    },
    methods: {
        async payerFacture() {
            const JWT = Cookies.get('token')
            await axios.get('http://localhost:3000/effectuerPaiement', {
                headers: {
                    Authorization: `Bearer ${JWT}`,
                },
            })
            this.prixTotal = 0;
        },
    },
}
</script>

<style scoped>
/* Your scoped styles here */
</style>
