<script>
import axios from 'axios'
import {API} from '../util'
/**
 * Componente para mostrar una reseña individual.
 *
 * @vue-data {Object} result - Los datos de la reseña obtenidos de la API.
 * @vue-data {Boolean} submenu - Indica si el submenú está abierto o cerrado.
 * @vue-data {Boolean} showSubmenu - Indica si el submenú debe mostrarse o no.
 * @vue-data {String} pathUpdate - La ruta para actualizar la reseña.
 * @vue-data {String} API_REVIEW - La URL para obtener los datos de la reseña.
 * @vue-data {String} API_DELETE - La URL para eliminar la reseña.
 * @vue-event callAPI - Llama a la API del servidor para encontrar la reseña del videojuego que incluyan la busqueda
 * @vue-event {void} listenSubmenu - Cambia el estado de submenu a su estado opuesto
 * @vue-event {void} checkUser - Busca la existencia del usuario que concuerde con la id de usuario en el servidor
 * @vue-event {void} checkPath - Comprueba el path en el que esta el usuario para enviarlo a un path diferente
 * @vue-event {void} deleteReview - Manda a eliminar la review del usuario por el id
 */
export default {
  data() {
    return {
      result: null,
      submenu: false,
      showSubmenu: false,
      pathUpdate: "/perfil/actualizar-review/",
      API_REVIEW: API + "/api/v1/reviews/" + this.$route.params.id,
      API_DELETE: API + "/api/v1/auth/reviews/" + this.$route.params.id
    }
  },
  mounted() {
    this.callAPI(),
      this.checkRoute()
  },
  methods: {
    async callAPI() {
      const response = await fetch(this.API_REVIEW)
      const data = await response.json()
      this.result = data
      this.checkUser()
    },
    listenSubmenu() {
      this.submenu = !this.submenu
    },
    checkUser() {
      localStorage.getItem("userId") === this.result.user ? this.showSubmenu = true : this.showSubmenu = false
      this.pathUpdate += this.result.id
    },
    checkRoute() {
      const currentPath = this.$route.path
      if (currentPath.includes('/perfil')) {
        this.pathUpdate= "/perfil/actualizar-review/"
      } else {
        this.pathUpdate= "/actualizar-review/"
      }
    },
    deleteReview() {
      axios.delete(this.API_DELETE, { withCredentials: true })
        .then(() => {
          const currentPath = this.$route.path

          if (currentPath.includes('/perfil')) {
            this.$router.push('/perfil/reviews')
          } else {
            this.$router.push('/')
          }
        })
        .catch(error => {
          alert("Hubo un error inesperado")
        });
    }
  }
}
</script>

<template>
  <main v-if="result" class="main main--header">
    <header class="main__header main__header--review">
      <h2 class="main__header__title">{{ result.name }}</h2>
      <div class="main__header__background">
        <img className="main__header__background__img" :src="result.image" />
        <div className="main__header__background__opacity" />
      </div>
      <p class="main__header__score"
        :class="result.score < 2.5 ? 'main__header__score__red' : (result.score >= 2.5 && result.score < 3.5) ? 'main__header__score__yellow' : 'main__header__score__green'">
        {{ result.score }}</p>
      <p class="main__header__date">Creado por {{ result.username }} el {{ result.created_at.split('-').reverse().join('-')
      }}</p>
      <span class="main__header__menu material-symbols-outlined" @click="listenSubmenu"
        v-if="showSubmenu">more_vert</span>

      <nav class="main__header__submenu" v-if="submenu" v-click-away="listenSubmenu">
        <ul class="main__header__submenu__list">
          <li class="main__header__submenu__list__item">
            <RouterLink :to="pathUpdate">EDITAR</RouterLink>
          </li>
          <li class="main__header__submenu__list__item">
            <a href="#" @click="deleteReview">ELIMINAR</a>
          </li>
        </ul>
      </nav>
    </header>
    <section class="main__review">
      <h3 class="main__review__title">{{ result.title }}</h3>
      <p class="main__review__description">{{ result.message }}</p>
    </section>
  </main>
</template>