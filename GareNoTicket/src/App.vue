<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <header>
        <div>
            <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
                <div class="container-fluid">
                    <RouterLink class="navbar-brand" to="/"><i>Gare<strong>NoTicket</strong></i></RouterLink>
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
                                <RouterLink v-if="!isLoggedIn" class="nav-link" to="/login">Login</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink v-if="!isLoggedIn" class="nav-link" to="/signup">Sign Up</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink v-if="isLoggedIn" class="nav-link" to="/profil">Mon profil</RouterLink>
                            </li>
                            <li>
                                <RouterLink v-if="isLoggedIn" class="nav-link" to="/maplace">Ma place</RouterLink>
                            </li>
                            <li class="nav-item">
                                <a v-if="isLoggedIn" class="nav-link" @click="logout">Logout</a>
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
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      isLoggedIn: false,
    };
  },
  mounted() {
    this.isLoggedIn = !!Cookies.get('token');
  },
  methods: {
    logout() {
      Cookies.remove('token');
      this.isLoggedIn = false;
      this.$router.push('/');
    },
  },
};
</script>
<style scoped></style>
