<template>
    <div>
        <div class="d-flex flex-column align-items-center justify-content-center">
            <h3>Historique des factures</h3>
            <table class="table table-bordered table-hover w-50">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Prix</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="historiqueItem in facture" :key="historiqueItem.id">
                    <td>{{ historiqueItem.createdAt }}</td>
                    <td>{{ historiqueItem.price/100 + "$" }}</td>
                </tr>
            </tbody>
        </table>
        </div>
        
    </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
export default {
    name: 'TableauFacture',

    data() {
        return {
            facture: [],
        }
    },
    async mounted() {
        const JWT = Cookies.get('token')
        if (JWT) {
            try {
                const response = await axios.get('http://localhost:3000/facture', {
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                    },
                })
                const facture  = response.data.facture
                this.facture = facture
                console.log('Historique data:', this.facture)
            } catch (error) {
                console.error('Error fetching historique data:', error)
            }
        }
    },
}
</script>

<style scoped>
/* Your component's CSS code goes here */
</style>
