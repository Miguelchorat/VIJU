import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import ProfileReviewView from '../views/ProfileReviewView.vue'
import ReviewView from '../views/ReviewView.vue'
import CreateReviewView from '../views/CreateReviewView.vue'
import UpdateReviewView from '../views/UpdateReviewView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/perfil',
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
    }
  ]
})

export default router
