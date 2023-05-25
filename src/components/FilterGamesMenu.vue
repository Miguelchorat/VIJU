<script setup>
import BrowserMenu from '../components/BrowserMenu.vue'
import { API } from '../util'
</script>

<script>


export default {
    props: ['videogamesSelected', 'videogame'],
    emits: ['listenToast','addVideogame','deleteVideogame','selectVideogame','listenMenuVideogame'],    
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
            const response = await fetch(endpoint)
            const data = await response.json()
            if (this.videogamesSelected != null) {
                this.games = data.filter(game => !this.videogamesSelected.find(selectedGame => selectedGame.id === game.id))
            }
            else {
                this.games = data
            }
        },
        toggleSelection(videogame) {
            if (this.videogamesSelected != null) {
                if (this.videogamesSelected?.find(v => v.id === videogame.id)) {
                    this.deleteVideogame(this.videogamesSelected?.find(v => v.id === videogame.id))
                } else {
                    if (Reflect.get(this.videogamesSelected, 'length') >= 5) {
                        this.$emit('listenToast', 'Has seleccionado el máximo de videojuegos permitido', 'alert')
                    }
                    else{
                        this.addVideogame(videogame)
                    }                    
                }
            } else {
                this.selectVideogame(videogame)
                this.$emit('listenMenuVideogame')
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
        },
        selectVideogame(videogame) {
            this.$emit('selectVideogame', videogame)
        }
    },
    created() {
        this.callAPIGames()
    }
}
</script>
<template>
    <div>
        <div class="filter__square" :class="{ 'filter__square__review': videogamesSelected == null }"></div>
        <div class="filter" :class="{ 'filter__review': videogamesSelected == null }" @click.stop>
            <BrowserMenu @listenInput="listenInput" />
            <ul class="filter__list">
                <li v-for="d in videogamesSelected" :value="d.id" class="filter__list__item filter__list__item__active"
                    @click="toggleSelection(d, d.id, d.name)">
                    <img class="filter__list__item__img" :src="d.image" alt="">
                    <p class="filter__list__item__text">{{ d.name }}</p>
                </li>
                <li v-for="d in games" :value="d.id" class="filter__list__item"
                    :class="{ 'filter__list__item__active': videogamesSelected?.find(v => v.id === d.id), }"
                    @click="toggleSelection(d, d.id, d.name)">
                    <img class="filter__list__item__img" :src="d.image" alt="">
                    <p class="filter__list__item__text">{{ d.name }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
