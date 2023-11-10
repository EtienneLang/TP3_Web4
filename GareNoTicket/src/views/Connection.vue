
<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <label>
                Email:
                <input type="email" v-model="email" required>
            </label>
            <label>
                Password:
                <input type="password" v-model="password" required>
            </label>
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        login() {
            // Perform login logic here, e.g. send request to server
            console.log(`Logging in with email ${this.email} and password ${this.password}`);
        }
    }
}
</script>

<style>
/* Component styles go here */
</style>

