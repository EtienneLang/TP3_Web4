<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Create Account</div>
                    <div class="card-body">
                        <form @submit.prevent="register" method="post">
                            <div class="mb-3">
                                <label for="username" class="form-label">Name</label>
                                <input
                                    v-model="username"
                                    type="text"
                                    class="form-control"
                                    id="username"
                                    required
                                    @blur="isUsernameValid = username.trim() !== ''"
                                />
                                <div v-if="!isUsernameValid" class="text-danger">
                                    Name is required.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input
                                    v-model="email"
                                    type="email"
                                    class="form-control"
                                    id="email"
                                    required
                                    @blur="isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)"
                                />
                                <div v-if="!isEmailValid" class="text-danger">
                                    Enter a valid email address.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input
                                    v-model="password"
                                    type="password"
                                    class="form-control"
                                    id="password"
                                    required
                                    @blur="isPasswordValid = password.trim() !== ''"
                                />
                                <div v-if="!isPasswordValid" class="text-danger">
                                    Password is required.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label"
                                    >Confirm Password</label
                                >
                                <input
                                    v-model="confirmPassword"
                                    type="password"
                                    class="form-control"
                                    id="confirmPassword"
                                    required
                                    @blur="isPasswordMatch = password === confirmPassword"
                                />
                                <div v-if="!isPasswordMatch" class="text-danger">
                                    Passwords do not match.
                                </div>
                            </div>
                            <button :disabled="!isPasswordMatch || !isPasswordValid || !isEmailValid || !isUsernameValid" type="submit" class="btn btn-primary">Create Account</button>
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
export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            isUsernameValid: true,
            isEmailValid: true,
            isPasswordValid: true,
            isPasswordMatch: true,
        }
    },
    methods: {
        async register() {
            console.log(
                    'Registering with:',
                    this.username,
                    this.email,
                    this.password,
                    this.passwordConfirm,)
            //Si tout est bon, on envoie les données au serveur
            if (
                this.isUsernameValid ||
                this.isEmailValid ||
                this.isPasswordValid ||
                this.isPasswordMatch
            ) {
                try {
                    const response = await axios.post('http://localhost:3000/auth/signup', {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        confirmPassword: this.confirmPassword,
                    })

                    if (response.status === 200) {
                        // Successful login, handle the response as needed
                        const data = await response.json()
                        console.log('Login successful:', data)
                        Cookies.set('token', data.token, { expires: 1 })
                    } 
                } catch (error) {
                    console.error('An error occurred during login:', error)
                }
                console.log(
                    'Registering with:',
                    this.username,
                    this.email,
                    this.password,
                    this.confirmPassword,
                )
            }
        },
    },
}
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
