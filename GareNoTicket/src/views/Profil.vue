<template>
    <div class="container">
        <div class="d-flex flex-column align-items-center">
            <div class="d-flex justify-content-center">
                <img
                    class="p-5"
                    :src="'https://source.boringavatars.com/beam/250/' + this.user._id"
                    alt="Photo de profil"
                />
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
                <router-link class="button" to="/profil/user_modify"
                    >Modifier les informations de mon comptes</router-link
                >
                <router-link class="button" to="/profil/car_modify"
                    >Modifier les informations de ma voiture</router-link
                >
                <div class="button-danger" @click="deleteUser">Supprimer mon compte</div>
            </div>
            <RouterView :user="user" />
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
    methods: {
        async deleteUser() {
            const JWT = Cookies.get('token')
            const confirmed = confirm('Are you sure you want to delete your account?')
            if (confirmed) {
                try {
                    const response = await axios.delete('http://localhost:3000/user/', {
                        headers: {
                            Authorization: `Bearer ${JWT}`,
                        },
                    })
                    if (response.status === 204) {
                        console.log('User deleted')
                        Cookies.remove('token')
                        this.$router.push('/')
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        },
    },
}
</script>

<style>
.button {
    background-color: #0d6efd;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 10px;
    margin: 10px;
}
.button:hover {
    background-color: #0a53c2;
}
.button-danger {
    background-color: #dc3545;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 10px;
    margin: 10px;
}
.button-danger:hover {
    background-color: #c82333;
}

</style>
