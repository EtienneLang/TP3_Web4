<template>
    <div class="d-flex flex-column justify-content-center align-items-center">
        <h2 class="p-2">Carte - <i>Ma place</i></h2>
        <img v-if="!map" src="../img/loading.gif" />
        <div id="map"></div>
        <div class="d-flex">
            <button
                v-if="!user.isValet"
                :disabled="isMoving || isParked"
                class="btn btn-primary p-2 m-4"
                @click="confirmPopUp"
            >
                Je laisse ma voiture
            </button>
            <button
                v-if="!user.isValet"
                :disabled="isMoving || !isParked"
                class="btn btn-primary p-2 m-4"
                @click="recupereVoiture"
            >
                J'ai récupéré ma voiture
            </button>
            <img
                v-if="isParked"
                class="img-center m-4"
                src="../img/map.png"
                alt=""
                @click="centerVehiculeMap"
            />
        </div>
        <p v-if="!user.isValet && isMoving">
            Vous voiture est en cours de déplacement, veuillez réessayer ultérieurement.
        </p>

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
                <div class="btn btn-success m-2" @click="ConfirmPosition(user._id)">
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
import { URL_API } from '../../const'
import { useToast } from 'vue-toastification'

export default {
    components: { TableauVoituresValet },
    data() {
        return {
            confirmationPopUp: false,
            latlng: {
                lat: 0,
                lng: 0,
            },
            user: {},
            map: null,
            isParked: false,
            isMoving: false,
            position: {},
        }
    },
    async created() {
        //On récupère la position de l'utilisateur
        this.position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
        })
    },
    async mounted() {
        const JWT = Cookies.get('token')
        if (JWT) {
            try {
                const response = await axios.get(URL_API + '/user', {
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                    },
                })
                const { user } = toRefs(response.data)
                this.user = user
                if (!this.user.isValet && this.user.voiture.isMoving) {
                    this.isMoving = true
                }
                if (!this.user.isValet && this.user.voiture.isParked) {
                    this.isParked = true
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }
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
         * Initialise le marqueur de l'utilisateur
         */
        async markerInit() {
            try {
                this.latlng.lat = this.position.coords.latitude
                this.latlng.lng = this.position.coords.longitude
                console.log(this.latlng)
                //Si l'utilisateur est stationné et n'est pas un valet, on affiche sa voiture et non sa position actuelle
                if (!this.user.isValet && this.isParked) {
                    this.latlng.lat = this.user.voiture.latitude
                    this.latlng.lng = this.user.voiture.longitude
                    var marker = L.marker([this.latlng.lat, this.latlng.lng], {
                        icon: L.icon({
                            iconUrl: carPin,
                            iconSize: [41, 41],
                            iconAnchor: [20.5, 41],
                            popupAnchor: [1, -34],
                        }),
                    }).addTo(this.map)
                    marker.bindPopup('<b>Votre voiture</b>')
                    this.map.panTo(marker.getLatLng())
                }
                // Sinon on affiche la position de l'utilisateur
                else {
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
                    marker.on({ dragend: this.onMarkerDragEnd })
                    this.map.panTo(marker.getLatLng())
                }
            } catch (error) {
                console.error(error)
            }
        },
        /**
         * Supprime tous les marqueurs de la carte avant de réinitialiser
         */
        beforeDestroy() {
            this.clearMap()
            this.map.remove()
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
            if (!this.isParked) {
                this.latlng = event.target.getLatLng()
                console.log(this.latlng)
            }
            // Update marker coordinates when dragged
        },
        /**
         * Fonction pour afficher le popup de confirmation
         */
        confirmPopUp() {
            console.log('confirmMove')
            this.confirmationPopUp = true
        },
        /**
         * Fonction pour faire disparaitre le popup de confirmation
         */
        AnnulerConfirmation() {
            console.log('AnnulerConfirmation')
            this.confirmationPopUp = false
        },
        /**
         * Fonction pour récuperer la voiture
         */
        async recupereVoiture() {
            const JWT = Cookies.get('token')
            console.log('recupereVoiture', this.user._id)
            try {
                //On envoie les données de la voiture à l'API
                const response = await axios.put(
                    'https://api-garenoticket-1z1gosa7x-etiennelanglois-projects.vercel.app/car/' +
                        this.user._id,
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
                    this.clearMap()
                    this.isParked = false
                    await this.markerInit()
                    useToast().success('Vous avez récupéré votre voiture')
                }
            } catch (error) {
                useToast().error('Erreur lors de la récupération de la voiture')
            }
        },
        /**
         * Fonction pour confirmer la position de la voiture
         */
        async ConfirmPosition(userId) {
            this.confirmationPopUp = false
            const JWT = Cookies.get('token')
            try {
                let tempsAQuitter = this.determinerTempsRestant()
                console.log(tempsAQuitter)
                //On envoie les données de la voiture à l'API
                const response = await axios.put(
                    'https://api-garenoticket-1z1gosa7x-etiennelanglois-projects.vercel.app/car/' +
                        userId,
                    {
                        latitude: this.latlng.lat,
                        longitude: this.latlng.lng,
                        isParked: true,
                        timeToLeave: tempsAQuitter,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${JWT}`,
                        },
                    },
                )
                if (response.status === 200) {
                    this.isParked = true
                    this.clearMap()
                    var marker = L.marker([this.latlng.lat, this.latlng.lng], {
                        icon: L.icon({
                            iconUrl: carPin,
                            iconSize: [41, 41],
                            iconAnchor: [20.5, 41],
                            popupAnchor: [1, -34],
                        }),
                    }).addTo(this.map)
                    marker.bindPopup('<b>Votre voiture</b>')
                    this.map.panTo(marker.getLatLng())
                    useToast().success('Votre voiture à bien été stationnée')
                }
            } catch (error) {
                console.error(error)
                useToast().error('Erreur lors de la confirmation')
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
        centerVehiculeMap() {
            this.map.setView(new L.LatLng(this.latlng.lat, this.latlng.lng), 17)
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
.img-center {
    width: 50px;
    height: 50px;
}
.img-center:hover {
    cursor: pointer;
    background-color: lightgray;
    border-radius: 5%;
}
</style>
