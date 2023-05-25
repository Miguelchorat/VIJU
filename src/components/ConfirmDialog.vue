<script setup>
</script>

<script>
export default {
    props: ['message','title', 'active'],
    emits: ['listenDialog'],
    data() {
        return {
        }
    },
    watch: {
    },
    methods: {
        listenDialog(value){
            this.$emit('listenDialog',value)
        }
    }
}
</script>

<template>
    <div v-if="active" class="dialog">
        <div class="dialog__group1">
            <h2 class="dialog__group1__title">{{ title }}</h2>
            <p class="dialog__group1__message">{{ message }}</p>
        </div>
        <div class="dialog__group2">
            <a href="#" class="dialog__group2__button dialog__group2__button__active" @click="listenDialog('close')">Cancelar</a>
            <a href="#" class="dialog__group2__button" @click="listenDialog('close-ok')">Aceptar</a>
        </div>
    </div>
    <div v-if="active" class="dialog__screen" @click="listenDialog('close')"></div>
</template>
