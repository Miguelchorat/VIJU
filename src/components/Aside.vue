<script setup>
import { RouterLink } from 'vue-router'
</script>

<script>

/**

Componente menu lateral de la página
*/
export default {
    data() {
        return {
            isHidden: localStorage.getItem('isHidden') === 'true'
        }
    },
    methods: {
        toggleHidden() {
            this.isHidden = !this.isHidden;
            localStorage.setItem('isHidden', this.isHidden);
        }
    }
}
</script>
<template>
    <aside class="aside" :class="{ aside__hidden: isHidden }">
        <header class="aside__header">
            <RouterLink to="/" class="aside__header__identity">
                <img class="aside__header__identity__logo" src="../assets/img/logo.svg" alt="Imagen del logo">
                <p class="aside__header__identity__name">VIJU</p>
            </RouterLink>
        </header>
        <nav class="aside__nav">
            <ul class="aside__nav__list">
                <li class="aside__nav__list__item">
                    <RouterLink class="aside__nav__list__item__link" to="/"
                        active-class="aside__nav__list__item__link__active">
                        <span class="aside__nav__list__item__link__icon material-symbols-outlined">grid_view</span>
                        <p class="aside__nav__list__item__link__title">Inicio</p>
                    </RouterLink>
                </li>
                <li class="aside__nav__list__item">
                    <RouterLink class="aside__nav__list__item__link" to="/d"
                        active-class="aside__nav__list__item__link__active">
                        <span class="aside__nav__list__item__link__icon material-symbols-outlined">today</span>
                        <p class="aside__nav__list__item__link__title">Último día</p>
                    </RouterLink>
            </li>
            <li class="aside__nav__list__item">
                <RouterLink class="aside__nav__list__item__link" to="/d"
                    active-class="aside__nav__list__item__link__active">
                    <span class="aside__nav__list__item__link__icon material-symbols-outlined">date_range</span>
                    <p class="aside__nav__list__item__link__title">Última semana</p>
                </RouterLink>
            </li>
            <li class="aside__nav__list__item">
                <RouterLink class="aside__nav__list__item__link" to="/d"
                    active-class="aside__nav__list__item__link__active">
                    <span class="aside__nav__list__item__link__icon material-symbols-outlined">calendar_month</span>
                    <p class="aside__nav__list__item__link__title">Último mes</p>
                </RouterLink>
            </li>
            <li class="aside__nav__list__item">
                    <a class="aside__nav__list__item__link aside__nav__list__item__link--hide" href="#"  @click="toggleHidden">
                        <span class="aside__nav__list__item__link__icon material-symbols-outlined">start</span>
                        <p class="aside__nav__list__item__link__title">Ocultar</p>
                    </a>
                </li>
            </ul>
        </nav>
    </aside>
</template>