<script setup>
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router';
import Header from './components/Header.vue'
import Aside from './components/Aside.vue'
import Login from './components/Login.vue'
import Loading from './components/Loading.vue'
import axios from 'axios'
import {API} from './util'

</script>

<script>

/**
 * Componente para padre donde se mostrará los diferentes componentes de la aplicación
 * @vue-data {string} search - Valor del campo de búsqueda
 * @vue-data {boolean} account - Mostrará o no si el usuario está logeado
 * @vue-data {number} menu - Contendrá que menu se desplegará
 * @vue-data {number} loading - Mostrará una pantalla de carga o no de ser necesario
 * @vue-data {string} user - Contiene el nombre de usuario que inicio sesión
 * @vue-data {number} userId - Contiene el id del usuario que inicio sesión
 * @vue-data {number} session - Comprobará si existe una sesión en las cookies
 * @vue-data {string} API_CHECK - La URL de la API para obtener si el servidor esta encendido.
 * @vue-data {string} API_LOGIN - La URL de la API para obtener la comprobación de si el usuario existe.
 * @vue-data {string} API_CLOSE - La URL de la API para cerrar la sesión del usuario
 * @vue-data {string} API_USER - La URL de la API para recoger el nombre de usuario
 * @vue-event {void} listenInput - Cambia el estado de de la variable search por el valor que le llegue
 * @vue-event {void} checkSession - Cambia el estado de session por el nuevo valor
 * @vue-event {void} checkUserId - Cambia el userId en caso de estar logeado
 * @vue-event {void} listenMenu - Cambia el estado de menu por el nuevo valor
 * @vue-event {void} listenAccount - Cambia el estado de account a su estado opuesto
 * @vue-event callAPI - Llama a la API del servidor para comprobar el estado del servidor
 * @vue-event closeSession - Llama a la API del servidor para cerrar la sesión del usuario
 * @vue-event checkSession - Llama a la API del servidor para comprobar el estado de la sesión del usuario
 * @vue-event checkUser - Llama a la API del servidor para comprobar el nombre de usuario del usuario que tiene sesión iniciada
 */
export default {
  data() {
    return {
      search: "",
      menu: 0,
      account: false,
      loading: false,
      user: "",
      userId: localStorage.getItem('userId') ?? 0,
      session: localStorage.getItem('session') ?? false,
      API_CHECK: API + "/api/v1/",
      API_LOGIN: API + "/api/v1/auth/",
      API_CLOSE: API + "/api/v1/auth/users/session=",
      API_USER: API +  "/api/v1/users/id=",
    }
  },
  mounted() {
    this.callAPI(),
    this.checkSession()
  },
  watch: {
    "$route.path": {
      immediate: true,
      handler(to, from) {
        this.listenInput("")
      }
    }
  },
  methods: {
    listenInput(value) {
      this.search = value;
    },
    changeSession(s) {
      this.session = s
      this.session = localStorage.setItem('session', s)
    },
    changeUserId(id) {
      this.userId = id
      this.userId = localStorage.setItem('userId', id)
    },
    listenMenu(n) {
      this.menu = n
    },
    listenAccount() {
      this.account = !this.account
    },
    async callAPI() {
      try {
        this.loading = false
        const response = await fetch(this.API_CHECK)
        if (response.status === 200) {
          this.loading = true
        } else {
          throw new Error('La respuesta de la API no fue exitosa')
        }
      } catch (error) {
        console.error(error)
      }
    },
    closeSession() {
      axios.delete(this.API_CLOSE + localStorage.getItem("userId"), { withCredentials: true })
        .then(response => {
          this.listenAccount()
          this.changeSession(false)
          this.changeUserId(false)
          localStorage.removeItem('userId')
          localStorage.removeItem('session')
          this.$router.push('/')
        })
        .catch(error => {
        });
    },
    async checkSession() {

      if (!!this.session === true) {
        const response = await fetch(this.API_LOGIN, { credentials: 'include' })
        if (response.status === 200) {
          this.listenAccount()
          this.checkUser()
        }
      }
    },
    async checkUser() {
      const response = await fetch(this.API_USER+localStorage.getItem('userId'))
      const data = await response.json()
      this.user = data.username
    }
  }
}
</script>

<template>
  <Header v-if="loading" v-show="$route.path !== '/sesion'" @listenInput="listenInput" :search.sync="search" @listenMenu="listenMenu" :menu="menu"
    :account="account" @closeSession="closeSession" :user.sync="user"/>
  <Aside v-if="loading" v-show="$route.path !== '/sesion'"/>
  <RouterView v-if="loading" :search="search" :userId.sync="userId" />
  <Loading v-else />
  <Login @listenMenu="listenMenu" :userId.sync="userId" :menu="menu" :session="session" :account="account"
    @listenAccount="listenAccount" @changeSession="changeSession" @changeUserId="changeUserId" v-if="menu == 1"
    :user.sync="user" @checkUser.sync="checkUser" />  
</template>

