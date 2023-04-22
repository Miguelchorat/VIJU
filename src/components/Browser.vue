<script setup>
</script>

<script>

/**

Componente buscador de la página
*/
export default {
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>
<template>
    <div class="main__filter__browser">
        <span class="main__filter__browser__icon material-symbols-outlined">search</span>
        <input class="main__filter__browser__input" placeholder="Buscar..." :value="search" />
    </div>
</template>