<template>
    <div>
        <div class="d-flex flex-column align-items-center justify-content-center">
            <h3>Historique des déplacements</h3>
            <table class="table table-bordered table-hover w-50">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Prix</th>
                    <th>Payé</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="historiqueItem in historique" :key="historiqueItem.id">
                    <td>{{ historiqueItem.createdAt }}</td>
                    <td>{{ historiqueItem.price/100 + "$" }}</td>
                    <td v-if="historiqueItem.isPaid">Oui</td>
                    <td v-else>Non</td>
                </tr>
            </tbody>
        </table>
        </div>
        
    </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import {URL_API} from '../../../const'

export default {
    name: 'TableauHistorique',
    data() {
        return {
            historique: [],
        }
    },
    async mounted() {
        const JWT = Cookies.get('token')
        if (JWT) {
            try {
                const response = await axios.get(URL_API + '/historique', {
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                    },
                })
                const historique  = response.data.histo
                this.historique = historique
                console.log('Historique data:', this.historique)
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
