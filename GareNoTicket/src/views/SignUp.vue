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
                                />
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input
                                    v-model="email"
                                    type="email"
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
                            <div class="mb-3">
                                <label for="passwordConfirm" class="form-label"
                                    >Confirm Password</label
                                >
                                <input
                                    v-model="passwordConfirm"
                                    type="password"
                                    class="form-control"
                                    id="passwordConfirm"
                                    required
                                />
                            </div>
                            <button type="submit" class="btn btn-primary">Create Account</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
        }
    },
    methods: {
        async register() {
            try {
                const response = await fetch('http://localhost:3000/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        passwordConfirm : this.passwordConfirm,
                    }),
                })

                if (response.ok) {
                    // Successful login, handle the response as needed
                    const data = await response.json()
                    console.log('Login successful:', data)
                } else {
                    // Unsuccessful login, handle the error
                    console.error('Login failed:', response.statusText)
                }
            } catch (error) {
                console.error('An error occurred during login:', error)
            }
            console.log('Registering with:', this.name, this.email, this.password, this.passwordConfirm)
        },
    },
}
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
