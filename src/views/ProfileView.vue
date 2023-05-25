<script setup>
import { API } from '../util'
import axios from 'axios'
</script>

<script>
export default {
  data() {
    return {
      user: null ?? { username: "", email: '', date: '1970-01-01' },
      stats: null ?? { likeCount: 0, reviewCount: 0, favoriteCount: 0 },
      imagePathPrefix: "/VIJU/src/assets/img/avatar/",
      API_USER: API + "/user/username=" + this.$route.params.username,
      API_USER_STATS: API + "/user/stats/username=" + this.$route.params.username,
      subheader: '',
      elementWidth: 0,
      scrollbarWidth: 6.4
    }
  },
  created() {
    this.callAPI()
  },
  mounted() {
    const main = this.$refs.main
    main.addEventListener('scroll', this.onScroll)
    const resizeObserver = new ResizeObserver((entries) => {
      this.elementWidth = entries[0].contentRect.width;
    });
    resizeObserver.observe(main);
  },
  methods: {
    async callAPI() {
      axios.get(this.API_USER, {
        withCredentials: true
      })
        .then((response) => {
          this.user = response.data
          this.callAPIStats()
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
      const main = this.$refs.main
      const scrollTop = main.pageYOffset || main.scrollTop
      const subheaderTop = header.offsetTop + header.offsetHeight

      if (scrollTop > subheaderTop) {
        this.subheader = 'main__subheader--fixed'
      } else if (scrollTop <= subheaderTop) {
        if (this.subheader != '')
          this.subheader = 'main__subheader--animation'
      }
    },
    getAvatar() {
      return this.imagePathPrefix + this.user.avatar;
    }
  }
}
</script>

<template>
  <main class="main" ref="main">
    <div class="container">
      <header class="main__header" ref="header">
        <section class="main__header__background">
          <img className="main__header__background__img" src="/src/assets/img/background-2.jpg" />
        </section>
        <a href="#" class="main__header__edit">Editar</a>
      </header>
      <section class="main__subheader" ref="subheader" :class="subheader"
        :style="{ width: `calc(${elementWidth + scrollbarWidth}px` }">
        <img class="main__subheader__avatar" :src="getAvatar()" alt="Avatar de usuario">
        <p class="main__subheader__username">{{ user.username }}</p>
        <nav class="main__subheader__nav">
          <a href="#" class="main__subheader__nav__info">{{ stats.reviewCount }} <span
              class="main__subheader__nav__info__label">Reseñas</span></a> /
          <a href="#" class="main__subheader__nav__info">{{ stats.likeCount }} <span 
            class="main__subheader__nav__info__label">Me gustas</span></a> /
          <a href="#" class="main__subheader__nav__info">{{ stats.favoriteCount }} <span
              class="main__subheader__nav__info__label">Favoritos</span></a>
        </nav>
      </section>

      <!-- PLACEHOLDER -->
      <section class="main__data">
        Datos para rellenar y haya scroll
      </section>
      <section class="main__data">
        Datos para rellenar y haya scroll
      </section>
      <section class="main__data">
        Datos para rellenar y haya scroll
      </section>
      <section class="main__data">
        Datos para rellenar y haya scroll
      </section>

      <section class="main__data">
        Datos para rellenar y haya scroll
      </section>
      <section class="main__data">
        Datos para rellenar y haya scroll
      </section>
    </div>
  </main>
</template>