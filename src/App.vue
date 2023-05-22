<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Aside from './components/Aside.vue'

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
      trigger: 0
    }
  },
  mounted() {
  },
  methods: {
    listenTrigger(){
      this.trigger++
    }
  }
}
</script>

<template>
  <Header  v-show="$route.path !== '/sesion'" @listenTrigger="listenTrigger" :trigger="trigger"/>
  <Aside v-show="$route.path !== '/sesion'" @listenTrigger="listenTrigger"/>
  <RouterView @listenTrigger="listenTrigger"/>
</template>

