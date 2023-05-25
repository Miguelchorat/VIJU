import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import ProfileReviewView from '../views/ProfileReviewView.vue'
import ReviewView from '../views/ReviewView.vue'
import CreateReviewView from '../views/CreateReviewView.vue'
import SessionView from '../views/SessionView.vue'
import UpdateReviewView from '../views/UpdateReviewView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      key: 'home'
    },
    {
      path: '/ultimo-dia',
      name: 'last-day',
      component: HomeView,
      key: 'last-day'
    },
    {
      path: '/ultima-semana',
      name: 'last-week',
      component: HomeView,
      key: 'last-week'
    },
    {
      path: '/ultimo-mes',
      name: 'last-month',
      component: HomeView,
      key: 'last-month'
    },
    {
      path: '/perfil/:username',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/perfil/reviews',
      name: 'profile-reviews',
      component: ProfileReviewView
    },
    {
      path: '/perfil/review/:id',
      name: 'profile-review',
      component: ReviewView
    },
    {
      path: '/perfil/actualizar-review/:id',
      name: 'update-profile-review',
      component: UpdateReviewView
    },
    {
      path: '/actualizar-review/:id',
      name: 'update-review',
      component: UpdateReviewView
    },
    {
      path: '/crear-review',
      name: 'create-review',
      component: CreateReviewView
    },
    {
      path: '/review/:id',
      name: 'review',
      component: ReviewView
    },
    {
      path: '/sesion',
      name: 'session',
      component: SessionView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView
    }
  ]
})

export default router
