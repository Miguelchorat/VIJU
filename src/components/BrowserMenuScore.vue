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
        <input class="filter__browser__input" type="number" placeholder="Puntuación..." ref="searchInput" :value="search" @click.stop />
    </div>
</template>