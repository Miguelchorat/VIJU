<script setup>
import BrowserMenu from '../components/BrowserMenu.vue'
import { API } from '../util'
</script>

<script>


export default {
    props: ['videogamesSelected'],
    data() {
        return {
            games: [],
            API_GAMES: API + "/videogames",
            search: ''
        }
    },
    watch: {
        search: function () {
            this.callAPIGames()
        },
    },
    methods: {
        async callAPIGames() {
            let endpoint = this.API_GAMES + '?search=' + this.search
            console.log(endpoint)
            const response = await fetch(endpoint)
            const data = await response.json()
            this.games = data.filter(game => !this.videogamesSelected.find(selectedGame => selectedGame.id === game.id))
        },
        toggleSelection(videogame) {
            if (this.videogamesSelected?.find(v => v.id === videogame.id)) {
                this.deleteVideogame(this.videogamesSelected?.find(v => v.id === videogame.id))
            } else {
                this.addVideogame(videogame)
            }

        },
        addVideogame(videogame) {
            this.$emit('addVideogame', videogame)
            const index = this.games?.findIndex(v => v.id === videogame.id);
            if (index !== undefined && index !== -1) {
                this.games.splice(index, 1);
            }
        },
        deleteVideogame(videogame) {
            this.$emit('deleteVideogame', videogame)
            this.games.push(videogame)
            this.games.sort((a, b) => (a.name > b.name) ? 1 : -1);
        },
        listenInput(value) {
            this.search = value;
        }
    },
    created() {
        this.callAPIGames()
    }
}
</script>
<template>
    <div>
        <div class="filter__square"></div>
        <div class="filter" @click.stop>
            <BrowserMenu @listenInput="listenInput" />
            <ul class="filter__list">
                <li v-for="d in videogamesSelected" :value="d.id" class="filter__list__item filter__list__item__active"
                    @click="toggleSelection(d, d.id, d.name)">
                    <img class="filter__list__item__img" :src="d.image" alt="">
                    <p class="filter__list__item__text">{{ d.name }}</p>
                </li>
                <li v-for="d in games" :value="d.id" class="filter__list__item"
                    :class="{ 'filter__list__item__active': videogamesSelected?.find(v => v.id === d.id) }"
                    @click="toggleSelection(d, d.id, d.name)">
                    <img class="filter__list__item__img" :src="d.image" alt="">
                    <p class="filter__list__item__text">{{ d.name }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
