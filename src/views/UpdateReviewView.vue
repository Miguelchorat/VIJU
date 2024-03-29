<script setup>
import axios from 'axios'
import { API } from '../util'
import FilterGamesMenu from '../components/FilterGamesMenu.vue'
import BrowserMenuScore from '../components/BrowserMenuScore.vue'
import { marked } from 'marked'
</script>

<script>

marked.setOptions({
    silent: true,
});
/**
 * Componente para editar una reseña de videojuego.
 * @vue-data {string} title - El título de la reseña.
 * @vue-data {string} message - El cuerpo de la reseña.
 * @vue-data {string} score - La puntuación asignada al videojuego.
 * @vue-data {string} videogame - El videojuego de la reseña.
 * @vue-data {string} errorTitle - Mensaje de error para el título de la reseña.
 * @vue-data {string} errorMessage - Mensaje de error para el cuerpo de la reseña.
 * @vue-data {string} errorScore - Mensaje de error para la puntuación de la reseña.
 * @vue-data {string} errorVideogame - Mensaje de error para el videojuego de la reseña.
 * @vue-data {boolean} focusTitle - Indica si el campo de título tiene el foco.
 * @vue-data {boolean} focusMessage - Indica si el campo de cuerpo tiene el foco.
 * @vue-data {boolean} focusScore - Indica si el campo de puntuación tiene el foco.
 * @vue-data {boolean} focusVideogame - Indica si el campo de videojuego tiene el foco.
 * @vue-data {Array} games - La lista de videojuegos disponibles.
 * @vue-data {string} API_GAMES - La URL de la API para obtener la lista de videojuegos.
 * @vue-data {string} API_REVIEW - La URL de la API para obtener la reseña actual.
 * @vue-data {string} API_UPDATE_REVIEW - La URL de la API para actualizar la reseña.
 * @vue-data {RegExp} scoreValidation - Expresión regular para validar la puntuación de la reseña.
 * @vue-event callAPI - Llama a la API del servidor para encontrar la reseña del videojuego que incluyan la busqueda para modificar
 * @vue-event callApiGames - Pide al servidor que le devuelva todos los videojuegos por su nombre
 * @vue-event updateReview - Modifica una review con los datos proporcionados y lo envia al servidor
 * @vue-event checkFields - Valida los campos del formulario y actualiza la reseña si son correctos
 */
export default {
    data() {
        return {
            user: '',
            title: '',
            message: '',
            score: 1,
            videogame: '',
            error: '',
            preview: false,
            games: null,
            menuVideogames: false,
            menuScore: false,
            fieldSize: 0,
            contentPreview: '',
            submit: false,
            videogamesSelected: null,
            result: null,
            API_UPDATE_REVIEW: API + "/review/" + this.$route.params.id,
            API_REVIEW: API + "/review/" + this.$route.params.id,
        }
    },
    mounted() {
        this.callAPI()
        localStorage.setItem('path','actualizar-review')
        localStorage.removeItem('method')
    },
    watch: {
        message(newValue, oldValue) {
            this.contentPreview = marked(newValue);
            this.checkFields()
        },
        videogame(newValue, oldValue) {
            this.checkFields()
        },
        title(newValue, oldValue) {
            this.checkFields()
        },
    },
    methods: {
        async callAPI() {
            const response = await fetch(this.API_REVIEW)
            const data = await response.json()
            if (response.status == 404 || response.status == 400) {
                this.$router.push('/404');
                return null
            }
            this.result = data
            this.title = data.title
            this.message = data.message
            this.score = data.score
            this.videogame = data.videogame
            this.user = data.user
        },
        async updatedReview() {
            if (!this.submit)
                return null;
                
            await axios.put(this.API_UPDATE_REVIEW, {
                title: this.title,
                message: this.message,
                videogame: this.videogame,
                score: this.score,
                user: this.user
            }, {
                headers:
                {
                    'Authorization': `Bearer ${localStorage.getItem('tokenjwt')}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
                .then((response) => {
                    this.listenToast('Actualizaste la reseña satisfactoriamente', 'success')
                    this.$router.push('/review/' + response.data.id)
                })
                .catch(error => {
                    if (error.response.data.message == 'Mensaje no válido')
                        this.error = 'Descripción de la reseña demasiado corto o largo'
                    else if (error.response.data.message == 'Título no válido')
                        this.error = 'Título demasiado corto'
                    else {
                        this.error = 'Hubo un error en la creación de la review'
                    }
                })
        },
        listenMenuVideogame() {
            this.menuVideogames = !this.menuVideogames
        },
        listenScore(value) {
            this.score = value;
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
        },
        selectVideogame(value) {
            this.videogame = value
        },
        checkFields() {
            if (this.title != '' && this.message != '' && this.videogame != '') {
                this.submit = true
            } else {
                this.submit = false
            }
        },
        listenToast(message, title) {
            this.$emit('listenToast', message, title)
        }
    },
}
</script>

<template>
    <main class="main">
        <div class="container">
            <h1 class="main__title">Actualizar reseña</h1>
            <form class="main__form" @submit.prevent="updatedReview">
                <div class="main__form__group">
                    <nav class="main__form__nav">
                        <a href="#" class="main__form__nav__link" :class="!preview ? 'main__form__nav__link__active' : ''"
                            @click.stop @click="listenPreview(false)">
                            <span class="main__form__nav__link__icon material-symbols-outlined">rate_review</span>
                            Escribir
                        </a>
                        <a href="#" class="main__form__nav__link" :class="preview ? 'main__form__nav__link__active' : ''"
                            @click.stop @click="listenPreview(true)">
                            <span class="main__form__nav__link__icon material-symbols-outlined">Auto_Stories</span>
                            Visualizar
                        </a>
                    </nav>
                    <div class="main__form__group__subgroup">
                        <div class="main__form__field">
                            <input class="main__form__field__input" type="text" placeholder="Título" aria-label="title"
                                :value="title" @input="event => title = event.target.value" maxlength="50" />
                            <p class="main__form__field__count">{{ title.length }}/50</p>
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
                                ref="textArea" aria-label="text" :value="message"
                                @input="event => message = event.target.value" />
                        </div>
                        <div v-else class="main__form__field main__form__field--preview" ref="preview"
                            :style="{ height: fieldSize + 'px' }">
                            <div class="main__form__field__header main__form__field__header">
                                <div class="main__form__field__header__nav">
                                    <span
                                        class="main__form__field__header__nav__item main__form__field__header__nav__item--preview material-symbols-outlined">format_h1</span>
                                </div>
                                Visualizador
                            </div>
                            <div class="main__form__field__content" v-html="contentPreview"></div>
                        </div>
                        <div class="main__form__info">
                            <p class="main__form__info__text">{{ error }}</p>
                            <input class="main__form__info__button"
                                :class="{ 'main__form__info__button__disabled': !submit }" type="submit" value="Publicar">
                        </div>
                    </div>
                </div>
                <div class="main__form__option">
                    <div class="main__form__option__section">
                        <p class="main__form__option__section__title">Videojuego</p>
                        <p class="main__form__option__section__result"> 
                            {{ videogame.name ? videogame.name : 'No seleccionado' }}
                        </p>
                        <a class="main__form__option__section__icon material-symbols-outlined" href="#"
                            @click="listenMenuVideogame">settings</a>
                        <FilterGamesMenu v-if="menuVideogames" v-click-away="listenMenuVideogame"
                            :videogamesSelected.sync="videogamesSelected" @addVideogame="null" @deleteVideogame="null"
                            :videogame.sync="videogame" @selectVideogame="selectVideogame"
                            @listenMenuVideogame="listenMenuVideogame" />
                    </div>
                    <div class="main__form__option__section">
                        <p class="main__form__option__section__title">Puntuación</p>
                        <div class="main__form__option__section__score">
                            <BrowserMenuScore @listenScore="listenScore" :score.sync="score" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
</main></template>