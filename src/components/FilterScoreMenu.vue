<script setup>
import BrowserMenuScore from '../components/BrowserMenuScore.vue'
</script>

<script>


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
    <div>
        <div class="filter__square"></div>
        <div class="filter filter--score" @click.stop>
            <BrowserMenuScore />
        </div>
    </div>
</template>