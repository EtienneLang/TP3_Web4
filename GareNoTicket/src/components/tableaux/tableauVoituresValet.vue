<template>
        <div>
          <table class="table  table-bordered table-hover">
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
                <td>{{ user.voiture.tempsRestant }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'

export default {
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            usersRelatedToValet: [],
        }
    },
    async mounted() {
        try {
            const users = await axios.get('http://localhost:3000/users')
            console.log(users.data.users)
            for (const user of users.data.users) {
                if (user.voiture.valet === this.user._id) {
                    this.usersRelatedToValet.push(user)
                }
            }
        } catch (error) {
            console.log(error)
        }
    },
}
</script>

<style>
/* Add any custom styles for the table here */
</style>
