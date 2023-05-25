<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Aside from './components/Aside.vue'
import Toast from './components/Toast.vue'

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
      statusToast: ''
    }
  },
  mounted() {
  },
  methods: {
    listenTrigger() {
      this.trigger++
    },
    listenToast(message,status) {
      this.messageToast = message
      this.statusToast = status
      this.toast = !this.toast
    }
  }
}
</script>

<template>
  <Header v-show="$route.path !== '/sesion'" @listenTrigger="listenTrigger" :trigger="trigger" />
  <Aside v-show="$route.path !== '/sesion'" @listenTrigger="listenTrigger" />
  <RouterView @listenTrigger="listenTrigger" @listenToast="listenToast"/>
  <Toast :message="messageToast" :status="statusToast" :active="toast" @listenToast="listenToast" v-click-away="listenToast" />
</template>

