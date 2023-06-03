<script setup>
</script>

<script>
export default {
  data() {
    return {
      MAX_LENGHT: 85
    }
  },
  created() {
    localStorage.setItem('path','actualizar-review')
    localStorage.removeItem('method')
  },
  methods: {
    
  }
}
</script>

<template>
  <main class="main main--notfound">
    <h1 class="main__notfound"><span class="main__notfound__span">404</span></h1>
    <p class="main__message">PÁGINA NO ENCONTRADA.</p>
  </main>
</template>
