<script setup>
import Review from '../components/Review.vue'
import { API } from '../util'
import axios from 'axios'
import FilterGamesMenu from '../components/FilterGamesMenu.vue'
import FilterScoreMenu from '../components/FilterScoreMenu.vue'
import Browser from '../components/Browser.vue'
import Dialog from '../components/Dialog.vue'

</script>

<script>
export default {
  components: {
    Dialog
  },
  emits: ['listenTrigger', 'listenToast'],
  data() {
    return {
      user: null ?? { username: "", email: '', date: '1970-01-01' },
      stats: null ?? { likeCount: '', reviewCount: '', favoriteCount: '' },
      imagePathPrefix: "/VIJU/src/assets/img/avatar/",
      API_USER: API + "/user/username=" + this.$route.params.username,
      API_USER_STATS: API + "/user/stats/username=" + this.$route.params.username,
      API_USER_AVATAR: API + "/user/avatar",
      subheader: '',
      elementWidth: 0,
      scrollbarWidth: 6.4,
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
      method: '',
      avatarEdit: '',
      userEdit: '',
      likesCount: 0,
      favoritesCount: 0,
      loading: true,
      loadingButton: true,
      click: true
    }
  },
  created() {
    this.callAPIUser()
    localStorage.setItem('path', 'perfil/' + this.$route.params.username)
    this.method = localStorage.getItem('method') ?? ''
  },
  mounted() {
    const container = this.$refs.container
    container.addEventListener('scroll', this.onScroll)
    const resizeObserver = new ResizeObserver((entries) => {
      this.elementWidth = entries[0].contentRect.width;
    });
    resizeObserver.observe(container);
    container.addEventListener('scroll', this.handleScroll);
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
    async callAPIUser() {
      axios.get(this.API_USER, {
        withCredentials: true
      })
        .then((response) => {
          this.user = response.data
          this.callAPIStats()
          this.callAPI()
        })
        .catch(error => {
          this.$router.push('/404')
        });
    },
    async callAPIStats() {
      axios.get(this.API_USER_STATS, {
        withCredentials: true
      })
        .then((response) => {
          this.stats = response.data
        })
        .catch(error => {
          this.$router.push('/404')
        });
    },
    onScroll() {
      const header = this.$refs.header
      const container = this.$refs.container
      const scrollTop = container.pageYOffset || container.scrollTop
      const subheaderTop = header.offsetTop + header.offsetHeight

      if (scrollTop > subheaderTop) {
        this.subheader = 'main__subheader--fixed'
        this.click = false
      } else if (scrollTop <= subheaderTop) {
        if (this.subheader != '')
          this.subheader = 'main__subheader--animation'
          this.click = true
      }
    },
    getAvatar() {
      return this.imagePathPrefix + this.user.avatar;
    },
    goTop() {
      this.$refs.container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    async callAPI() {
      this.loading = true
      let endpoint = ''
      this.results = null
      if (this.method == '') {
        endpoint = this.API_REVIEWS + '?search=' + this.search + '&minScore=' + this.score + "&username=" + this.$route.params.username
      } else {
        endpoint = this.API_REVIEWS + '?search=' + this.search + '&minScore=' + this.score + '&method=' + this.method + '&userId=' + this.user.id
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
      this.totalPages = data.totalPages
      this.currentPage = 0

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

      this.results = data.content
      this.loading = false
    },
    async loadMore() {
      this.loadingButton = false
      this.currentPage++
      let endpoint = ''
      if (this.method == '') {
        endpoint = this.API_REVIEWS + '?search=' + this.search + '&minScore=' + this.score + "&username=" + this.$route.params.username + '&page=' + this.currentPage
      } else {
        endpoint = this.API_REVIEWS + '?search=' + this.search + '&minScore=' + this.score + '&method=' + this.method + '&userId=' + this.user.id + '&page=' + this.currentPage
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
    async changeAvatar(value) {
      let endpoint = this.API_USER_AVATAR

      axios.put(endpoint,
        {
          avatar: value,
        }, {
        headers:
        {
          'Authorization': `Bearer ${localStorage.getItem('tokenjwt')}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
        .then((response) => {
          this.listenToast('Avatar cambiado satisfactoriamente', 'success')
          this.callAPIUser()
          this.$emit('listenTrigger')
        }).catch(error => {
          this.listenToast('Hubo un error inesperado', 'warning')
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
    listenMethod(value) {
      this.method = value
      localStorage.setItem('method',value)
      this.callAPI()
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
    },
    checkUsernameEdit() {
      return this.$route.params.username == localStorage.getItem('username')
    },
    listenDialog(value, res) {
      if(this.click)
        if (this.checkUsernameEdit()) {
          if (value == 'close-ok') {
            this.avatarEdit = false
            this.changeAvatar(res)
            localStorage.setItem('avatar', res)
          }
          else {
            this.avatarEdit = !this.avatarEdit
          }
        }
    },
    listenDialogUser(value) {
      if (this.checkUsernameEdit()) {
        if (value == 'close-ok') {
          this.userEdit = false
        }
        else {
          this.userEdit = !this.userEdit
        }
      }
    },
    listenTrigger() {
      this.$emit('listenTrigger')
    },
    addLikes(value) {
      if(this.user.username == localStorage.getItem('username'))
        if (value == 'add')
          this.stats.likeCount++
        else
          this.stats.likeCount--
    },
    addFavorites(value) {
      if(this.user.username == localStorage.getItem('username'))
        if (value == 'add')
          this.stats.favoriteCount++
        else
          this.stats.favoriteCount--
    }
  },
}
</script>

<template>
  <main class="main" ref="container">
    <div class="container">
      <header class="main__header" ref="header">
        <section class="main__header__background">
          <img className="main__header__background__img" src="/src/assets/img/background-2.jpg" />
        </section>
        <a v-if="checkUsernameEdit()" href="#" class="main__header__edit" @click="listenDialogUser()">Editar</a>
      </header>
      <section class="main__subheader" ref="subheader" :class="subheader" @click="goTop()"
        :style="{ width: `calc(${elementWidth + scrollbarWidth}px` }">
        <div class="main__subheader__avatar" :class="{ 'main__subheader__avatar__user': checkUsernameEdit() }"
          @click="listenDialog('open')">
          <img class="main__subheader__avatar__img" :src="getAvatar()" alt="Avatar de usuario">
          <span class="main__subheader__avatar__icon material-symbols-outlined">border_color</span>
        </div>
        <p class="main__subheader__username">{{ user.username }}</p>
        <nav class="main__subheader__nav">
          <a href="#" class="main__subheader__nav__info" :class="{ 'main__subheader__nav__info__active': method == '' }"
            @click="listenMethod('')">{{ stats.reviewCount }} <span
              class="main__subheader__nav__info__label">Reseñas</span></a>
          <a href="#" class="main__subheader__nav__info" @click="listenMethod('likes')"
            :class="{ 'main__subheader__nav__info__active': method == 'likes' }">{{ stats.likeCount }} <span
              class="main__subheader__nav__info__label">Me gustas</span></a>
          <a href="#" class="main__subheader__nav__info" @click="listenMethod('favorites')"
            :class="{ 'main__subheader__nav__info__active': method == 'favorites' }">{{ stats.favoriteCount }} <span
              class="main__subheader__nav__info__label">Favoritos</span></a>
        </nav>
      </section>
      <section class="main__profile">
        <div class="main__filter">
          <Browser @listenInput="listenInput" />
          <a href="#" class="main__filter__videogame" @click="listenMenuVideogame">
            Videojuego
            <FilterGamesMenu v-if="menuVideogames" v-click-away="listenMenuVideogame"
              :videogamesSelected.sync="videogamesSelected" @addVideogame="addVideogame"
              @deleteVideogame="deleteVideogame" @listenToast="listenToast" />
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
            @click="() => $emit('selectReview', res.id)" :path="path" :created_at="res.createdAt" :isLiked="res.isLiked"
            :isFavorite="res.isFavorite" :likesCount="res.likesCount" :favoritesCount="res.favoritesCount"
            @listenToast="listenToast" @addLikes="addLikes" @addFavorites="addFavorites" />
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
      </section>
    </div>
    <Dialog :type="'avatarEdit'" :title="'Editar avatar'" :active="avatarEdit" @listenDialog="listenDialog" />
    <Dialog :type="'userEdit'" :title="'Modificar usuario'" :active="userEdit" @listenDialog="listenDialogUser"
      :email="user.email" :username="user.username" @listenToast="listenToast" @listenTrigger="listenTrigger" />
  </main>
</template>