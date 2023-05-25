<script setup>
import Review from '../components/Review.vue'
import Browser from '../components/Browser.vue'
import FilterGamesMenu from '../components/FilterGamesMenu.vue'
import FilterScoreMenu from '../components/FilterScoreMenu.vue'
import { API } from '../util'
import axios from 'axios'
</script>

<script>
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
      API_REVIEWS_DATE: API + "/reviewsDate",
      currentPage: 0,
      totalPages: 0,
      title: ''
    }
  },
  mounted() {
    this.callAPI()
    this.$refs.container.addEventListener('scroll', this.handleScroll);

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
    $route(to, from) {
      this.callAPI()
      if(this.$router.currentRoute.value.path == '/ultimo-dia'){
        this.title = 'Último dia'
      } else if (this.$router.currentRoute.value.path == '/ultima-semana'){
        this.title = 'Última semana'
      } else if (this.$router.currentRoute.value.path == '/ultimo-mes'){
        this.title = 'Último mes'
      } else {
        this.title = 'Últimos añadidos'
      }
    }
  },
  methods: {
    async callAPI() {
      let endpoint = ''
      if(this.$router.currentRoute.value.path == '/ultimo-dia'){
        endpoint = this.API_REVIEWS_DATE + '?search=' + this.search + '&minScore=' + this.score + "&timeframe=day"
      } else if (this.$router.currentRoute.value.path == '/ultima-semana'){
        endpoint = this.API_REVIEWS_DATE + '?search=' + this.search + '&minScore=' + this.score + "&timeframe=week"
      } else if (this.$router.currentRoute.value.path == '/ultimo-mes'){
        endpoint = this.API_REVIEWS_DATE + '?search=' + this.search + '&minScore=' + this.score + "&timeframe=month"
      } else {
        endpoint = this.API_REVIEWS + '?search=' + this.search + '&minScore=' + this.score
      }
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
      console.log(this.currentPage)
      this.currentPage++
      let endpoint = ''
      if(this.$router.currentRoute.value.path == '/ultimo-dia'){
        endpoint = this.API_REVIEWS_DATE + '?search=' + this.search + '&minScore=' + this.score + '&page=' + this.currentPage + "&timeframe=day"
      } else if (this.$router.currentRoute.value.path == '/ultima-semana'){
        endpoint = this.API_REVIEWS_DATE + '?search=' +  '&minScore=' + this.score + '&page=' + this.currentPage + "&timeframe=week"
      } else if (this.$router.currentRoute.value.path == '/ultimo-mes'){
        endpoint = this.API_REVIEWS_DATE + '?search=' + this.search + '&minScore=' + this.score + '&page=' + this.currentPage + "&timeframe=month"
      } else {
        endpoint = this.API_REVIEWS + '?search=' + this.search + '&minScore=' + this.score + '&page=' + this.currentPage
      }
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
    },
    listenToast(message,title){
      this.$emit('listenToast',message,title)
    }
  }
}
</script>

<template>
  <main class="main" ref="container" @scroll="handleScroll">
    <div class="container">
      <h1 class="main__title">{{title}}</h1>
      <div class="main__filter">
        <Browser @listenInput="listenInput" />
        <a href="#" class="main__filter__videogame" @click="listenMenuVideogame">
          Videojuego
          <FilterGamesMenu v-if="menuVideogames" v-click-away="listenMenuVideogame"
            :videogamesSelected.sync="videogamesSelected" @addVideogame="addVideogame"
            @deleteVideogame="deleteVideogame" @listenToast="listenToast"/>
          <span class="main__filter__videogame__icon material-symbols-outlined">expand_more</span>
        </a>
        <a href="#" class="main__filter__score" @click="listenMenuScore">
          Puntuación
          <FilterScoreMenu v-if="menuScore" v-click-away="listenMenuScore" @listenScore="listenScore" :score="score"/>
          <span class="main__filter__score__icon material-symbols-outlined">expand_more</span>
        </a>
      </div>
      <section ref="reviews" class="main__reviews" v-show="results !== null && results.length !== 0">
        <Review v-for="res in results" :id='res.id' :title='res.title' :image='res.videogame.image'
          :videogame="res.videogame.name" :user='res.user.username' :score='res.score'
          @click="() => $emit('selectReview', res.id)" :path="path" :created_at="res.createdAt" :likesCount="res.likesCount" :favoritesCount="res.favoritesCount" @listenToast="listenToast"/>
      </section>
      <section v-if="results == null || results.length == 0" class="main__empty">
        <img src="/src/assets/img/broken.png" alt="CD ROTO" class="main__empty__image">
        <h2 className="main__empty__title">No se ha encontrado ningun resultado.</h2>
      </section>      
      <div v-if="results !== null && results.length !== 0 && results.length % 16 == 0" class="main__load"><a class="main__load__button" href="#" @click="loadMore">Cargar más</a></div>
    </div>
  </main>
</template>
