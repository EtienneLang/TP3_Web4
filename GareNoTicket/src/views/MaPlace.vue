<template>
    <!-- Alert de succès -->
    <div v-if="successAlert" class="alert alert-success alert-dismissible fade show" role="alert">
        L'action a été effectuée avec succès !
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            @click="hideSuccessAlert"
        ></button>
    </div>
    <div class="d-flex flex-column justify-content-center align-items-center">
        <h2 class="p-2">Carte - <i>Ma place</i></h2>
        <div id="map"></div>
        <div class="d-flex">
            <div v-if="!isParked && !user.isValet" class="button" @click="confirmPopUp">
                Je laisse ma voiture
            </div>
            <div v-if="isParked && !user.isValet" class="button" @click="recupereVoiture">
                J'ai récupéré ma voiture
            </div>
        </div>

        <!-- Carte de confirmation du stationnement -->
        <div v-if="confirmationPopUp" class="card w-50 mb-5">
            <div class="card-header">
                <h3>Confirmation</h3>
            </div>
            <div class="card-body">
                <p>
                    Veuillez vérifier que votre voiture est bien stationnée à l'endroit indiqué sur
                    la carte, ou déplacer le marqueur sur la position de votre voiture.
                </p>
            </div>
            <div class="card-footer">
                <div
                    class="btn btn-success m-2"
                    @click="ConfirmPosition(user._id, latlng.lat, latlng.lng, map)"
                >
                    Je confirme
                </div>
                <div class="btn btn-danger m-2" @click="AnnulerConfirmation">Annuler</div>
            </div>
        </div>
        <TableauVoituresValet :map="map" :user="user" v-if="user.isValet" class="w-75 m-5" />
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
import TableauVoituresValet from '../components/tableaux/tableauVoituresValet.vue'
import { ConfirmPosition, showSuccessAlert } from '../utils.js'
export default {
    components: { TableauVoituresValet },
    data() {
        return {
            confirmationPopUp: false,
            latlng: null,
            user: {},
            map: null,
            isParked: false,
            successAlert: false,
        }
    },
    async mounted() {
        const JWT = Cookies.get('token')
        console.log(JWT)
        if (JWT) {
            try {
                const response = await axios.get('http://localhost:3000/user', {
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                    },
                })
                const { user } = toRefs(response.data)
                this.user = user
                if (!this.user.isValet && this.user.voiture.isParked) {
                    this.isParked = true
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }
        this.mapInit()
        this.markerInit()
    },
    methods: {
        /**
         * Initialise la carte
         */
        async mapInit() {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                })
                let latitude = position.coords.latitude
                let longitude = position.coords.longitude
                this.map = L.map('map').setView([latitude, longitude], 13)
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
         * Initialise le marqueur de l'utilisateur
         */
        async markerInit() {
            try {
                //On récupère la position de l'utilisateur
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                })
                let latitude = position.coords.latitude
                let longitude = position.coords.longitude
                //Si l'utilisateur est stationné et n'est pas un valet, on affiche sa voiture et non sa position actuelle
                if (!this.user.isValet && this.user.voiture.isParked) {
                    console.log('Je suis parké')
                    latitude = this.user.voiture.latitude
                    longitude = this.user.voiture.longitude
                    var marker = L.marker([latitude, longitude], {
                        icon: L.icon({
                            iconUrl: carPin,
                            iconSize: [41, 41],
                            iconAnchor: [20.5, 41],
                            popupAnchor: [1, -34],
                        }),
                    }).addTo(this.map)
                    marker.bindPopup('<b>Votre voiture</b>').openPopup()
                    this.map.panTo(marker.getLatLng())
                }
                // Sinon on affiche la position de l'utilisateur
                else {
                    var marker = L.marker([latitude, longitude], {
                        draggable: 'true',
                        icon: L.icon({
                            iconUrl: redPin,
                            iconSize: [41, 41],
                            iconAnchor: [20.5, 41],
                            popupAnchor: [1, -34],
                        }),
                    }).addTo(this.map)
                    marker.bindPopup('<b>Votre position.</b>').openPopup()
                    marker.on({ dragend: this.onMarkerDragEnd })
                    this.map.panTo(marker.getLatLng())
                }
            } catch (error) {
                console.error(error)
            }
        },
        /**
         * Fonction appelée lorsqu'on déplace le marqueur
         * @param {*} event
         */
        onMarkerDragEnd(event) {
            console.log('onMarkerDragEnd')
            if (!this.user.voiture.isParked) {
                this.latlng = event.target.getLatLng()
            }
            // Update marker coordinates when dragged
        },
        /**
         * Fonction pour afficher l'alerte de confirmation
         */
        confirmPopUp() {
            console.log('confirmMove')
            this.confirmationPopUp = true
        },
        /**
         * Fonction pour faire disparaitre l'alerte de confirmation
         */
        AnnulerConfirmation() {
            console.log('AnnulerConfirmation')
            this.confirmationPopUp = false
        },
        ConfirmPosition,
        /**
         * Fonction pour récuperer la voiture
         */
        async recupereVoiture() {
            const JWT = Cookies.get('token')
            console.log('recupereVoiture', this.user._id)
            try {
                //On envoie les données de la voiture à l'API
                const response = await axios.put(
                    'http://localhost:3000/car/' + this.user._id,
                    {
                        latitude: null,
                        longitude: null,
                        isParked: false,
                        timeToLeave: null,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${JWT}`,
                        },
                    },
                )
                if (response.status === 200) {
                    console.log(this.user.voiture.isParked)
                    this.clearMap()
                    this.user.voiture.isParked = false
                    this.markerInit()
                    //Cookies.set('token', response.data.token, { expires: 1 })
                    this.$router.push('/maplace')
                    this.isParked = false
                    showSuccessAlert
                }
            } catch (error) {
                console.error(error)
            }
        },
        showSuccessAlert,
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
