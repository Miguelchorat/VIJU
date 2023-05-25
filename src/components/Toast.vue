<script setup>
import { RouterLink } from 'vue-router'
</script>

<script>
export default {
    props: ['status', 'message', 'active'],
    data() {
        return {
        }
    },
    watch: {
    },
    methods: {
        listenToast(){
            this.$emit('listenToast')
        }
    }
}
</script>

<template>
    <div v-if="active" class="toast" :class="{
        'toast--success': status == 'success',
        'toast--warning': status == 'warning',
        'toast--info': status == 'info',
        'toast--alert': status == 'alert'
    }">
        <div class="toast__content">
            <span class="toast__content__img material-symbols-sharp">
                {{
                    status == 'success' ? 'check' : status == 'warning' ? 'block' : status == 'info' ? 'info' : status ==
                        'alert' ?
                        'warning' : ''
                }}</span>
            <span class="toast__content__text">{{ message }}</span>
        </div>
        <span class="toast__close material-symbols-outlined" @click="listenToast">close</span>
    </div>
</template>
