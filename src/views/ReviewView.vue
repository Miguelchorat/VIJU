<script>
import axios from 'axios'
import { API, formatDate } from '../util'
import { marked } from 'marked'
import ConfirmDialog from '../components/ConfirmDialog.vue'

export default {
  components: {
    ConfirmDialog
  },
  data() {
    return {
      result: null,
      submenu: false,
      showSubmenu: false,
      pathUpdate: "/perfil/actualizar-review/",
      API_REVIEW: API + "/review/" + this.$route.params.id,
      API_DELETE: API + "/review/" + this.$route.params.id,
      content: '',
      resultDialog: false,
      confirmDialog: false
    }
  },
  mounted() {
    this.callAPI()
  },
  methods: {
    async callAPI() {
      const response = await fetch(this.API_REVIEW)
      const data = await response.json()
      if (response.status == 404 || response.status == 400) {
        this.$router.push('/404');
        return null
      }
      this.result = data
      this.content = marked(this.result.message)
      this.result.createdAt = formatDate(new Date(this.result.createdAt))
      this.result.updatedAt = formatDate(new Date(this.result.createdAt))
    },
    deleteReview() {
      axios.delete(this.API_DELETE, {
        headers:
        {
          'Authorization': `Bearer ${localStorage.getItem('tokenjwt')}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
        .then(() => {
          this.listenToast('Eliminaste la reseña satisfactoriamente', 'success')
          this.$router.push('/')
        })
        .catch(error => {
          this.listenToast('Hubo un error inesperado eliminando la reseña', 'warning')
        });
    },
    goBack() {
      this.$router.push('/');
    },
    checkUser() {
      return this.result.user.username == localStorage.getItem('username')
    },
    listenDialog(value) {
      if (value == 'close-ok') {
        this.confirmDialog = false
        this.deleteReview()
      }
      else {
        this.confirmDialog = !this.confirmDialog
      }
    },
    listenToast(message, title) {
      this.$emit('listenToast', message, title)
    },
    goEdit(){
      this.$router.push('/actualizar-review/'+this.$route.params.id)
    }
  }
}
</script>

<template>
  <main v-if="result" class="main">
    <div class="container">
      <div class="main__breadcrumb">
        <a href="#" class="main__breadcrumb__link" @click="goBack">
          Reseñas
        </a>/
        <span class="main__breadcrumb__title">{{ result.title }}
        </span>
      </div>
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
              <p class="main__section__article__info__text">{{ result.user.username }}</p>
              <p class="main__section__article__info__text">{{ result.createdAt }}</p>
              <p class="main__section__article__info__text">{{ result.updatedAt.split('-').reverse().join('-') }}</p>
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
              <p class="main__section__article__info__text">{{ result.videogame.name }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="main__section">
        <h2 class="main__section__title">
          <span class="main__section__title__text">Reseña</span>
          <div class="main__section__group">
            <span v-if="checkUser()" class="main__section__title__edit material-symbols-outlined"
              @click="goEdit">edit_square</span>
            <span v-if="checkUser()" class="main__section__title__edit material-symbols-outlined"
              @click="listenDialog('open')">delete</span>
          </div>
        </h2>

        <h3 class="main__section__subtitle">{{ result.title }}</h3>
        <div class="main__section__description" v-html="content"></div>
      </section>

      <div class="main__background">
        <img className="main__background__img" :src="result.videogame.image" />
      </div>
    </div>
    <ConfirmDialog :message="'¿Estas seguro?'" :title="'Eliminar reseña'" :active="confirmDialog"
      @listenDialog="listenDialog" />
  </main>
</template>