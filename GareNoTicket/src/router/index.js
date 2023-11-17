import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'
import SignUpView from '../views/SignUp.vue'
import ProfilView from '../views/Profil.vue'
import MaplaceView from '../views/MaPlace.vue'
import UserModifyView from '../components/forms/UserModifyForm.vue'
import CarModifyView from '../components/forms/CarModifyForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/profil',
      name: 'profil',
      component: ProfilView,
      children: [
        {
          path: 'user_modify',
          component: UserModifyView
        },
        {
          path: 'car_modify',
          component: CarModifyView
        }
      ]
    },
    {
      path: '/maplace',
      name: 'maplace',
      component: MaplaceView,
    }
  ]
})

export default router
