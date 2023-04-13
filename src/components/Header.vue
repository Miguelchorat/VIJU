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
    props: {
        menu: {
            type: String
        },
        account: {
            type: Boolean
        },
        search: {
            type: String
        },
        user: {
            type: String
        },
    },
    data() {
        return {
            submenu: false,            
        }
    },
    methods: {
        listenSubmenu() {
            this.submenu = !this.submenu
        },    
    }
}
</script>

<template>
    <header class="header">
        <RouterLink to="/" class="header__identity">
            <img class="header__identity__logo" src="../assets/img/logo.svg" alt="Imagen del logo">
            <p class="header__identity__name">VIJU</p>
        </RouterLink>
        <div class="header__browser">
            <span class="header__browser__icon material-symbols-outlined">search</span>
            <input class="header__browser__input" placeholder="Buscar..."
                @input="(e) => $emit('listenInput', e.target.value)" :value="search" />
        </div>
        <nav class="header__nav" v-if="!account">
            <ul class="header__nav__list">
                <li class="header__nav__list__item">
                    <a type="button" class="header__nav__list__item__link" href="#"
                        @click="() => $emit('listenMenu', 1)">INICIAR SESIÓN</a>
                </li>
                <li class="header__nav__list__item"><a type="button" class="header__nav__list__item__link" href="#"
                        @click="() => $emit('listenMenu', 2)">REGISTRARSE</a></li>
            </ul>
        </nav>
        <a href="#" class="header__account" v-else @click="listenSubmenu">
            <p class="header__account__name">@{{ user }}</p>
            <nav class="header__menu" v-if="submenu" v-click-away="listenSubmenu">
                <ul class="header__menu__list">
                    <li class="header__menu__list__item">
                        <RouterLink to="/perfil">PERFIL</RouterLink>
                    </li>
                    <li class="header__menu__list__item">
                        <RouterLink to="/crear-review">CREAR REVIEW</RouterLink>
                    </li>
                    <li class="header__menu__list__item" @click="() => $emit('closeSession')"><a>CERRAR SESIÓN</a></li>
                </ul>
                <span class="header__menu__square" />
            </nav>
        </a>
    </header>
</template>
