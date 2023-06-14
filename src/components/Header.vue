<script setup>
import { RouterLink } from 'vue-router'
</script>

<script>
/**

Componente de encabezado de la página
@vue-prop {string} menu - Controla el menú desplegable de inicio de sesión y registro
@vue-prop {boolean} account - Indica si el usuario ha iniciado sesión o no
@vue-prop {string} search - Valor del campo de búsqueda
@vue-prop {string} user - Nombre de usuario
@vue-event {void} listenSubmenu - Cambia el estado de submenu a su estado opuesto
*/
export default {
    props: ['trigger'],
    data() {
        return {
            imagePathPrefix: "../assets/img/avatar/",
            session: localStorage.getItem('tokenjwt') ?? null,
            username: localStorage.getItem('username') ?? null,
            avatar: localStorage.getItem('avatar') ?? null,
            menu: false
        }
    },
    watch: {
        trigger: function () {
            this.session = localStorage.getItem('tokenjwt')
            this.username = localStorage.getItem('username')
            this.avatar = localStorage.getItem('avatar')
        }
    },
    methods: {
        getAvatar() {
            return this.imagePathPrefix + this.avatar;
        },
        listenMenu() {
            this.menu = !this.menu
        },
        listenLogout() {
            localStorage.removeItem('tokenjwt')
            localStorage.removeItem('username')
            localStorage.removeItem('avatar')
            this.$emit('listenTrigger')
            this.listenMenu()
            this.$router.push('/')
        },
        listenProfile() {
            this.$router.push("/perfil/"+localStorage.getItem('username'))
            localStorage.removeItem('method')
            this.listenMenu()
        },
        listenSubmenu(){
            this.$emit('listenSubmenu')
        }
    }
}
</script>

<template>
    <header class="header">
        <RouterLink v-if="session" class="header__add material-symbols-outlined" to="/crear-review">add</RouterLink>
        <div v-if="session" class="header__account" @click="listenMenu">
            <img :src="getAvatar()" alt="user avatar" class="header__account__img">
            <p class="header__account__username">{{ username }}</p>
        </div>
        <RouterLink v-else type="button" class="header__session" to="/sesion">SIGN IN</RouterLink>
        <ul v-if="menu" class="header__menu" v-click-away="listenMenu">
            <li class="header__menu__item" @click="listenProfile">Ver perfil</li>
            <li class="header__menu__item" @click="listenLogout">Cerrar sesión</li>
        </ul>
        <div v-if="menu" class="header__menu__square"></div>
        <div class="header__empty"></div>
        <RouterLink to="/"><img class="header__logo" src="/src/assets/img/logo.svg" alt="logo"></RouterLink>
        <span class="header__hamburger material-symbols-outlined" @click="listenSubmenu">menu</span>
    </header>
</template>
