import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'
import SignUpView from '../views/SignUp.vue'
import ProfilView from '../views/Profil.vue'
import MaplaceView from '../views/MaPlace.vue'
import UserModifyView from '../components/forms/UserModifyForm.vue'
import CarModifyView from '../components/forms/CarModifyForm.vue'
import NotFound from '../views/NotFound.vue'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/Home.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../views/SignUp.vue'),
        },
        {
            path: '/profil',
            name: 'profil',
            component: () => import('../views/Profil.vue'),
            children: [
                {
                    path: 'user_modify',
                    component: () => import('../components/forms/UserModifyForm.vue'),
                },
                {
                    path: 'car_modify',
                    component: () => import('../components/forms/CarModifyForm.vue'),
                },
            ],
        },
        {
            path: '/maplace',
            name: 'maplace',
            component: () => import('../views/MaPlace.vue'),
        },
        {
            path: '/bougerVoiture/:userId',
            name: 'bougerVoiture',
            component: () => import('../views/BougerVoiture.vue'),
        },
        {
            path: '/transaction',
            name: 'transaction',
            component: () => import('../views/Transaction.vue'),
        },
        {
            path: '/:notFound(.*)',
            component: () => import('../views/NotFound.vue'),
        },
    ],
})

router.beforeEach(async (to, from, next) => {
    const publicPages = ['/login', '/signup', '/']
    const authRequired = !publicPages.includes(to.path)

    const token = Cookies.get('token')
    if (authRequired && !token) {
        return next('/login')
    }

    if (authRequired) {
        try {
            const decoded = jwtDecode(token)
            console.log(decoded)
            if (decoded.exp * 1000 < Date.now()) {
                // Token expired
                Cookies.remove('token')
                return next('/login')
            }
            next()
        } catch (error) {
            return next('/login')
        }
    } else {
        next()
    }
})

export default router
