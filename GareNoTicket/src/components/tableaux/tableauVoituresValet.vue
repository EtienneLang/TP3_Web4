<template>
    <div>
        <table class="table table-bordered table-hover">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">Marque</th>
                    <th scope="col">Modèle</th>
                    <th scope="col">Plaque</th>
                    <th scope="col">Couleur</th>
                    <th scope="col">Temps restant</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in usersRelatedToValet" :key="user._id">
                    <td>{{ user.username }}</td>
                    <td>{{ user.voiture.marque }}</td>
                    <td>{{ user.voiture.modele }}</td>
                    <td>{{ user.voiture.plaque }}</td>
                    <td>{{ user.voiture.couleur }}</td>
                    <td>{{ user.voiture.timeToLeave }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
import L from 'leaflet'
import redPin from '../../img/pin.png'
import carPin from '../../img/car.png'

export default {
    props: {
        user: {
            type: Object,
            required: true,
        },
        map: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            usersRelatedToValet: [],
            intervalId: null,
        }
    },
    async mounted() {
        this.intervalId = setInterval(this.decreaseTimeToLeave, 1000)
        try {
            const users = await axios.get('http://localhost:3000/users')
            console.log(users.data.users)
            for (const user of users.data.users) {
                if (user.voiture.valet === this.user._id) {
                    let maintenant = new Date()
                    const debutDuJour = new Date(
                        maintenant.getFullYear(),
                        maintenant.getMonth(),
                        maintenant.getDate(),
                    )
                    const secondesDepuisDebutJour = Math.floor((maintenant - debutDuJour) / 1000)
                    user.voiture.timeToLeave = user.voiture.timeToLeave - secondesDepuisDebutJour
                    this.usersRelatedToValet.push(user)
                    var marker = L.marker([user.voiture.latitude, user.voiture.longitude], {
                        draggable: 'true',
                        icon: L.icon({
                            iconUrl: carPin,
                            iconSize: [41, 41],
                            iconAnchor: [20.5, 41],
                            popupAnchor: [1, -34],
                        }),
                    }).addTo(this.map)
                    marker
                        .bindPopup(
                            '<b>' +
                                user.username +
                                '</b><br>' +
                                user.voiture.marque +
                                user.voiture.modele +
                                '<br>' +
                                user.voiture.couleur +
                                '<br>' +
                                user.voiture.plaque,
                        )
                        .openPopup()
                }
            }
        } catch (error) {
            console.log(error)
        }
    },
    beforeDestroy() {
        clearInterval(this.intervalId)
    },
    methods: {
        decreaseTimeToLeave() {
            this.usersRelatedToValet.forEach((user) => {
                if (user.voiture.timeToLeave > 0) {
                    user.voiture.timeToLeave =
                        user.voiture.timeToLeave  - 1
                }
            })
        },
    },
}
</script>

<style>
/* Add any custom styles for the table here */
</style>
