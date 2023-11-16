<template>
    <div class="container">
        <div class="d-flex flex-column align-items-center">
            <div class="d-flex justify-content-center">
                <img class="p-5" src="https://via.placeholder.com/150" alt="Photo de profil" />
                <div class="d-flex flex-column align-items-center p-5">
                    <h1>Mon profil</h1>
                    <h2>{{ this.user.username }}</h2>
                    <p>Email : {{ this.user.email }}</p>
                    <p>
                        Fonction :
                        <span v-if="this.user.isValet">Valet</span>
                        <span v-if="!this.user.isValet">Utilisateur</span>
                    </p>
                </div>
            </div>
            <div>
                <router-link to="/profil/user_modify">Form 1</router-link>
                <button class="btn btn-danger p-3 m-1">Supprimer mon compte</button>
            </div>
            <RouterView :user="user"/>

        </div>
    </div>

</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
import { toRefs } from 'vue'

export default {
    data() {
        return {
            user: {},
        }
    },
    async mounted() {
        const JWT = Cookies.get('token')
        if (JWT) {
            try {
                const response = await axios.get('http://localhost:3000/user', {
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                    },
                })
                const { user } = toRefs(response.data)
                this.user = user
                console.log('User data:', this.user)
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }
    },
    methods: {},
}
</script>

<style>
/* Your CSS styles go here */
</style>
