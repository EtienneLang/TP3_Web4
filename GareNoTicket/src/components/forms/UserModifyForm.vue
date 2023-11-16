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
                required
            />
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input
                type="email"
                id="email"
                v-model="user.email"
                v-text="user.email"
                class="form-control"
                required
            />
        </div>
        <button type="submit" class="btn btn-primary mt-2">Modifier</button>
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
    methods: {
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
