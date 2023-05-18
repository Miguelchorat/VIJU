<script setup>
import Review from '../components/Review.vue'
import Browser from '../components/Browser.vue'
import FilterGamesMenu from '../components/FilterGamesMenu.vue'
import FilterScoreMenu from '../components/FilterScoreMenu.vue'
import { API } from '../util'
import axios from 'axios'
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
  data() {
    return {
      results: null,
      menuVideogames: false,
      menuScore: false,
      path: '/review/',
      search: '',
      score: 1,
      videogamesSelected: [],
      API_REVIEWS: API + "/reviewsFilter",
      currentPage: 0,
      totalPages: 0,
    }
  },
  mounted() {
    this.callAPI()
  },
  watch: {
    search: function () {
      this.callAPI()
    },
    score: function () {
      this.callAPI()
    },
    videogamesSelected: {
      handler: function (newValue, oldValue) {
        this.callAPI();
      },
      deep: true
    }
  },
  methods: {
    async callAPI() {
      let endpoint = this.API_REVIEWS + '?search=' + this.search + '&minScore=' + this.score
      if (this.videogamesSelected.length != 0) {
        endpoint += '&videogames=' + this.videogamesSelected[0]?.name
          + '&videogames=' + this.videogamesSelected[1]?.name
          + '&videogames=' + this.videogamesSelected[2]?.name
          + '&videogames=' + this.videogamesSelected[3]?.name
          + '&videogames=' + this.videogamesSelected[4]?.name
      }

      axios.get(endpoint, {
        withCredentials: true
      })
        .then((response) => {
          const data = response.data
          this.results = data.content          
          this.totalPages = data.totalPages
          this.currentPage = 0
        })
    },
    loadMore() {
      this.currentPage++
      console.log(this.currentPage)
      let endpoint = this.API_REVIEWS + '?search=' + this.search + '&page=' + this.currentPage
      if (this.videogamesSelected.length != 0) {
        endpoint += '&videogames=' + this.videogamesSelected[0]?.name
          + '&videogames=' + this.videogamesSelected[1]?.name
          + '&videogames=' + this.videogamesSelected[2]?.name
          + '&videogames=' + this.videogamesSelected[3]?.name
          + '&videogames=' + this.videogamesSelected[4]?.name
      }

      axios.get(endpoint, {
        withCredentials: true
      })
        .then((response) => {
          const data = response.data
          this.results.push(...data.content)
        })
    },
    listenMenuVideogame() {
      this.menuVideogames = !this.menuVideogames
    },
    listenMenuScore() {
      this.menuScore = !this.menuScore
    },
    listenInput(value) {
      this.search = value;
    },
    listenScore(value) {
      this.score = value;
    },
    addVideogame(videogame) {
      this.videogamesSelected.push(videogame);
      this.videogamesSelected.sort((a, b) => (a.name > b.name) ? 1 : -1);
    },
    deleteVideogame(videogame) {
      const index = this.videogamesSelected?.findIndex(v => v.id === videogame.id);
      if (index !== undefined && index !== -1) {
        this.videogamesSelected.splice(index, 1);
      }
    },
    handleScroll() {
      const container = this.$refs.container
      if (container.scrollTop + container.clientHeight >= container.scrollHeight && this.currentPage < this.totalPages) {
        this.loadMore()
      }
    }
  }
}
</script>

<template>
  <main class="main" ref="container" @scroll="handleScroll">
    <div class="container">
      <h1 class="main__title">Ultimos añadidos</h1>
      <div class="main__filter">
        <Browser @listenInput="listenInput" />
        <a href="#" class="main__filter__videogame" @click="listenMenuVideogame">
          Videojuego
          <FilterGamesMenu v-if="menuVideogames" v-click-away="listenMenuVideogame"
            :videogamesSelected.sync="videogamesSelected" @addVideogame="addVideogame"
            @deleteVideogame="deleteVideogame" />
          <span class="main__filter__videogame__icon material-symbols-outlined">expand_more</span>
        </a>
        <a href="#" class="main__filter__score" @click="listenMenuScore">
          Puntuación
          <FilterScoreMenu v-if="menuScore" v-click-away="listenMenuScore" @listenScore="listenScore" :score="score"/>
          <span class="main__filter__score__icon material-symbols-outlined">expand_more</span>
        </a>
      </div>
      <section class="main__reviews" v-if="results !== null && results.length !== 0">
        <Review v-for="res in results" :id='res.id' :title='res.title' :image='res.videogame.image'
          :videogame="res.videogame.name" :user='res.user.username' :score='res.score'
          @click="() => $emit('selectReview', res.id)" :path="path" :created_at="res.createdAt" />
      </section>
      <section v-else class="main__empty">
        <img src="/src/assets/img/broken.png" alt="CD ROTO" class="main__empty__image">
        <h2 className="main__empty__title">No se ha encontrado ningun resultado.</h2>
      </section>
    </div>
  </main>
</template>
