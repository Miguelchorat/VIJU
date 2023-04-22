<script setup>
import BrowserMenu from '../components/BrowserMenu.vue'
import {API} from '../util'
</script>

<script>


export default {
    data() {
        return {
            games: null,
            API_GAMES: API + "/api/v1/games",
        }
    },
    methods: {
        async callAPIGames() {
            const response = await fetch(this.API_GAMES)
            const data = await response.json()
            this.games = data
        }
    },
    created() {
        this.callAPIGames()
    }
}
</script>
<template>
    <div class="filter__square"></div>
    <div class="filter">
        <BrowserMenu />
        <ul class="filter__list">
            <!-- filter__list__item__active -->
            <li v-for="d in games" :value="d.id" class="filter__list__item"> 
                <img class="filter__list__item__img" :src="d.image" alt="">
                <p class="filter__list__item__text">{{ d.name }}</p>            
            </li>
        </ul>
    </div> 
</template>