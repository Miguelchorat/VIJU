<script setup>
import Review from '../components/Review.vue'
</script>

<script>
/**
 * Componente que realiza llamadas a una API de reseñas de videojuegos.
 *
 * @vue-prop {String} review - La reseña a buscar.
 * @vue-prop {String} search - La cadena de búsqueda para filtrar las reseñas.
 * @vue-data {Number} MAX_LENGHT - La longitud máxima permitida para la reseña.
 * @vue-data {Object} results - Los resultados obtenidos de la API.
 * @vue-data {String} path - El path base para las reseñas.
 * @vue-data {String} API - La URL base para la API de reseñas.
 * @vue-data {String} API_SEARCH - La URL para buscar reseñas con la cadena de búsqueda..
 * @vue-event callAPI - Llama a la API del servidor para encontrar las reseñas de videojuegos que incluyan la busqueda
 */
export default {
  props: ["review", "search"],
  data() {
    return {
      MAX_LENGHT: 85,
      results: null,
      path: '/review/',
      API: "https://viju-server.onrender.com/api/v1/reviews",
      API_SEARCH: "https://viju-server.onrender.com/api/v1/reviews/search=" + this.search
    }
  },
  mounted() {
    this.callAPI()
  },
  watch: {
    search: function () {
      this.API_SEARCH = "https://viju-server.onrender.com/api/v1/reviews/search=" + this.search
      this.callAPI()
    }
  },
  methods: {
    async callAPI() {
      const endpoint = this.search !== "" ? this.API_SEARCH : this.API
      const response = await fetch(endpoint,{credentials: 'include'})
      const data = await response.json()
      this.results = data
    }
  }
}
</script>

<template>
  <main class="main">
    <h1 class="main__title">NUEVAS RESEÑAS</h1>
    <section class="main__reviews" v-if="results !== null && results.length !== 0">
      <Review v-for="res in results" :id='res.id' :title='res.title' :image='res.image' :videogame="res.name"
        :description='res.message.substring(0, MAX_LENGHT) + " ..."' :user='res.username' :score='res.score'
        @click="() => $emit('selectReview', res.id)" :path="path"/>
    </section>
    <section v-else class="main__empty">
      <img src="/src/assets/img/broken.png" alt="CD ROTO" class="main__empty__image">
      <h2 className="main__empty__title">No se ha encontrado ningun resultado.</h2>
    </section>
  </main>
</template>
