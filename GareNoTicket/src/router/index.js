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
            component: HomeView,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignUpView,
        },
        {
            path: '/profil',
            name: 'profil',
            component: ProfilView,
            children: [
                {
                    path: 'user_modify',
                    component: UserModifyView,
                },
                {
                    path: 'car_modify',
                    component: CarModifyView,
                },
            ],
        },
        {
            path: '/maplace',
            name: 'maplace',
            component: MaplaceView,
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
            component: NotFound,
        },
    ],
})

router.beforeEach(async (to, from, next) => {
    const publicPages = ['/login', '/signup', '/']
    const authRequired = !publicPages.includes(to.path)

    const token = Cookies.get('token')

    console.log('token', token)

    if (authRequired && !token) {
        return next('/login')
    }

    if (authRequired) {
        // Verify the JWT
        try {
            const decoded = jwtDecode(token)
            console.log(decoded)
            // Check the expiration date
            if (decoded.exp * 1000 < Date.now()) {
                // Token expired
                Cookies.remove('token')
                return next('/login')
            }

            // Token is valid
            next()
        } catch (error) {
            // Token is invalid
            return next('/login')
        }
    } else {
        next()
    }
})

export default router
