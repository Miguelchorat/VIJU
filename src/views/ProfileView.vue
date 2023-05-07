<script setup>
import UpdateAccount from '../components/UpdateAccount.vue'
import { API } from '../util'
</script>

<script>
/**
 * Componente que verifica si el usuario está autenticado y obtiene sus datos de la API.
 *
 * @vue-prop {String} userId - El ID del usuario.
 * @vue-prop {String} search - La cadena de búsqueda para filtrar las reseñas del usuario.
 * @vue-data {Object} user - Los datos del usuario obtenidos de la API.
 * @vue-data {Boolean} menu - Indica si el menú está abierto o cerrado.
 * @vue-data {String} API_USER - La URL para obtener los datos del usuario.
 * @vue-event {void} listenMenu - Cambia el estado de menu a su estado opuesto
 * @vue-event {void} checkUser - Busca la existencia del usuario que concuerde con la id de usuario en el servidor
 */
export default {
  props: ['userId', 'search'],

  data() {
    return {
      user: null ?? { username: "", email: '', date: '1970-01-01' },
      menu: false,
      API_USER: API + "/api/v1/users/id=" + localStorage.getItem("userId"),
      subheader: '',
      elementWidth: 0,
      scrollbarWidth: 6.4
    }
  },
  created() {
    //this.checkUser()
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
    listenMenu() {
      this.menu = !this.menu
    },
    // async checkUser() {
    //   const response = await fetch(this.API_USER)
    //   const data = await response.json()
    //   this.user = data
    // },
    onScroll() {
      const header = this.$refs.header
      const main = this.$refs.main
      const scrollTop = main.pageYOffset || main.scrollTop
      const subheaderTop = header.offsetTop + header.offsetHeight
      
      if ( scrollTop > subheaderTop ) {
        this.subheader = 'main__subheader--fixed'            
      } else if ( scrollTop <= subheaderTop ){
        if(this.subheader != '')
          this.subheader = 'main__subheader--animation'        
      }
    }
  }
}
</script>

<template>
  <main class="main" ref="main">
    <div class="container" >
      <header class="main__header" ref="header">
        <section class="main__header__background">
          <img className="main__header__background__img" src="/src/assets/img/background-2.jpg" />
        </section>
        <a href="#" class="main__header__edit">Editar</a>
      </header>
      <section class="main__subheader" ref="subheader" :class="subheader" :style="{ width: `calc(${elementWidth + scrollbarWidth}px` }">
        <img class="main__subheader__avatar" src="../assets/img/logo.svg" alt="Avatar de usuario">
        <p class="main__subheader__username">Pedrito el de los palotes</p>
        <nav class="main__subheader__nav">
          <a href="#" class="main__subheader__nav__info">11 <span class="main__subheader__nav__info__label">Reseñas</span></a> /
          <a href="#" class="main__subheader__nav__info">233 <span class="main__subheader__nav__info__label">Me
              gustas</span></a> /
          <a href="#" class="main__subheader__nav__info">4 <span class="main__subheader__nav__info__label">Favoritos</span></a>
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