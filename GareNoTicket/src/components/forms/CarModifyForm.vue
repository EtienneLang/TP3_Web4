<template>
    <form @submit.prevent="submitForm" method="PUT" class="p-3 border rounded w-25 m-5">
        <div class="form-group">
            <label for="marque">Marque:</label>
            <input
                type="text"
                id="marque"
                v-model="voiture.marque"
                class="form-control"
                required
            />
        </div>
        <div class="form-group">
            <label for="modele">Modele:</label>
            <input
                type="text"
                id="modele"
                v-model="voiture.modele"
                class="form-control"
                required
            />
        </div>
        <div class="form-group">
            <label for="couleur">Couleur:</label>
            <input
                type="text"
                id="couleur"
                v-model="voiture.couleur"
                class="form-control"
                required
            />
        </div>
        <div class="form-group">
            <label for="plaque">Plaque:</label>
            <input
                type="text"
                id="plaque"
                v-model="voiture.plaque"
                class="form-control"
                required
            />
        </div>
        <button type="submit" class="btn btn-primary mt-2">Modifier</button>
    </form>
</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
export default {
    name: 'CarModifyForm',
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            voiture: {
                marque: '',
                modele: '',
                couleur: '',
                plaque: '',
            },
        }
    },
    methods: {
        async submitForm() {
            const JWT = Cookies.get('token')
            try {
                const response = await axios.put(
                    'http://localhost:3000/car/' + this.user._id,
                    {
                        marque: this.user.voiture.marque,
                        modele: this.user.voiture.modele,
                        couleur: this.user.voiture.couleur,
                        plaque: this.user.voiture.plaque,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${JWT}`,
                        },
                    },
                )
                if (response.status === 200) {
                    console.log('User modified')
                    //Cookies.set('token', response.data.token, { expires: 1 })
                    this.$router.push('/')
                }
            } catch (error) {
                console.error(error)
            }
        },
    },
}
</script>
