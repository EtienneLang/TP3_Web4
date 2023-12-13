<template>
    <div class="container">
        <h1 class="p-3 text-center">Transaction</h1>

        <!-- Section du total à payer -->
        <div class="text-center">
            <div class="d-flex justify-content-center align-items-center">
                <div class="d-flex align-items-center m-3">
                    <p class="m-2">Total à payer :</p>
                    <p v-if="!(prixTotal >= 20)" class="bg-primary text-white p-2 m-2 rounded">
                        <strong>{{ prixTotal }}$</strong>
                    </p>
                    <div v-else>
                        <p class="bg-danger text-white p-2 m-2 rounded">
                            <strong>{{ prixTotal }}$</strong>
                        </p>
                    </div>
                </div>
                <button
                    :disabled="prixTotal <= 0"
                    @click="payerFacture"
                    class="btn btn-primary m-3"
                >
                    Payer ma facture
                </button>
            </div>
            <p v-if="prixTotal >= 20" class="text-danger">
                Vous devez payer votre facture, sinon le service vous est coupé !
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
import { useToast } from 'vue-toastification'
import { URL_API } from '../../const'

export default {
    name: 'Transaction',
    components: { TableauFacture, TableauHistorique },
    data() {
        return {
            prixTotal: 0,
            alert: null,
        }
    },
    async mounted() {
        // Récupération du JWT depuis les cookies
        const JWT = Cookies.get('token')

        // Appel à l'API pour obtenir le total à payer
        const response = await axios.get(URL_API + '/totalAPayer', {
            headers: {
                Authorization: `Bearer ${JWT}`,
            },
        })

        // Mise à jour du montant total
        this.prixTotal = response.data.prixTotal
    },
    methods: {
        async payerFacture() {
            // Récupération du JWT depuis les cookies
            const JWT = Cookies.get('token')

            try {
                // Appel à l'API pour effectuer le paiement
                await axios.get(URL_API + '/effectuerPaiement', {
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                    },
                })

                // Réinitialisation du montant total après le paiement
                this.prixTotal = 0

                // Affichage d'un message de succès
                useToast().success('Paiement effectué')
            } catch (error) {
                // Gestion des erreurs
                console.error(error)

                // Affichage d'un message d'erreur
                useToast().error('Erreur lors du paiement')
            }
        },
    },
}
</script>

<style scoped>
/* Vos styles locaux ici */
</style>
