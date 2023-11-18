<template>
    <form @submit.prevent="submitForm" method="PUT" class="p-3 border rounded w-25 m-5">
        <div class="form-group">
            <label for="username">Nom:</label>
            <input
                type="text"
                id="username"
                v-model="user.username"
                v-text="user.username"
                class="form-control"
                @blur="validerUsername"
                required
            />
        </div>
        <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>

        <div class="form-group">
            <label for="email">Email:</label>
            <input
                type="email"
                id="email"
                v-model="user.email"
                v-text="user.email"
                class="form-control"
                @blur="validerEmail"
                required
            />
        </div>
        <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
        <button :disabled="errors.email || errors.username" type="submit" class="btn btn-primary mt-2">Modifier</button>
    </form>
</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
export default {
    name: 'UserModifyForm',
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            errors: {
                email: null,
                username: null,
            },
        }
    },
    methods: {
        validerEmail() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(this.user.email)) {
                this.errors.email = 'Veuillez entrer une adresse email valide'
            } else {
                this.errors.email = ''
            }
        },
        validerUsername() {
            if (this.user.username.length < 3) {
                this.errors.username = 'Le nom doit contenir au plus 3 caractères'
            } else if (this.user.username.length > 50) {
                this.errors.username = 'Le nom doit contenir au moins 50 caractères'
            } else {
                this.errors.username = ''
            }
        },
        async submitForm() {
            const JWT = Cookies.get('token')
            try {
                const response = await axios.put(
                    'http://localhost:3000/user/' + this.user._id,
                    {
                        username: this.user.username,
                        email: this.user.email,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${JWT}`,
                        },
                    },
                )
                if (response.status === 200) {
                    console.log('User modified')
                    //Cookies.set('token', response.data.token, { expires: 1 })
                    this.$router.push('/')
                }
            } catch (error) {
                console.error(error)
            }
        },
    },
}
</script>
