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
      API_REVIEWS: API + "/reviews",
      currentPage: 0,
      totalPages: 0,
      title: '',
      scrollTimeout: null,
      loading: true,
      loadingButton: true
    }
  },
  mounted() {
    this.callAPI()
    this.$refs.container.addEventListener('scroll', this.handleScroll);
    if (this.$router.currentRoute.value.path == '/ultimo-dia') {
      this.title = 'Último dia'
      localStorage.setItem('path', 'ultimo-dia')
    } else if (this.$router.currentRoute.value.path == '/ultima-semana') {
      this.title = 'Última semana'
      localStorage.setItem('path', 'ultima-semana')
    } else if (this.$router.currentRoute.value.path == '/ultimo-mes') {
      this.title = 'Último mes'
      localStorage.setItem('path', 'ultimo-mes')
    } else {
      this.title = 'Últimos añadidos'
      localStorage.setItem('path', '')
    }
    localStorage.removeItem('method')
  },
  beforeUnmount() {
    this.$refs.container.removeEventListener('scroll', this.handleScroll);
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
    },
  },
  methods: {
    async callAPI() {
      this.loading = true;
      let endpoint = this.API_REVIEWS + '?search=' + this.search + '&minScore=' + this.score;
      this.results = null;

      if (this.$router.currentRoute.value.path == '/ultimo-dia') {
        endpoint += "&timeframe=day";
      } else if (this.$router.currentRoute.value.path == '/ultima-semana') {
        endpoint += "&timeframe=week";
      } else if (this.$router.currentRoute.value.path == '/ultimo-mes') {
        endpoint += "&timeframe=month";
      }

      if (this.videogamesSelected.length != 0) {
        endpoint += '&videogames=' + this.videogamesSelected.map(v => v.name).join('&videogames=');
      }

      const response = await axios.get(endpoint, { withCredentials: true });
      const data = response.data;
      this.totalPages = data.totalPages;
      this.currentPage = 0;

      if (localStorage.getItem('tokenjwt')) {
        const fetchLikedPromises = data.content.map(review => this.fetchUserLiked(review));
        const fetchFavoritePromises = data.content.map(review => this.fetchUserFavorite(review));

        const [likedResults, favoriteResults] = await Promise.all([
          Promise.all(fetchLikedPromises),
          Promise.all(fetchFavoritePromises)
        ]);

        data.content.forEach((review, index) => {
          review.isLiked = likedResults[index];
          review.isFavorite = favoriteResults[index];
        });
      }

      this.results = data.content;
      this.loading = false;
    },
    async loadMore() {
      this.loadingButton = false
      this.currentPage++
      let endpoint = this.API_REVIEWS + '?search=' + this.search + '&minScore=' + this.score + '&page=' + this.currentPage

      if (this.$router.currentRoute.value.path == '/ultimo-dia') {
        endpoint += "&timeframe=day"
      } else if (this.$router.currentRoute.value.path == '/ultima-semana') {
        endpoint += "&timeframe=week"
      } else if (this.$router.currentRoute.value.path == '/ultimo-mes') {
        endpoint += "&timeframe=month"
      }

      if (this.videogamesSelected.length != 0) {
        endpoint += '&videogames=' + this.videogamesSelected[0]?.name
          + '&videogames=' + this.videogamesSelected[1]?.name
          + '&videogames=' + this.videogamesSelected[2]?.name
          + '&videogames=' + this.videogamesSelected[3]?.name
          + '&videogames=' + this.videogamesSelected[4]?.name
      }

      const response = await axios.get(endpoint, {
        withCredentials: true
      })
      const data = response.data
      if (localStorage.getItem('tokenjwt')) {
        const fetchLikedPromises = data.content.map(review => this.fetchUserLiked(review));
        const fetchFavoritePromises = data.content.map(review => this.fetchUserFavorite(review));

        const [likedResults, favoriteResults] = await Promise.all([
          Promise.all(fetchLikedPromises),
          Promise.all(fetchFavoritePromises)
        ]);

        data.content.forEach((review, index) => {
          review.isLiked = likedResults[index];
          review.isFavorite = favoriteResults[index];
        });
      }
      this.results.push(...data.content)
      this.loadingButton = true;
    },
    async fetchUserLiked(review) {
      try {
        const response = await axios.get(API + `/review/${review.id}/liked`, {
          headers:
          {
            'Authorization': `Bearer ${localStorage.getItem('tokenjwt')}`,
            'Content-Type': 'application/json'
          },
        });
        const isLiked = response.data;
        return isLiked
      } catch (error) {
        this.listenToast('Hubo un error inesperado', 'warning')
      }
    },
    async fetchUserFavorite(review) {
      try {
        const response = await axios.get(API + `/review/${review.id}/favorite`, {
          headers:
          {
            'Authorization': `Bearer ${localStorage.getItem('tokenjwt')}`,
            'Content-Type': 'application/json'
          },
        });
        const isfavorite = response.data;
        return isfavorite
      } catch (error) {
        this.listenToast('Hubo un error inesperado', 'warning')
      }
    },
    resetFields() {
      this.results = null
      this.menuVideogames = false
      this.menuScore = false
      this.search = ''
      this.score = 1
      this.videogamesSelected = []
      this.currentPage = 0
      this.totalPages = 0
      this.title = ''
      this.scrollTimeout = null
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
      const container = this.$refs.container;
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 1 && this.currentPage < this.totalPages && !this.loading && this.loadingButton) {
        if (!this.scrollTimeout) {
          this.scrollTimeout = setTimeout(() => {
            this.loadMore();
            this.scrollTimeout = null;
          }, 250);
        }
      }
    },
    listenToast(message, title) {
      this.$emit('listenToast', message, title)
    }
  }
}
</script>

<template>
  <main class="main" ref="container" @scroll="handleScroll">
    <div class="container">
      <h1 class="main__title">{{ title }}</h1>
      <div class="main__filter">
        <Browser @listenInput="listenInput" />
        <a href="#" class="main__filter__videogame" @click="listenMenuVideogame">
          Videojuego
          <FilterGamesMenu v-if="menuVideogames" v-click-away="listenMenuVideogame"
            :videogamesSelected.sync="videogamesSelected" @addVideogame="addVideogame" @deleteVideogame="deleteVideogame"
            @listenToast="listenToast" />
          <span class="main__filter__videogame__icon material-symbols-outlined">expand_more</span>
        </a>
        <a href="#" class="main__filter__score" @click="listenMenuScore">
          Puntuación
          <FilterScoreMenu v-if="menuScore" v-click-away="listenMenuScore" @listenScore="listenScore" :score="score" />
          <span class="main__filter__score__icon material-symbols-outlined">expand_more</span>
        </a>
      </div>
      <section ref="reviews" class="main__reviews" v-show="results !== null && results.length !== 0 && !loading">
        <Review v-for="res in results" :id='res.id' :title='res.title' :image='res.videogame.image'
          :videogame="res.videogame.name" :user='res.user.username' :score='res.score'
          @click="() => $emit('selectReview', res.id)" :path="path" :created_at="res.createdAt"
          :likesCount="res.likesCount" :favoritesCount="res.favoritesCount" :isLiked="res.isLiked"
          :isFavorite="res.isFavorite" @listenToast="listenToast" />
      </section>
      <section ref="reviews" class="main__reviews main__loading" v-show="loading">
        <Review v-for="res in 16" :id='""' :title='""' :image='"/src/assets/img/placeholder.png"' :videogame="''"
          :user='""' :score='""' :path="''" :created_at="''" :likesCount="''" :favoritesCount="''" :isLiked="''"
          :isFavorite="''" />
      </section>
      <section v-if="(results == null || results.length == 0) && !loading" class="main__empty">
        <img src="/src/assets/img/broken.png" alt="CD ROTO" class="main__empty__image">
        <h2 className="main__empty__title">No se ha encontrado ningun resultado.</h2>
      </section>
      <div v-if="results !== null && results.length !== 0 && results.length % 16 == 0" class="main__load">
        <a class="main__load__button" href="#" @click="loadMore">
          <p v-if="loadingButton">Ver más</p>
          <p v-else class="loader"></p>
        </a>
      </div>
    </div>
  </main>
</template>
