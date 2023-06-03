<script setup>
import { RouterLink } from 'vue-router'
</script>

<script>
export default {
    props: ['submenu', 'trigger'],
    data() {
        return {
            imagePathPrefix: "/VIJU/src/assets/img/avatar/",
            session: localStorage.getItem('tokenjwt') ?? null,
            username: localStorage.getItem('username') ?? null,
            avatar: localStorage.getItem('avatar') ?? null,
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
        listenLogout() {
            localStorage.removeItem('tokenjwt')
            localStorage.removeItem('username')
            localStorage.removeItem('avatar')
            this.$emit('listenTrigger')
            this.listenSubmenu()
            this.$router.push('/')
        },
        listenProfile() {
            this.$router.push("/perfil/" + localStorage.getItem('username'))
            localStorage.removeItem('method')
            this.listenSubmenu()
        },
        listenSubmenu() {
            this.$emit('listenSubmenu')
        }
    }
}
</script>
<template>
    <aside class="submenu" :class="submenu ? 'submenu__open' : 'submenu__close'">
        <header class="submenu__header">
            <span class="submenu__header__icon material-symbols-outlined" @click="listenSubmenu">close</span>
        </header>
        <nav class="submenu__nav">
            <ul class="submenu__nav__list">                
                <li class="submenu__nav__list__item" @click="listenSubmenu">
                    <RouterLink class="submenu__nav__list__item__link" to="/"
                        active-class="submenu__nav__list__item__link__active">
                        <span class="submenu__nav__list__item__link__icon material-symbols-outlined">grid_view</span>
                        <p class="submenu__nav__list__item__link__title">Inicio</p>
                    </RouterLink>
                </li>
                <li class="submenu__nav__list__item" @click="listenSubmenu">
                    <RouterLink class="submenu__nav__list__item__link" to="/ultimo-dia"
                        active-class="submenu__nav__list__item__link__active">
                        <span class="submenu__nav__list__item__link__icon material-symbols-outlined">today</span>
                        <p class="submenu__nav__list__item__link__title">Último día</p>
                    </RouterLink>
                </li>
                <li class="submenu__nav__list__item" @click="listenSubmenu">
                    <RouterLink class="submenu__nav__list__item__link" to="/ultima-semana"
                        active-class="submenu__nav__list__item__link__active">
                        <span class="submenu__nav__list__item__link__icon material-symbols-outlined">date_range</span>
                        <p class="submenu__nav__list__item__link__title">Última semana</p>
                    </RouterLink>
                </li>
                <li class="submenu__nav__list__item" @click="listenSubmenu">
                    <RouterLink class="submenu__nav__list__item__link" to="/ultimo-mes"
                        active-class="submenu__nav__list__item__link__active">
                        <span class="submenu__nav__list__item__link__icon material-symbols-outlined">calendar_month</span>
                        <p class="submenu__nav__list__item__link__title">Último mes</p>
                    </RouterLink>
                </li>                
                <div class="submenu__separator"></div>
                <li v-if="session" class="submenu__nav__list__item" @click="listenProfile">
                    <a class="submenu__nav__list__item__link" href="#" active-class="submenu__nav__list__item__link__active">
                        <img :src="getAvatar()" class="submenu__nav__list__item__link__icon">
                        <p class="submenu__nav__list__item__link__title">Ver perfil</p>
                    </a>
                </li>
                <li v-else class="submenu__nav__list__item" @click="listenSubmenu">
                    <RouterLink class="submenu__nav__list__item__link" to="/sesion" active-class="submenu__nav__list__item__link__active">
                        <span class="submenu__nav__list__item__link__icon material-symbols-outlined">login</span>
                        <p class="submenu__nav__list__item__link__title">Iniciar sesión</p>
                    </RouterLink>
                </li>
                <li v-if="session" class="submenu__nav__list__item" @click="listenSubmenu">
                    <RouterLink class="submenu__nav__list__item__link" to="/crear-review"
                        active-class="submenu__nav__list__item__link__active">
                        <span class="submenu__nav__list__item__link__icon material-symbols-outlined">add</span>
                        <p class="submenu__nav__list__item__link__title">Crear reseña</p>
                    </RouterLink>
                </li>
                <li v-if="session" class="submenu__nav__list__item" @click="listenLogout">
                    <a class="submenu__nav__list__item__link" href="#" active-class="submenu__nav__list__item__link__active">
                        <span class="submenu__nav__list__item__link__icon material-symbols-outlined">logout</span>
                        <p class="submenu__nav__list__item__link__title">Cerrar sesión</p>
                    </a>
                </li>
            </ul>
        </nav>
    </aside>
</template>