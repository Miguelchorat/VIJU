<script setup>
import UpdateAccount from '../components/UpdateAccount.vue'
import {API} from '../util'
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
      user:  null ?? {username: "",email: '', date: '1970-01-01'},
      menu: false,      
      API_USER: API + "/api/v1/users/id="+localStorage.getItem("userId"),
    }
  },
  created() {
    this.checkUser()   
  },
  methods: {
    listenMenu() {
      this.menu = !this.menu
    },

    async checkUser() {
      const response = await fetch(this.API_USER)
      const data = await response.json()
      this.user = data
    }
  }
}
</script>

<template>
  <main class="main">
    <header class="main__header">  
      <section class="main__header__background">
        <img className="main__header__background__img" src="/src/assets/img/background-2.jpg" />
      </section>  
      <section class="main__header__user">
        <p class="main__header__user__info">11 <span class="main__header__user__info__label">Reseñas</span></p> /
        <p class="main__header__user__info">233 <span class="main__header__user__info__label">Me gustas</span></p> /
        <p class="main__header__user__info">4 <span class="main__header__user__info__label">Favoritos</span></p>
      </section>
    </header>
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
    </section><section class="main__data">
      Datos para rellenar y haya scroll
    </section>
    <section class="main__data">
      Datos para rellenar y haya scroll
    </section><section class="main__data">
      Datos para rellenar y haya scroll
    </section><section class="main__data">
      Datos para rellenar y haya scroll
    </section><section class="main__data">
      Datos para rellenar y haya scroll
    </section><section class="main__data">
      Datos para rellenar y haya scroll
    </section>
  </main>

  <UpdateAccount @listenMenu="listenMenu" @checkUser="checkUser" :menu="menu" v-if="menu == 1" />
  <div class="popup__bg" :class="{ popup__bg__active: menu }" @click="listenMenu"></div>
</template>