<script setup>
import UpdateAccount from '../components/UpdateAccount.vue'
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
      API_USER: "http://localhost:3001/api/v1/users/id="+localStorage.getItem("userId"),
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
  <main class="main main--header">
    <header class="main__header main__header--review">
      <h2 class="main__header__title">MI CUENTA</h2>    
      <div class="main__header__background">
        <img className="main__header__background__img" src="/src/assets/img/background-2.jpeg" />
        <div className="main__header__background__opacity" />
      </div>  
    </header>
    <section class="main__profile">
      <h3 class="main__profile__title">NOMBRE DE USUARIO</h3>
      <p class="main__profile__text">{{ user.username }}</p>
      <h3 class="main__profile__title">CORREO</h3>
      <p class="main__profile__text">{{user.email}}</p>
      <h3 class="main__profile__title">FECHA DE NACIMIENTO</h3>
      <p class="main__profile__text">{{user.date.split('-').reverse().join('-')}}</p>
      <input type='button' class="main__profile__button" value="MODIFICAR" @click="listenMenu" />
    </section>
  </main>

  <UpdateAccount @listenMenu="listenMenu" @checkUser="checkUser" :menu="menu" v-if="menu == 1" />
  <div class="popup__bg" :class="{ popup__bg__active: menu }" @click="listenMenu"></div>
</template>