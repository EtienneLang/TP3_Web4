<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <header>
        <div>
            <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
                <div class="container-fluid">
                    <RouterLink class="navbar-brand" to="/"
                        ><i>Gare<strong>NoTicket</strong></i></RouterLink
                    >
                    <button
                        class="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarColor01"
                        aria-controls="navbarColor01"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarColor01">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <RouterLink class="nav-link" to="/">Accueil</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink v-if="!isLoggedIn" class="nav-link" to="/login"
                                    >Se connecter</RouterLink
                                >
                            </li>
                            <li class="nav-item">
                                <RouterLink v-if="!isLoggedIn" class="nav-link" to="/signup"
                                    >Crée un compte</RouterLink
                                >
                            </li>
                            <li class="nav-item">
                                <RouterLink v-if="isLoggedIn" class="nav-link" to="/profil"
                                    >Mon profil</RouterLink
                                >
                            </li>
                            <li>
                                <RouterLink v-if="isLoggedIn" class="nav-link" to="/maplace"
                                    >Ma place</RouterLink
                                >
                            </li>
                            <li>
                                <RouterLink
                                    v-if="isLoggedIn && user.isValet === false"
                                    class="nav-link"
                                    to="/transaction"
                                    >Transaction</RouterLink
                                >
                            </li>
                            <li class="nav-item">
                                <a v-if="isLoggedIn" class="nav-link" @click="logout">Se déconnecter</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </header>
    <RouterView />
</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
import {URL_API} from '../const.js'
import { toRefs } from 'vue'

export default {
    data() {
        return {
            isLoggedIn: false,
            user: {},
        }
    },
    async mounted() {
        this.isLoggedIn = !!Cookies.get('token')
        const JWT = Cookies.get('token')
        if (JWT) {
            try {
                const response = await axios.get(URL_API + '/user', {
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
        logout() {
            Cookies.remove('token')
            this.isLoggedIn = false
            this.$router.push('/')
        },
    },
}
</script>
<style scoped></style>
