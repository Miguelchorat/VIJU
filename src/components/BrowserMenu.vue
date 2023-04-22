<script setup>
</script>

<script>

/**

Componente buscador de la página
*/
export default {
    data() {
        return {
            search: ''
        }
    },
    mounted() {
        this.$refs.searchInput.focus();
    }
}
</script>
<template>
    <div class="filter__browser">
        <span class="filter__browser__icon material-symbols-outlined">search</span>
        <input class="filter__browser__input" placeholder="Buscar juego..." ref="searchInput" :value="search" v-focus/>
    </div>
</template>