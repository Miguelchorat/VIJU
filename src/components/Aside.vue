<script setup>
import { RouterLink } from 'vue-router'
</script>
<script>

/**

Componente menu lateral de la página
*/

</script>
<template>
    <aside class="aside">
        <nav class="aside__nav">
            <h2 v-if="!$route.path.includes('/perfil')" class="aside__nav__title">TEMAS</h2>
            <ul v-if="!$route.path.includes('/perfil')" class="aside__nav__list">
                <li class="aside__nav__list__item">
                    <RouterLink class="aside__nav__list__item__link" to="/"
                        active-class="aside__nav__list__item__link__active">
                        <span class="aside__nav__list__item__icon material-symbols-outlined">home</span>
                        INICIO
                    </RouterLink>
                </li>
            </ul>
            <h2 v-if="$route.path.includes('/perfil')" class="aside__nav__title">MI CUENTA</h2>
            <ul v-if="$route.path.includes('/perfil')" class="aside__nav__list">
                <li class="aside__nav__list__item">
                    <RouterLink class="aside__nav__list__item__link" to="/perfil"
                        active-class="aside__nav__list__item__link__active">
                        <span class="aside__nav__list__item__icon material-symbols-outlined">person</span>
                        PERFIL
                    </RouterLink>
                </li>
                <li class="aside__nav__list__item">
                    <RouterLink class="aside__nav__list__item__link" to="/perfil/reviews"
                        active-class="aside__nav__list__item__link__active">
                        <span class="aside__nav__list__item__icon material-symbols-outlined">reviews</span>
                        RESEÑAS
                    </RouterLink>
                </li>
            </ul>
        </nav>
</aside></template>