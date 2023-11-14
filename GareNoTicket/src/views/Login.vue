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

export default {
    data() {
        return {
            email: '',
            password: '',
        }
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('http://localhost:3000/auth/login', {
                    email: this.email,
                    password: this.password,
                })
                if (response.status === 200) {
                    Cookies.set('token', response.data.token, { expires: 1 })
                    this.$router.push('/')
                }
            } catch (error) {
                console.error(error)
            }
        },
    },
}
</script>
