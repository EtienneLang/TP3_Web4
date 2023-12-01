<template>
    <Alert :alert="alert" />
    <form @submit.prevent="submitForm" method="PUT" class="p-3 border rounded w-25 m-5">
        <div class="form-group">
            <label for="username">Nom:</label>
            <input
                type="text"
                id="username"
                v-model.trim="user.username"
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
                v-model.trim="user.email"
                v-text="user.email"
                class="form-control"
                @blur="validerEmail"
                required
            />
        </div>
        <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
        <div v-if="user.isValet" class="form-group">
            <label for="tarif">Tarif:</label>
            <input
                type="text"
                id="tarif"
                v-model.trim="user.price"
                v-text="user.price"
                class="form-control"
                @blur="validerTarif"
                required
            />
        </div>
        <div v-if="errors.tarif" class="text-danger">{{ errors.tarif }}</div>
        <button :disabled="errors.email || errors.username || errors.tarif" type="submit" class="btn btn-primary mt-2">Modifier</button>
    </form>
</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
import Alert from '../alert.vue'
import {URL_API} from '../../../const'

export default {
    name: "UserModifyForm",
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    components: { Alert },
    data() {
        return {
            errors: {
                email: null,
                username: null,
                tarif: null,
            },
            alert: null,
        };
    },
    methods: {
        validerEmail() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.user.email)) {
                this.errors.email = "Veuillez entrer une adresse email valide";
            }
            else {
                this.errors.email = null;
            }
        },
        validerUsername() {
            if (this.user.username.length < 3) {
                this.errors.username = "Le nom doit contenir au plus 3 caractères";
            }
            else if (this.user.username.length > 50) {
                this.errors.username = "Le nom doit contenir au moins 50 caractères";
            }
            else {
                this.errors.username = null;
            }
        },
        validerTarif() {
            if (this.user.price < 0) {
                this.errors.tarif = "Le tarif doit être positif";
            }
            else {
                this.errors.tarif = null;
            }
        },
        async submitForm() {
            const JWT = Cookies.get("token");
            try {
                const response = await axios.put(URL_API+"/user/" + this.user._id, {
                    username: this.user.username,
                    email: this.user.email,
                    price: this.user.price,
                }, {
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                    },
                });
                if (response.status === 200) {
                    console.log("User modified");
                    this.showAlert("success");
                }
            }
            catch (error) {
                console.error(error);
                this.showAlert("error");
            }
        },
        showAlert(text) {
            this.alert = text
            // Cache l'alerte après 3 secondes
            setTimeout(() => {
                this.alert = null
            }, 3000)
        },
    },
}
</script>
