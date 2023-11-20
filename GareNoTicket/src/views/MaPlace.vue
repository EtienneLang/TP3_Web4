<template>
    <div class="d-flex flex-column justify-content-center align-items-center">
        <h2 class="p-2">Carte - <i>Ma place</i></h2>
        <div id="map"></div>
        <div class="button" @click="confirmPopUp">Je laisse ma voiture</div>
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
                <div class="btn btn-success m-2" @click="ConfirmPosition">Je confirme</div>
                <div class="btn btn-danger m-2" @click="AnnulerConfirmation">Annuler</div>
            </div>
        </div>
    </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
    data() {
        return {
            confirmationPopUp: false,
            latlng: null,
        }
    },
    mounted() {
        const success = (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            var map = L.map('map').setView([latitude, longitude], 13)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map)
            var marker = L.marker([latitude, longitude], { draggable: 'true' }).addTo(map)
            marker.bindPopup('<b>Votre position.</b>').openPopup()
            marker.on('dragend', this.onMarkerDragEnd)
        }

        const error = (err) => {
            console.error(err)
        }

        navigator.geolocation.getCurrentPosition(success, error)
    },
    methods: {
        onMarkerDragEnd(event) {
            // Update marker coordinates when dragged
            this.latlng= event.target.getLatLng()
        },
        confirmPopUp() {
            console.log('confirmMove')
            this.confirmationPopUp = true
        },
        AnnulerConfirmation() {
            console.log('AnnulerConfirmation')
            this.confirmationPopUp = false
        },
        ConfirmPosition() {
            console.log(this.latlng)
            this.confirmationPopUp = false
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
