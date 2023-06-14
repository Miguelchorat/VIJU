<script>

import { RouterLink } from 'vue-router';
import { API, convertDate } from '../util'
import axios from 'axios'
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
    emits: ['click', 'listenToast','addLikes','addFavorites'],
    props: ["id", "title", "videogame", "image", "description", "user", "score", "path", "created_at", 'likesCount', 'favoritesCount', 'isLiked', 'isFavorite','method'],
    data() {
        return {
            likes: this.likesCount,
            favorites: this.favoritesCount,
            animationLikes: 'initial',
            animationFavorites: 'initial',
            isSelectedLikes: 'material-symbols-sharp',
            isSelectedFavorites: 'material-symbols-sharp',
            date: 0,
        }
    },
    mounted() {
        this.checkLikes()
        this.checkFavorites()
    },
    methods: {
        handleLikes() {
            if (localStorage.getItem('tokenjwt') == null) {
                this.$emit('listenToast', 'Inicia sesión para poder interactuar con la web', 'alert')
                return null
            }
            if (this.isSelectedLikes == 'material-symbols-sharp') {
                this.likes += 1;
                this.isSelectedLikes = 'material-symbols-outlined  main__reviews__review__info__like__selected';                
                setTimeout(() => (this.animationLikes = 'goUp'), 0);
                
                this.$emit('addLikes','add')
            } else {
                setTimeout(() => (this.animationLikes = 'goUp'), 0);
                setTimeout(() => {
                    this.likes -= 1;
                    this.isSelectedLikes = 'material-symbols-sharp';
                }, 100);
                this.$emit('addLikes','remove')
            }            
            this.callAPILike()
            setTimeout(() => (this.animationLikes = 'waitDown'), 75);
            setTimeout(() => (this.animationLikes = 'initial'), 200);
        },
        checkLikes() {
            if (this.isLiked) {
                this.isSelectedLikes = 'material-symbols-outlined  main__reviews__review__info__like__selected';
            }
        },
        checkFavorites() {
            if (this.isFavorite) {
                this.isSelectedFavorites = 'material-symbols-outlined  main__reviews__review__info__favorite__selected';
            }
        },
        handleFavorites() {
            if (localStorage.getItem('tokenjwt') == null) {
                this.$emit('listenToast', 'Inicia sesión para poder interactuar con las reseñas', 'alert')
                return null
            }
            if (this.isSelectedFavorites == 'material-symbols-sharp') {
                this.favorites += 1;
                this.isSelectedFavorites = 'material-symbols-outlined  main__reviews__review__info__favorite__selected';                
                setTimeout(() => (this.animationFavorites = 'goUp'), 0);
                this.$emit('addFavorites','add')
            } else {
                setTimeout(() => (this.animationFavorites = 'goUp'), 0);
                setTimeout(() => {
                    this.favorites -= 1;
                    this.isSelectedFavorites = 'material-symbols-sharp';
                    this.$emit('addFavorites','remove')
                }, 100);
            }
            this.callAPIFav()           
            setTimeout(() => (this.animationFavorites = 'waitDown'), 75);
            setTimeout(() => (this.animationFavorites = 'initial'), 200);
        },
        goUser(user) {
            this.$router.push('/perfil/' + user)
            localStorage.removeItem('method')
        },
        async callAPILike() {
            let endpoint = API + '/like/' + this.id
            await axios.post(endpoint, {},{
                withCredentials: true,
                headers:
                {
                    'Authorization': `Bearer ${localStorage.getItem('tokenjwt')}`,
                    'Content-Type': 'application/json'
                },
            })
        },
        async callAPIFav() {
            let endpoint = API + '/favorite/' + this.id

            await axios.post(endpoint,{}, {
                withCredentials: true,
                headers:
                {
                    'Authorization': `Bearer ${localStorage.getItem('tokenjwt')}`,
                    'Content-Type': 'application/json'
                },
            })
        },
    },
    created() {
        this.date = convertDate(this.created_at)
        this.checkLikes()
        this.checkFavorites()
    }
}
</script>

<template>
    <RouterLink href="#" class="main__reviews__review" :to="path + id">
        <div class="main__reviews__review__account">
            <p class="main__reviews__review__account__info">Publicado por <a
                    class="main__reviews__review__account__info__user" @click.stop @click="goUser(user)">{{ user }}</a></p>
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
            <a class="main__reviews__review__info__favorite" :class="isSelectedFavorites" href="#" @click.stop
                @click="handleFavorites">
                <span class="main__reviews__review__info__favorite__icon" :class="isSelectedFavorites">bookmark</span>
                <span class="main__reviews__review__info__favorite__text" :class="animationFavorites">{{ favorites }}</span>
            </a>
            <p class="main__reviews__review__info__score">{{ score }}
                <span class="main__reviews__review__info__score__icon material-symbols-outlined">grade</span>
            </p>
        </div>
    </RouterLink>
</template>

