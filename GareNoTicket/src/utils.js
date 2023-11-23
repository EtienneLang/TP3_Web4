'use strict'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Cookies from 'js-cookie'
import axios from 'axios'
import redPin from './img/pin.png'
import carPin from './img/car.png'

export async function ConfirmPosition(userId, lat, lng, map) {
    this.confirmationPopUp = false
    const JWT = Cookies.get('token')
    try {
        let tempsAQuitter = determinerTempsRestant()
        //On envoie les données de la voiture à l'API
        const response = await axios.put(
            'http://localhost:3000/car/' + userId,
            {
                latitude: lat,
                longitude: lng,
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
            clearMap(map)
            var marker = L.marker([lat, lng], {
                icon: L.icon({
                    iconUrl: carPin,
                    iconSize: [41, 41],
                    iconAnchor: [20.5, 41],
                    popupAnchor: [1, -34],
                }),
            }).addTo(map)
            marker.bindPopup('<b>Votre voiture</b>').openPopup()
            //Cookies.set('token', response.data.token, { expires: 1 })
            map.panTo(marker.getLatLng())
            this.$router.push('/maplace')
            this.isParked = true
            showSuccessAlert()
        }
    } catch (error) {
        console.error(error)
    }
}
function clearMap(map) {
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer)
        }
    })
}
/**
 * Fonction pour faire apparaitre l'alerte de succès
 */
export function showSuccessAlert(vueInstance) {
    this.successAlert = true
    // Hide the alert after 5 seconds
    setTimeout(() => {
        this.successAlert = false
    }, 3000)
}
/**
 * Fonction pour determiner le temps du parking
 */
export function determinerTempsRestant() {
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
    if (secondesDepuisDebutJour >= onzeHeure && secondesDepuisDebutJour < treizeHeureTrente) {
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
}
