<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Aside from './components/Aside.vue'
import Toast from './components/Toast.vue'
import Submenu from './components/Submenu.vue'

</script>

<script>
export default {
  components: {
    Toast
  },
  data() {
    return {
      trigger: 0,
      toast: false,
      messageToast: '',
      statusToast: '',
      submenu: false
    }
  },
  created() {   
    localStorage.setItem('path','/')
  },
  methods: {
    listenTrigger() {
      this.trigger++
    },
    listenToast(message,status) {
      this.messageToast = message
      this.statusToast = status
      this.toast = !this.toast
    },
    listenSubmenu(){      
      this.submenu = !this.submenu
    }
  }
}
</script>

<template>
  <Header v-show="$route.path !== '/sesion'" @listenTrigger="listenTrigger" :trigger="trigger" @listenSubmenu="listenSubmenu"/>
  <Aside v-show="$route.path !== '/sesion'" />
  <Submenu v-show="$route.path !== '/sesion'" @listenTrigger="listenTrigger" :trigger="trigger" @listenSubmenu="listenSubmenu" :submenu="submenu"/>
  <RouterView @listenToast="listenToast" :key="$route.path"  @listenTrigger="listenTrigger"/>
  <Toast :message="messageToast" :status="statusToast" :active="toast" @listenToast="listenToast" v-click-away="listenToast" />
</template>

