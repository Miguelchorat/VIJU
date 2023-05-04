<script>
import axios from 'axios'
import { API, formatDate } from '../util'
import { marked } from 'marked'


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
      API_DELETE: API + "/api/v1/auth/reviews/" + this.$route.params.id,
      content: ''
    }
  },
  mounted() {
    this.callAPI()
    this.checkRoute()
  },
  methods: {
    async callAPI() {
      const response = await fetch(this.API_REVIEW)
      const data = await response.json()
      this.result = data      
      this.content =  marked(this.result.message)
      this.result.created_at = formatDate(new Date(this.result.created_at)) 
      this.result.updated_at = formatDate(new Date(this.result.created_at)) 
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
        this.pathUpdate = "/perfil/actualizar-review/"
      } else {
        this.pathUpdate = "/actualizar-review/"
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
    },
    goBack() {
      this.$router.go(-1);
    },
  }
}
</script>

<template>
  <main v-if="result" class="main">
    <div class="container">
      <div class="main__breadcrumb"><a href="#" class="main__breadcrumb__link" @click="goBack">Reseñas</a>/<span
          class="main__breadcrumb__title">{{ result.title }}</span></div>
      <section class="main__section">
        <h2 class="main__section__title"><span class="main__section__title__text">Información</span></h2>
        <div class="main__section__article__group">
          <article class="main__section__article">
            <h3 class="main__section__article__title">INFORMACIÓN RESEÑA</h3>
            <div class="main__section__article__label">
              <p class="main__section__article__label__text">Autor</p>
              <p class="main__section__article__label__text">Fecha creación</p>
              <p class="main__section__article__label__text">Fecha modificación</p>
            </div>
            <div class="main__section__article__info">
              <p class="main__section__article__info__text">{{ result.username }}</p>
              <p class="main__section__article__info__text">{{ result.created_at }}</p>
              <!-- result.created_at.split('-').reverse().join('-') -->
              <p class="main__section__article__info__text">{{ result.updated_at.split('-').reverse().join('-') }}</p>
            </div>
          </article>
          <article class="main__section__article">
            <h3 class="main__section__article__title">ESTADISTICA RESEÑA</h3>
            <div class="main__section__article__label">
              <p class="main__section__article__label__text">Puntuación</p>
              <p class="main__section__article__label__text">Me gustas</p>
              <p class="main__section__article__label__text">Favoritos</p>
            </div>
            <div class="main__section__article__info">
              <p class="main__section__article__info__text">
                {{ result.score }}
                <span class="main__section__article__info__text__icon material-symbols-outlined">grade</span>
              </p>
              <p class="main__section__article__info__text">333</p>
              <p class="main__section__article__info__text">222</p>
            </div>
          </article>
          <article class="main__section__article main__section__article--videogame">
            <h3 class="main__section__article__title">VIDEOJUEGO</h3>
            <div class="main__section__article__label">
              <p class="main__section__article__label__text">Nombre</p>
            </div>
            <div class="main__section__article__info">
              <p class="main__section__article__info__text">{{ result.name }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="main__section">
        <h2 class="main__section__title"><span class="main__section__title__text">Reseña</span></h2>
        <h3 class="main__section__subtitle">{{ result.title }}</h3>
        <div class="main__section__description" v-html="content"></div>
      </section>

      <div class="main__background">
        <img className="main__background__img" :src="result.image"/>
      </div>
    </div>
  </main>
</template>