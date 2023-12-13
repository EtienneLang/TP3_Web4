<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Créer un compte</div>
                    <div class="card-body">
                        <form @submit.prevent="register" method="post">
                            <div class="mb-3">
                                <label for="username" class="form-label">Nom d'utilisateur :</label>
                                <input
                                    v-model.trim="username"
                                    type="text"
                                    class="form-control"
                                    id="username"
                                    required
                                    @blur="validerUsername"
                                />
                                <div v-if="error.username" class="text-danger">{{ error.username }}</div>
                            </div>

                            <div class="mb-3">
                                <label for="email" class="form-label">Email :</label>
                                <input
                                    v-model.trim="email"
                                    type="email"
                                    class="form-control"
                                    id="email"
                                    required
                                    @blur="validerEmail"
                                />
                                <div v-if="error.email" class="text-danger">{{ error.email }}</div>
                            </div>

                            <div class="mb-3">
                                <label for="password" class="form-label">Mot de passe :</label>
                                <input
                                    v-model.trim="password"
                                    type="password"
                                    class="form-control"
                                    id="password"
                                    required
                                    @blur="validerPassword"
                                />
                                <div v-if="error.password" class="text-danger">{{ error.password }}</div>
                            </div>

                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label">Confirmation mot de passe :</label>
                                <input
                                    v-model.trim="confirmPassword"
                                    type="password"
                                    class="form-control"
                                    id="confirmPassword"
                                    required
                                    @blur="validerConfirmPassword"
                                />
                                <div v-if="error.confirmPassword" class="text-danger">{{ error.confirmPassword }}</div>
                            </div>

                            <button
                                :disabled="
                                    error.username ||
                                    error.email ||
                                    error.password ||
                                    error.confirmPassword
                                "
                                type="submit"
                                class="btn btn-primary"
                            >
                                Créer un compte
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { URL_API } from '../../const'

export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: {
                username: null,
                email: null,
                password: null,
                confirmPassword: null,
            },
        }
    },
    methods: {
        // Validation de l'email
        validerEmail() {
            const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!regEx.test(this.email)) {
                this.error.email = 'Veuillez entrer une adresse email valide'
            } else if (this.email.length === 0) {
                this.error.email = "L'adresse email est requise"
            } else {
                this.error.email = null
            }
        },

        // Validation du nom d'utilisateur
        validerUsername() {
            if (this.username.length === 0) {
                this.error.username = "Le nom d'utilisateur est requis"
            } else if (this.username.length < 3) {
                this.error.username = "Le nom d'utilisateur doit contenir au moins 3 caractères"
            } else if (this.username.length > 50) {
                this.error.username = "Le nom d'utilisateur doit contenir au maximum 50 caractères"
            } else {
                this.error.username = null
            }
        },

        // Validation du mot de passe
        validerPassword() {
            if (this.password.length < 6) {
                this.error.password = 'Le mot de passe doit contenir au moins 6 caractères'
            } else if (this.password.length === 0) {
                this.error.password = 'Le mot de passe est requis'
            } else {
                this.error.password = null
            }
        },

        // Validation de la confirmation du mot de passe
        validerConfirmPassword() {
            if (this.confirmPassword !== this.password) {
                this.error.confirmPassword = 'Les mots de passe ne correspondent pas'
            } else if (this.confirmPassword.length === 0) {
                this.error.confirmPassword = 'La confirmation du mot de passe est requise'
            } else {
                this.error.confirmPassword = null
            }
        },

        // Méthode pour effectuer l'inscription
        async register() {
            // Si toutes les validations sont passées, envoi des données au serveur
            if (
                !this.error.email ||
                !this.error.username ||
                !this.error.password ||
                !this.error.confirmPassword
            ) {
                try {
                    // Appel à l'API pour l'inscription
                    const response = await axios.post(URL_API + '/auth/signup', {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        confirmPassword: this.confirmPassword,
                    })

                    // Redirection vers la page de connexion en cas de succès
                    if (response.status === 200) {
                        this.$router.push('/login')
                    }
                } catch (error) {
                    console.error('Une erreur est survenue lors de l\'inscription :', error)
                }
            }
        },
    },
}
</script>

<style scoped>
/* Ajoutez vos styles spécifiques au composant ici */
</style>
