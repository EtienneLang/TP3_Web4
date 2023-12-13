<template>
    <div class="d-flex flex-column justify-content-center align-items-center">
        <h2 class="p-2">Carte - <i>Bouger une voiture </i></h2>
        <img v-if="!map" src="../img/loading.gif" />
        <div id="map"></div>
        <div v-if="map">
            <div class="d-flex">
                <button
                    :disabled="isMoving"
                    class="btn btn-primary p-2 m-4"
                    @click="deplacerVoiture"
                >
                    Je déplace la voiture
                </button>
                <button
                    :disabled="!isMoving"
                    class="btn btn-primary p-2 m-4"
                    @click="ValiderDeplacement"
                >
                    Validation du stationnement
                </button>
            </div>
        </div>
    </div>
</template>

<script>
// Import des bibliothèques nécessaires
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Cookies from 'js-cookie'
import axios from 'axios'
import { toRefs } from 'vue'
import redPin from '../img/pin.png'
import carPin from '../img/car.png'
import Alert from '../components/alert.vue'
import { URL_API } from '../../const'
import { useToast } from 'vue-toastification'

export default {
    components: { Alert },

    data() {
        return {
            // Données pour la position sur la carte et l'état de l'utilisateur
            latlng: {
                lat: 0,
                lng: 0,
            },
            loggeduser: null,
            user: null,
            map: null,
            isMoving: false,
            position: {},
        }
    },
    async created() {
        // Récupération de la position actuelle de l'utilisateur
        this.position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        this.latlng.lat = this.position.coords.latitude
        this.latlng.lng = this.position.coords.longitude
    },
    async mounted() {
        // Récupération de l'ID de l'utilisateur depuis les paramètres de l'URL
        const userId = this.$route.params.userId
        const JWT = Cookies.get('token')

        // Vérification de l'existence du jeton JWT
        if (JWT) {
            try {
                // Récupération des données de l'utilisateur connecté
                const response = await axios.get(URL_API + '/user', {
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                    },
                })
                this.loggeduser = response.data.user
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur :', error)
            }
        }

        try {
            // Récupération des données de l'utilisateur spécifié
            const response = await axios.get(URL_API + '/user/' + userId)
            const { user } = toRefs(response.data)
            this.user = user
        } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur :', error)
        }

        this.isMoving = this.user.voiture.isMoving

        // Initialisation de la carte et des marqueurs
        await this.mapInit()
        await this.markerInit()
    },
    methods: {
        /**
         * Initialise la carte
         */
        async mapInit() {
            try {
                // Récupération des coordonnées de la position actuelle de l'utilisateur
                let latitude = this.position.coords.latitude
                let longitude = this.position.coords.longitude

                // Création de la carte Leaflet
                this.map = L.map('map', { _zoomAnimation: false }).setView(
                    [latitude, longitude],
                    13,
                )

                // Ajout d'une couche de tuiles OpenStreetMap à la carte
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution:
                        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }).addTo(this.map)
            } catch (error) {
                console.error(error)
            }
        },

        /**
         * Initialise le marqueur du valet et de l'utilisateur
         */
        async markerInit() {
            try {
                // Affichage du marqueur de la position de l'utilisateur
                var marker = L.marker([this.latlng.lat, this.latlng.lng], {
                    draggable: 'true',
                    icon: L.icon({
                        iconUrl: redPin,
                        iconSize: [41, 41],
                        iconAnchor: [20.5, 41],
                        popupAnchor: [1, -34],
                    }),
                }).addTo(this.map)
                marker.bindPopup('<b>Votre position.</b>')

                // Affichage du marqueur de la position de la voiture de l'utilisateur
                var carMarker = L.marker(
                    [this.user.voiture.latitude, this.user.voiture.longitude],
                    {
                        draggable: 'true',
                        icon: L.icon({
                            iconUrl: carPin,
                            iconSize: [41, 41],
                            iconAnchor: [20.5, 41],
                            popupAnchor: [1, -34],
                        }),
                    },
                ).addTo(this.map)
                carMarker.bindPopup('<b>Voiture de ' + this.user.username + '</b>')
                carMarker.on({ dragend: this.onMarkerDragEnd })
            } catch (error) {
                console.error(error)
            }
        },

        /**
         * Supprime tous les marqueurs de la carte
         */
        clearMap() {
            this.map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    this.map.removeLayer(layer)
                }
            })
        },

        /**
         * Fonction appelée lorsqu'on déplace le marqueur
         * @param {*} event
         */
        onMarkerDragEnd(event) {
            console.log('Marqueur déplacé')
            this.latlng = event.target.getLatLng()
        },

        /**
         * Fonction pour déplacer la voiture
         */
        async deplacerVoiture() {
            const JWT = Cookies.get('token')
            try {
                // Appel à l'API pour déplacer la voiture et mise à jour de l'état local
                const response = await axios.put(
                    URL_API + '/car/' + this.user._id,
                    {
                        isMoving: true,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${JWT}`,
                        },
                    },
                )
                if (response.status === 200) {
                    useToast().success('Vous déplacez la voiture')
                    this.isMoving = true
                    this.user.voiture.isMoving = true
                    this.user.voiture.isParked = true
                }
            } catch (error) {
                useToast().error('Erreur lors du déplacement de la voiture')
                console.error(error)
            }
        },

        /**
         * Fonction pour confirmer la position de la voiture
         */
        async ValiderDeplacement() {
            const JWT = Cookies.get('token')
            try {
                // Détermination du temps restant avant le prochain déplacement
                let tempsAQuitter = this.determinerTempsRestant()

                // Envoi des données de la voiture à l'API et ajout d'un historique
                const response = await axios.put(
                    URL_API + '/car/' + this.user._id,
                    {
                        latitude: this.latlng.lat,
                        longitude: this.latlng.lng,
                        isMoving: false,
                        timeToLeave: tempsAQuitter,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${JWT}`,
                        },
                    },
                )
                const response2 = await axios.post(
                    URL_API + '/addHistorique',
                    {
                        price: this.loggeduser.price,
                        userId: this.user._id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${JWT}`,
                        },
                    },
                )

                // Vérification des réponses des requêtes
                if (response.status === 200 && response2.status === 201) {
                    useToast().success('Voiture déplacée avec succès')
                    this.isMoving = false
                }
            } catch (error) {
                useToast().error('Erreur lors du déplacement de la voiture')
                console.error(error)
            }
        },

        /**
         * Fonction pour déterminer le temps restant avant le prochain déplacement
         */
        determinerTempsRestant() {
            // Toutes les constantes sont en secondes
            const onzeHeure = 11 * 3600
            const treizeHeureTrente = 13 * 3600 + 30 * 60
            const seizeHeure = 16 * 3600
            const neufHeure = 9 * 3600
            const minuit = 24 * 3600
            let maintenant = new Date()
            const debutDuJour = new Date(
                maintenant.getFullYear(),
                maintenant.getMonth(),
                maintenant.getDate(),
            )
            // On récupère le nombre de secondes depuis le début du jour
            const secondesDepuisDebutJour = Math.floor((maintenant - debutDuJour) / 1000)

            let tempsAQuitter = 0
            // Si on est entre 11h et 13h30h
            if (
                secondesDepuisDebutJour >= onzeHeure &&
                secondesDepuisDebutJour < treizeHeureTrente
            ) {
                tempsAQuitter = treizeHeureTrente - secondesDepuisDebutJour
            }
            // Si on est entre 16h et minuit
            else if (secondesDepuisDebutJour >= seizeHeure && secondesDepuisDebutJour < minuit) {
                tempsAQuitter = minuit + neufHeure + 3600
            }
            // Si on est entre minuit et 9h
            else if (secondesDepuisDebutJour <= neufHeure && secondesDepuisDebutJour >= 0) {
                tempsAQuitter = neufHeure + 3600
            }
            // Si on est dans n'importe quel autre cas, on met 1h
            else {
                tempsAQuitter = 3600
            }
            return tempsAQuitter
        },
    },
}
</script>

<style>
#map {
    height: 600px;
    width: 1000px;
}
.button {
    background-color: #0d6efd;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 10px;
    margin: 10px;
}
.button:hover {
    background-color: #0a53c2;
}
</style>
