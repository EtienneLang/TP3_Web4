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
        this.position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        this.latlng.lat = this.position.coords.latitude
        this.latlng.lng = this.position.coords.longitude
    },
    async mounted() {
        const userId = this.$route.params.userId
        const JWT = Cookies.get('token')
        console.log(JWT)
        if (JWT) {
            try {
                const response = await axios.get(URL_API + '/user', {
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                    },
                })
                this.loggeduser = response.data.user
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }
        try {
            const response = await axios.get(URL_API + '/user/' + userId)
            const { user } = toRefs(response.data)
            this.user = user
            console.log(this.user)
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
        this.isMoving = this.user.voiture.isMoving
        await this.mapInit()
        await this.markerInit()
    },
    methods: {
        /**
         * Initialise la carte
         */
        async mapInit() {
            try {
                let latitude = this.position.coords.latitude
                let longitude = this.position.coords.longitude
                this.map = L.map('map', { _zoomAnimation: false }).setView(
                    [latitude, longitude],
                    13,
                )
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
                // On affiche la position du valet
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
                // marker.on({ dragend: this.onMarkerDragEnd })
                this.map.panTo(marker.getLatLng())
                var marker = L.marker([this.user.voiture.latitude, this.user.voiture.longitude], {
                    draggable: 'true',
                    icon: L.icon({
                        iconUrl: carPin,
                        iconSize: [41, 41],
                        iconAnchor: [20.5, 41],
                        popupAnchor: [1, -34],
                    }),
                }).addTo(this.map)
                marker.bindPopup('<b>Voiture de ' + this.user.username + '</b>')
                marker.on({ dragend: this.onMarkerDragEnd })
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
            console.log('onMarkerDragEnd')
            this.latlng = event.target.getLatLng()
            // Update marker coordinates when dragged
        },

        /**
         * Fonction pour récuperer la voiture
         */
        async deplacerVoiture() {
            try {
                const response = await axios.put(URL_API + '/car/' + this.user._id, {
                    isMoving: true,
                })
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
                let tempsAQuitter = this.determinerTempsRestant()
                //On envoie les données de la voiture à l'API
                const response = await axios.put(URL_API + '/car/' + this.user._id, {
                    latitude: this.latlng.lat,
                    longitude: this.latlng.lng,
                    isMoving: false,
                    timeToLeave: tempsAQuitter,
                })
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
                if (response.status === 200 && response2.status === 201) {
                    useToast().success('Voiture déplacée avec succès')
                    this.isMoving = false
                }
            } catch (error) {
                useToast().error('Erreur lors du déplacement de la voiture')
                console.error(error)
            }
        },
        determinerTempsRestant() {
            //Tout les constantes sont en secondes
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
            //On récupère le nombre de secondes depuis le début du jour
            const secondesDepuisDebutJour = Math.floor((maintenant - debutDuJour) / 1000)

            //let tempsRestant = 0
            let tempsAQuitte = 0
            //Si on est entre 11h et 13h30h
            if (
                secondesDepuisDebutJour >= onzeHeure &&
                secondesDepuisDebutJour < treizeHeureTrente
            ) {
                //tempsRestant = treizeHeureTrente - secondesDepuisDebutJour
                tempsAQuitte = treizeHeureTrente
            }
            //Si on est entre 16h et minuit
            else if (secondesDepuisDebutJour >= seizeHeure && secondesDepuisDebutJour < minuit) {
                //tempsRestant = 'demain'
                tempsAQuitte = minuit + neufHeure + 3600
            }
            //Si on est entre minuit et 9h
            else if (secondesDepuisDebutJour <= neufHeure && secondesDepuisDebutJour >= 0) {
                //tempsRestant = (neufHeure + 3600) - secondesDepuisDebutJour

                tempsAQuitte = neufHeure + 3600
            }
            //Si on est dans peut importe quel autre cas, on met 1h
            else {
                //tempsRestant = 3600
                tempsAQuitte = secondesDepuisDebutJour + 3600
            }
            return tempsAQuitte
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
