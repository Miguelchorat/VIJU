<script setup>
</script>

<script>

/**

Componente buscador de la página
*/
export default {
    data() {
        return {
            search : ''
        }
    },
    methods: {
        listenInput() {
            this.$emit('listenInput', this.search);
        }
    }
}
</script>
<template>
    <div class="main__filter__browser">
        <span class="main__filter__browser__icon material-symbols-outlined">search</span>
        <input class="main__filter__browser__input" placeholder="Buscar..." :value="search" @input="(e) => $emit('listenInput', e.target.value)" />
    </div>
</template>