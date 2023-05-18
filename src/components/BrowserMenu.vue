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
    },
    methods: {
        listenInput() {
            this.$emit('listenInput', this.search);
        }
    }
}
</script>
<template>
    <div class="filter__browser">
        <span class="filter__browser__icon material-symbols-outlined">search</span>
        <input class="filter__browser__input" type="text" placeholder="Buscar juego..." ref="searchInput" :value="search" @click.stop @input="(e) => $emit('listenInput', e.target.value)"/>
    </div>
</template>