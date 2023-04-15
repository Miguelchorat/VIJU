<script>

import { RouterLink } from 'vue-router';
/**

Componente que representa una tarjeta para mostrar información de una reseña.
@vue-prop {number} id - El id del videojuego.
@vue-prop {string} title - El título del videojuego.
@vue-prop {string} videogame - El nombre del videojuego.
@vue-prop {string} image - La ruta de la imagen que se mostrará en la tarjeta.
@vue-prop {string} description - La descripción del videojuego.
@vue-prop {string} user - El nombre del usuario que ha subido el videojuego.
@vue-prop {number} score - La puntuación del videojuego.
@vue-prop {string} path - La ruta a la que se redirigirá al hacer clic en la tarjeta.
*/
export default {
    props: ["id","title", "videogame", "image", "description", "user", "score","path"],

}
</script>

<template>
    <RouterLink href="#" class="main__reviews__review" :to="path+id">
        <div class="main__reviews__review__account">
            <p class="main__reviews__review__account__info">Publicado por <span class="main__reviews__review__account__info__user">{{ user }}</span></p>
            <p class="main__reviews__review__account__date">Hace 13 horas</p>
        </div>
        <img class="main__reviews__review__img" :src="image" alt="" />
        <h2 class="main__reviews__review__videogame">{{ videogame }}</h2>
        <h2 class="main__reviews__review__title">{{ title }}</h2>
        <div class="main__reviews__review__info">
            <a class="main__reviews__review__info__like" href="#"><span class="main__reviews__review__info__like__icon material-symbols-outlined">thumb_up</span>20</a>
            <a class="main__reviews__review__info__favorite" href="#"><span class="main__reviews__review__info__favorite__icon material-symbols-outlined">favorite</span>303</a>
            <p class="main__reviews__review__info__score">{{ score }}<span class="main__reviews__review__info__score__icon material-symbols-outlined">grade</span></p>
        </div>
    </RouterLink>
</template>

