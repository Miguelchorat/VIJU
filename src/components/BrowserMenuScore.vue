<script setup>
</script>

<script>

/**

Componente buscador de la página
*/
export default {
    props: ['score'],
    data() {
        return {       
            scoreMenu: 0     
        }
    },
    created() {
        this.scoreMenu = this.score
    },
    watch: {
        scoreMenu: function () {            
            this.$emit('listenScore', this.scoreMenu)
        },
        score: function () {            
            this.scoreMenu = this.score
        },
    }
}
</script>
<template>
    <div class="filter__browser">
        <input type="radio" name="stars" id="star-a" class="filter__browser__star" value="5" v-model="scoreMenu"/>
        <label class="filter__browser__label" for="star-a"></label>
        <input type="radio" name="stars" id="star-b" class="filter__browser__star" value="4" v-model="scoreMenu"/>
        <label class="filter__browser__label" for="star-b"></label>
        <input type="radio" name="stars" id="star-c" class="filter__browser__star" value="3" v-model="scoreMenu"/>
        <label class="filter__browser__label" for="star-c"></label>
        <input type="radio" name="stars" id="star-d" class="filter__browser__star" value="2" v-model="scoreMenu"/>
        <label class="filter__browser__label" for="star-d"></label>
        <input type="radio" name="stars" id="star-e" class="filter__browser__star" value="1" v-model="scoreMenu"/>
        <label class="filter__browser__label" for="star-e"></label>
    </div>
</template>