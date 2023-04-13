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
        <img class="main__reviews__review__img" :src="image" alt="" />
        <h2 class="main__reviews__review__videogame">{{ videogame }}</h2>
        <h2 class="main__reviews__review__title">{{ title }}</h2>
        <p class="main__reviews__review__description">{{ description }}</p>
        <div class="main__reviews__review__info">
            <p class="main__reviews__review__info__user">@{{ user }}</p>
            <p class="main__reviews__review__info__score"
                :class="score < 2.5 ? 'main__reviews__review__info__score__red' : (score >= 2.5 && score < 3.5) ? 'main__reviews__review__info__score__yellow' : 'main__reviews__review__info__score__green'">
                {{ score }}
            </p>
        </div>
    </RouterLink>
</template>

