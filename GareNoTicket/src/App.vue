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
    // Check if a token is present in the cookie
    this.isLoggedIn = !!Cookies.get('token');
  },
  methods: {
    logout() {
      // Clear the token from the cookie
      Cookies.remove('jwt');

      // Update the isLoggedIn state
      this.isLoggedIn = false;

      // Redirect to the home page or any other route
      this.$router.push('/');
    },
  },
};
</script>
<style scoped></style>
