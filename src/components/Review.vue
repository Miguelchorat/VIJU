<script>

import { RouterLink } from 'vue-router';
import { convertDate } from '../util'
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
    props: ["id", "title", "videogame", "image", "description", "user", "score", "path", "created_at"],
    data() {
        return {
            likes: 1,
            favorites: 1,
            animationLikes: 'initial',
            animationFavorites: 'initial',
            isSelectedLikes: 'material-symbols-sharp',
            isSelectedFavorites: 'material-symbols-sharp',
            date: 0
        }
    },
    methods: {
        handleLikes() {
            if (this.isSelectedLikes == 'material-symbols-sharp') {
                this.likes += 1;
                this.isSelectedLikes = 'material-symbols-outlined  main__reviews__review__info__like__selected';
                setTimeout(() => (this.animationLikes = 'goUp'), 0);
            } else {                
                setTimeout(() => (this.animationLikes = 'goUp'), 0);
                setTimeout(() => {
                    this.likes -= 1;
                    this.isSelectedLikes = 'material-symbols-sharp';
                }, 100);
            }
            setTimeout(() => (this.animationLikes = 'waitDown'), 75);
            setTimeout(() => (this.animationLikes = 'initial'), 200);
        },
        handleFavorites() {
            if (this.isSelectedFavorites == 'material-symbols-sharp') {
                this.favorites += 1;
                this.isSelectedFavorites = 'material-symbols-outlined  main__reviews__review__info__favorite__selected';
                setTimeout(() => (this.animationFavorites = 'goUp'), 0);
            } else {                
                setTimeout(() => (this.animationFavorites = 'goUp'), 0);
                setTimeout(() => {
                    this.favorites -= 1;
                    this.isSelectedFavorites = 'material-symbols-sharp';
                }, 100);
            }
            setTimeout(() => (this.animationFavorites = 'waitDown'), 75);
            setTimeout(() => (this.animationFavorites = 'initial'), 200);
        }
    },
    created() {
        this.date = convertDate(this.created_at)
    }
}
</script>

<template>
    <RouterLink href="#" class="main__reviews__review" :to="path + id">
        <div class="main__reviews__review__account">
            <p class="main__reviews__review__account__info">Publicado por <a
                    class="main__reviews__review__account__info__user" @click.stop>{{ user }}</a></p>
            <p class="main__reviews__review__account__date">{{ date }}</p>
        </div>
        <img class="main__reviews__review__img" :src="image" alt="" />
        <h2 class="main__reviews__review__videogame">{{ videogame }}</h2>
        <h2 class="main__reviews__review__title">{{ title }}</h2>
        <div class="main__reviews__review__info">
            <a class="main__reviews__review__info__like" :class="isSelectedLikes" href="#" @click.stop @click="handleLikes">
                <span class="main__reviews__review__info__like__icon" :class="isSelectedLikes">thumb_up</span>
                <span class="main__reviews__review__info__like__text" :class="animationLikes">{{ likes }}</span>
            </a>
            <a class="main__reviews__review__info__favorite" :class="isSelectedFavorites" href="#" @click.stop @click="handleFavorites">
                <span class="main__reviews__review__info__favorite__icon" :class="isSelectedFavorites">favorite</span>
                <span class="main__reviews__review__info__favorite__text" :class="animationFavorites">{{ favorites }}</span>
            </a>
            <p class="main__reviews__review__info__score">{{ score }}
                <span class="main__reviews__review__info__score__icon material-symbols-outlined">grade</span>
            </p>
        </div>
    </RouterLink>
</template>

