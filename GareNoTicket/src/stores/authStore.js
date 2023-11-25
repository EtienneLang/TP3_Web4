import { defineStore } from 'pinia'
import jwt_decode from 'jwt-decode'

export const useAuthStore = defineStore({
  id: 'AuthStore',
  state: () => ({ 
    token: null,
  }),
  getters: {
    isAuthenticated(state) {
      // vérifie si le token existe et n'est pas expiré
      if (state.token) {
        const decoded = jwt_decode(state.token)
        const now = Date.now() / 1000
        if (decoded.exp < now) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    },
  },
  actions: { 
    // login avec courriel et mot de passe
    async login(login, password) {
        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                email: this.email,
                password: this.password,
            })
            if (response.status === 200) {
                Cookies.set('token', response.data.token, { expires: 1 })
                this.$router.push('/')
            }
        } catch (error) {
            console.error(error)
        }
    },
    logout() {
      // On supprime le token du store
      this.token = null
    },
  },
})