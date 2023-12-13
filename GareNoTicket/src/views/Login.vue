<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Login</div>
                    <div class="card-body">
                        <form @submit.prevent="login" method="post">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input
                                    v-model="email"
                                    type="text"
                                    class="form-control"
                                    id="email"
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input
                                    v-model="password"
                                    type="password"
                                    class="form-control"
                                    id="password"
                                    required
                                />
                            </div>
                            <div class="text-danger">{{ messageErreur }}</div>
                            <button type="submit" class="btn btn-primary">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
import { URL_API } from '../../const'

export default {
  data() {
    return {
      email: '',
      password: '',
      messageErreur: '',
    };
  },
  methods: {
    async login() {
      try {
        // Envoi de la requête de connexion au serveur
        const response = await axios.post(URL_API + '/auth/login', {
          email: this.email,
          password: this.password,
        });

        // Si la connexion est réussie, enregistrez le jeton dans les cookies
        if (response.status === 200) {
          Cookies.set('token', response.data.token, { expires: 1 });
          // Redirigez l'utilisateur vers la page '/maplace'
          this.$router.push('/maplace');
        }
      } catch (error) {
        // En cas d'erreur lors de la requête
        console.log(error);
        if (error.response.status === 401) {
          // Si le serveur renvoie un statut 401, affichez le message d'erreur
          console.log(error.response);
          this.messageErreur = error.response.data.message;
        } else {
          // Gestion des autres erreurs
          console.error(error);
        }
      }
    },
  },
};
</script>