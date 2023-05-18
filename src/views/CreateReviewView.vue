<script setup>
import axios from 'axios'
import { API } from '../util'
import FilterGamesMenu from '../components/FilterGamesMenu.vue'
import FilterScoreMenu from '../components/FilterScoreMenu.vue'
import { marked } from 'marked'
</script>

<script>
/**
 * Componente para crear una reseña.
 * @vue-prop {string} title - Título de la reseña.
 * @vue-prop {string} message - Mensaje de la reseña.
 * @vue-prop {string} score - Puntuación de la reseña.
 * @vue-prop {string} videogame - Nombre del videojuego relacionado con la reseña.
 * @vue-prop {Array<Game>} games - Lista de juegos para seleccionar.
 * @vue-prop {string} API_GAMES - URL de la API para obtener la lista de juegos.
 * @vue-prop {string} API_CREATE_REVIEW - URL de la API para crear una reseña.
 * @vue-data {string} errorTitle - Mensaje de error para el título de la reseña.
 * @vue-data {string} errorMessage - Mensaje de error para el cuerpo de la reseña.
 * @vue-data {string} errorScore - Mensaje de error para la puntuación de la reseña.
 * @vue-data {string} errorVideogame - Mensaje de error para el videojuego de la reseña.
 * @vue-data {boolean} focusTitle - Indica si el input del título tiene el foco.
 * @vue-data {boolean} focusMessage - Indica si el input del cuerpo de la reseña tiene el foco.
 * @vue-data {boolean} focusScore - Indica si el input de la puntuación de la reseña tiene el foco.
 * @vue-data {boolean} focusVideogame - Indica si el input del videojuego tiene el foco.
 * @vue-data {RegExp} scoreValidation - Expresión regular para validar la puntuación.
 * @vue-event callApiGames - Pide al servidor que le devuelva todos los videojuegos por su nombre
 * @vue-event createReview - Crea una review con los datos proporcionados y lo envia al servidor
 * @vue-event checkFields - Valida los campos del formulario y registra la reseña si son correctos
 */

marked.setOptions({
    silent: true,
});

export default {
    data() {
        return {
            title: '',
            message: '',
            score: '',
            videogame: '',
            errorTitle: '',
            errorMessage: '',
            errorScore: '',
            errorVideogame: '',
            preview: false,
            games: null,
            menuVideogames: false,
            menuScore: false,
            fieldSize: 0,
            contentPreview: '',
            API_GAMES: API + "/api/v1/games",
            API_CREATE_REVIEW: API + "/api/v1/auth/reviews",
            scoreValidation: /^(?:[0-5](?:\.[0-9])?|\.[0-9])$/,
        }
    },
    watch: {
        message(newValue, oldValue) {
            this.contentPreview = marked(newValue);
        },
    },
    methods: {
        async callAPI() {
            const endpoint = this.search !== "" ? this.API_SEARCH : this.API
            const response = await fetch(endpoint, { credentials: 'include' })
            const data = await response.json()
            this.games = data
        },
        async createReview() {
            let userId = localStorage.getItem('userId')
            const response = await axios.post(this.API_CREATE_REVIEW, {
                title: this.title,
                message: this.message,
                videogame: this.videogame,
                score: this.score,
                user: userId
            }, { withCredentials: true })
            if (response.status === 200) {
                this.$router.push('/review/' + response.data.id)
            }
        },
        checkFields() {
            let check = 0
            this.errorTitle = ''
            this.errorMessage = ''
            this.errorScore = ''
            this.errorVideogame = ''
            if (this.title.length > 3 && this.title.length < 50) {
                check++
            } else {
                this.errorTitle = 'El título es demasiado corto'
            }
            if (this.message.length > 3) {
                check++
            } else {
                this.errorMessage = 'El mensaje de la reseña es demasiado corto'
            }

            if (this.videogame !== "") {
                check++
            } else {
                this.errorVideogame = 'No elegiste un videojuego'
            }

            if (this.scoreValidation.test(this.score)) {
                check++
            } else {
                this.errorScore = 'La puntuación tiene que ser entre 0 y 5 y un decimal como máximo.'
            }

            if (check == 4) {
                this.createReview()
            }
        },
        listenMenuVideogame() {
            this.menuVideogames = !this.menuVideogames
        },
        listenMenuScore() {
            this.menuScore = !this.menuScore
        },
        write(value) {
            const cursorPosition = this.$refs.textArea.selectionStart
            const newValue = this.message.slice(0, cursorPosition) + value + this.message.slice(cursorPosition)
            this.message = newValue
            this.$nextTick(() => {
                if (value == '__' || value == '[](url)')
                    this.$refs.textArea.setSelectionRange(cursorPosition + 1, cursorPosition + 1)
                else
                    this.$refs.textArea.setSelectionRange(cursorPosition + 2, cursorPosition + 2)
                this.$refs.textArea.focus()
            })
        },
        listenPreview(value) {
            this.preview = value
            if (this.$refs.textarea != null)
                this.fieldSize = this.$refs.textarea.offsetHeight ?? 0;
        }
    },
}
</script>

<template>
    <main class="main">
        <div class="container">
            <h1 class="main__title">Crear una reseña</h1>
            <nav class="main__nav">
                <a href="#" class="main__nav__link" :class="!preview ? 'main__nav__link__active' : ''" @click.stop
                    @click="listenPreview(false)">
                    <span class="main__nav__link__icon material-symbols-outlined">rate_review</span>
                    Publicar
                </a>
                <a href="#" class="main__nav__link" :class="preview ? 'main__nav__link__active' : ''" @click.stop
                    @click="listenPreview(true)">
                    <span class="main__nav__link__icon material-symbols-outlined">Auto_Stories</span>
                    Visualizar
                </a>
            </nav>
            <form class="main__form" @submit.prevent="checkFields">
                <div class="main__form__group">
                    <div class="main__form__field">
                        <input class="main__form__field__input" type="text" placeholder="Título" aria-label="title"
                            :value="title" @input="event => title = event.target.value" maxlength="50" />
                        <p class="main__form__field__count">{{ title.length }}/50</p>
                    </div>
                    <a href="#" class="main__filter__videogame" @click="listenMenuVideogame">
                        Videojuego
                        <FilterGamesMenu v-if="menuVideogames" v-click-away="listenMenuVideogame" />
                        <span class="main__filter__videogame__icon material-symbols-outlined">expand_more</span>
                    </a>
                    <a href="#" class="main__filter__score" @click="listenMenuScore">
                        Puntuación
                        <FilterScoreMenu v-if="menuScore" v-click-away="listenMenuScore" />
                        <span class="main__filter__score__icon material-symbols-outlined">expand_more</span>
                    </a>
                </div>
                <div v-if="!preview" class="main__form__field main__form__field--textarea" ref="textarea">
                    <div class="main__form__field__header">
                        <div class="main__form__field__header__nav">
                            <span class="main__form__field__header__nav__item material-symbols-outlined"
                                @click="write('# ')">format_h1</span>
                            <span class="main__form__field__header__nav__item material-symbols-outlined"
                                @click="write('****')">format_bold</span>
                            <span class="main__form__field__header__nav__item material-symbols-outlined"
                                @click="write('__')">format_italic</span>
                            <span class="main__form__field__header__nav__item material-symbols-outlined"
                                @click="write('- ')">list</span>
                            <span class="main__form__field__header__nav__item material-symbols-outlined"
                                @click="write('[](url)')">link</span>
                        </div>
                        Markdown
                    </div>
                    <textarea class="main__form__field__textarea" type="text" placeholder="Texto (Obligatorio)"
                        ref="textArea" aria-label="text" :value="message" @input="event => message = event.target.value"
                        @focus="focusMessage = true" @blur="focusMessage = false"
                        :class="{ main__form__field__textarea__warning: errorMessage }" />
                </div>
                <div v-else class="main__form__field main__form__field--preview" ref="preview"
                    :style="{ height: fieldSize + 'px' }">
                    <div class="main__form__field__content" v-html="contentPreview"></div>
                </div>
                <div class="main__form__info">
                    <div class="main__form__info__group">
                        <p class="main__form__info__group__label">The legend of Zelda <span
                                class="main__form__info__group__label__icon material-symbols-outlined">close</span></p>
                        <p class="main__form__info__group__label">4.6 <span
                                class="main__form__info__group__label__icon material-symbols-outlined">close</span></p>
                    </div>
                    <input class="main__form__info__button" type="submit" value="Publicar">
                </div>
            </form>
        </div>
    </main>
</template>