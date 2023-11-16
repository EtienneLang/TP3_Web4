<template>
    <div class="d-flex flex-column justify-content-center align-items-center">
        <h2 class="p-2">Carte - <i>Ma place</i></h2>
        <div id="map"></div>
    </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';

export default {
    data() {
        return {}
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
            marker.on('dragend', this.onMarkerDragEnd);

        }

        const error = (err) => {
            console.error(err)
        }
        navigator.geolocation.getCurrentPosition(success, error)
    },
    methods: {
        onMarkerDragEnd(event) {
            // Update marker coordinates when dragged
            console.log(event.target.getLatLng())
        },
    },
}
</script>

<style>
#map {
    height: 600px;
    width: 1000px;
}
</style>
