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
                    >Modifier les informations de mon compte</router-link
                >
                <router-link v-if="!this.user.isValet" class="button" to="/profil/car_modify"
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
import { URL_API } from '../../const'

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
                // Récupération des données utilisateur depuis l'API
                const response = await axios.get(URL_API + '/user', {
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                    },
                })
                const { user } = toRefs(response.data)
                this.user = user
                this.user.price = this.user.price / 100
                console.log('Données utilisateur:', response)
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur :', error)
            }
        }
    },
    methods: {
        // Méthode pour supprimer le compte utilisateur
        async deleteUser() {
            const JWT = Cookies.get('token')
            const confirmed = confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')
            if (confirmed) {
                try {
                    // Appel à l'API pour supprimer le compte
                    const response = await axios.delete(URL_API + '/user/', {
                        headers: {
                            Authorization: `Bearer ${JWT}`,
                        },
                    })
                    if (response.status === 204) {
                        // Suppression du cookie de token
                        Cookies.remove('token')
                        // Redirection vers la page d'accueil
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
