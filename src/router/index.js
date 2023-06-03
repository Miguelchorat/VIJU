import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
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
      component: HomeView
    },
    {
      path: '/ultimo-dia',
      name: 'last-day',
      component: HomeView
    },
    {
      path: '/ultima-semana',
      name: 'last-week',
      component: HomeView
    },
    {
      path: '/ultimo-mes',
      name: 'last-month',
      component: HomeView
    },
    {
      path: '/perfil/:username',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/actualizar-review/:id',
      name: 'update-review',
      component: UpdateReviewView,
      meta: { requiresAuth: true }
    },
    {
      path: '/crear-review',
      name: 'create-review',
      component: CreateReviewView,
      meta: { requiresAuth: true }
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

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('tokenjwt') != null;
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next('/sesion');
    } else {
      next();
    }
  } else {
    if (isLoggedIn && to.path == '/sesion') {
      next('/');
    }
    else {
      next();
    }    
  }
});

export default router
