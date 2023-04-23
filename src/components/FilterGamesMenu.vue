<script setup>
import BrowserMenu from '../components/BrowserMenu.vue'
import { API } from '../util'
</script>

<script>


export default {
    data() {
        return {
            games: [],
            API_GAMES: API + "/api/v1/games",
            selectedItemIds: []
        }
    },
    methods: {
        async callAPIGames() {
            const response = await fetch(this.API_GAMES)
            const data = await response.json()
            this.games = data
        },
        toggleSelection(id) {
            if (this.selectedItemIds.includes(id)) {
                this.selectedItemIds = this.selectedItemIds.filter(itemId => itemId !== id);
            } else {
                this.selectedItemIds.push(id);
            }
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
            <BrowserMenu />
            <ul class="filter__list">
                <!-- filter__list__item__active -->
                <li v-for="d in games" :value="d.id" class="filter__list__item"
                    :class="{ 'filter__list__item__active': selectedItemIds.includes(d.id) }" @click="toggleSelection(d.id)">
                    <img class="filter__list__item__img" :src="d.image" alt="">
                    <p class="filter__list__item__text">{{ d.name }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>