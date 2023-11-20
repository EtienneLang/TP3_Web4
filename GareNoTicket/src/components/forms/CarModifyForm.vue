<template>
    <form @submit.prevent="submitForm" method="PUT" class="p-3 border rounded w-25 m-5">
        <div class="form-group">
            <label for="marque">Marque:</label>
            <input
                type="text"
                id="marque"
                v-model="user.voiture.marque"
                class="form-control"
                @blur="validerMarque"
                required
            />
            <div v-if="errors.marque" class="text-danger">{{ errors.marque }}</div>
        </div>
        <div class="form-group">
            <label for="modele">Modele:</label>
            <input
                type="text"
                id="modele"
                v-model="user.voiture.modele"
                class="form-control"
                @blur="validerModele"
                required
            />
            <div v-if="errors.modele" class="text-danger">{{ errors.modele }}</div>
        </div>
        <div class="form-group">
            <label for="couleur">Couleur:</label>
            <input
                type="text"
                id="couleur"
                v-model="user.voiture.couleur"
                class="form-control"
                @blur="validerCouleur"
                required
            />
            <div v-if="errors.couleur" class="text-danger">{{ errors.couleur }}</div>
        </div>
        <div class="form-group">
            <label for="plaque">Plaque:</label>
            <input
                type="text"
                id="plaque"
                v-model="user.voiture.plaque"
                class="form-control"
                @blur="validerPlaque"
                required
            />
            <div v-if="errors.plaque" class="text-danger">{{ errors.plaque }}</div>
        </div>

        <button :disabled="errors.couleur || errors.marque || errors.modele || errors.plaque" type="submit" class="btn btn-primary mt-2">Modifier</button>
         
    </form>
</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
export default {
    name: 'CarModifyForm',
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            errors: {
                marque: null,
                modele: null,
                couleur: null,
                plaque: null,
            },
        }
    },
    created() {
        //Si l'utilisateur n'a pas de voiture, on lui en crée une vide pour que le formulaire
        //de modification de voiture fonctionne
        if (!this.user.voiture) {
            this.user.voiture = {
                marque: '',
                modele: '',
                couleur: '',
                plaque: '',
            }
        }
    },
    methods: {
        //Fonction de validation de la marque
        validerMarque() {
            if (this.user.voiture.marque.length < 1) {
                this.errors.marque = 'La marque doit contenir au moins 1 caractères'
            } else if (this.user.voiture.marque.length > 50) {
                this.errors.marque = 'La marque doit contenir au plus 50 caractères'
            } else if (this.user.voiture.marque.length == 0) {
                this.errors.marque = 'La marque ne peut pas être vide'
            } else {
                this.errors.marque = null
            }
        },
        //Fonction de validation du modele
        validerModele() {
            if (this.user.voiture.modele.length < 1) {
                this.errors.modele = 'Le modele doit contenir au moins 1 caractères'
            } else if (this.user.voiture.modele.length > 50) {
                this.errors.modele = 'Le modele doit contenir au plus 50 caractères'
            } else if (this.user.voiture.modele.length == 0) {
                this.errors.modele = 'Le modele ne peut pas être vide'
            } else {
                this.errors.modele = null
            }
        },
        //Fonction de validation de la couleur
        validerCouleur() {
            if (this.user.voiture.couleur.length < 3) {
                this.errors.couleur = 'La couleur doit contenir au moins 3 caractères'
            } else if (this.user.voiture.couleur.length > 50) {
                this.errors.couleur = 'La couleur doit contenir au plus 50 caractères'
            } else if (this.user.voiture.couleur.length == 0) {
                this.errors.couleur = 'La couleur ne peut pas être vide'
            } else {
                this.errors.couleur = null
            }
        },
        //Fonction de validation de la plaque
        validerPlaque() {
            if (this.user.voiture.plaque.length !== 6) {
                this.errors.plaque = 'La plaque doit contenir 6 caractères'
            } else {
                this.errors.plaque = null
            }
        },
        async submitForm() {
            const JWT = Cookies.get('token')
            try {
                //On envoie les données de la voiture à l'API
                const response = await axios.put(
                    'http://localhost:3000/car/' + this.user._id,
                    {
                        marque: this.user.voiture.marque,
                        modele: this.user.voiture.modele,
                        couleur: this.user.voiture.couleur,
                        plaque: this.user.voiture.plaque,
                        isParked: false,
                         
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
