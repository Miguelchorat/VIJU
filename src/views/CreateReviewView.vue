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
export default {
    data() {
        return {
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
            API_CREATE_REVIEW: API + "/review",
        }
    },
    created(){
        localStorage.setItem('path','crear-review')
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
        async createdReview() {
            if(!this.submit)
                return null;
            try {
                await axios.post(this.API_CREATE_REVIEW, {
                    title: this.title,
                    message: this.message,
                    videogame: this.videogame,
                    score: this.score
                }, { 
                    headers: 
                    {
                        'Authorization': `Bearer ${localStorage.getItem('tokenjwt')}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true 
                })
                    .then((response) => {
                        this.listenToast('Creaste la reseña satisfactoriamente','success')
                        this.$router.push('/review/' + response.data.id)
                    })
                    .catch(error => {
                        if(error.response.data.message == 'Mensaje no válido')
                            this.error = 'Descripción de la reseña demasiado corto o largo'
                        else if(error.response.data.message == 'Título no válido')
                            this.error = 'Título demasiado corto'
                        else{                    
                            this.error = 'Hubo un error en la creación de la review'
                        }
                    })
            } catch (error) {
                this.listenToast('Hubo un error en la creación de la review','warning')
            }
            
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
        selectVideogame(value){
            this.videogame = value
        },
        checkFields(){
            if (this.title != '' && this.message != '' && this.videogame != ''){
                this.submit = true
            } else {
                this.submit = false
            }
        },
        listenToast(message,title){
            this.$emit('listenToast',message,title)
        }
    },
}
</script>

<template>
    <main class="main">
        <div class="container">
            <h1 class="main__title">Crear una reseña</h1>
            <form class="main__form" @submit.prevent="createdReview">
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
                                @input="event => message = event.target.value"/>
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
                            <p class="main__form__info__text">{{error}}</p>
                            <input class="main__form__info__button" :class="{ 'main__form__info__button__disabled' : !submit}" type="submit" value="Publicar">
                        </div>
                    </div>
                </div>
                <div class="main__form__option">
                    <div class="main__form__option__section">
                        <p class="main__form__option__section__title">Videojuego</p>
                        <p class="main__form__option__section__result">  {{ videogame.name ? videogame.name : 'No seleccionado' }}</p>
                        <a class="main__form__option__section__icon material-symbols-outlined" href="#"
                            @click="listenMenuVideogame">settings</a>
                        <FilterGamesMenu v-if="menuVideogames" v-click-away="listenMenuVideogame"
                            :videogamesSelected.sync="videogamesSelected" @addVideogame="null"
                            @deleteVideogame="null" :videogame.sync="videogame" @selectVideogame="selectVideogame" @listenMenuVideogame="listenMenuVideogame"/>
                    </div>
                    <div class="main__form__option__section">
                        <p class="main__form__option__section__title">Puntuación</p>
                        <div class="main__form__option__section__score">
                            <BrowserMenuScore @listenScore="listenScore" :score="score" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </main>
</template>