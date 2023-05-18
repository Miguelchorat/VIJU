<script setup>
import BrowserMenuScore from '../components/BrowserMenuScore.vue'
</script>

<script>


export default {
    props: ['score'],
    data() {
        return {            
        }
    },
    methods: {
        listenScore(value){
            this.$emit('listenScore', value)
        }
    }
}
</script>
<template>
    <div>
        <div class="filter__square"></div>
        <div class="filter filter--score" @click.stop>
            <BrowserMenuScore @listenScore="listenScore" :score="score"/>
        </div>
    </div>
</template>