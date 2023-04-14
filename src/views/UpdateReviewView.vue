<script>
import axios from 'axios'
import {API} from '../util'

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
            title: '',
            message: '',
            score: '',
            videogame: '',
            errorTitle: '',
            errorMessage: '',
            errorScore: '',
            errorVideogame: '',
            focusTitle: false,
            focusMessage: false,
            focusScore: false,
            focusVideogame: false,
            games: null,
            API_GAMES: API + "/api/v1/games",
            API_REVIEW: API + "/api/v1/reviews/" + this.$route.params.id,
            API_UPDATE_REVIEW: API + "/api/v1/auth/reviews/" + this.$route.params.id,
            scoreValidation: /^(?:[0-5](?:\.[0-9])?|\.[0-9])$/,
        }
    },
    mounted() {
        this.callAPIGames(),
            this.callAPI()
    },
    methods: {
        async callAPI() {
            const response = await fetch(this.API_REVIEW)
            const data = await response.json()
            this.title = data.title
            this.message = data.message
            this.score = data.score
            this.videogame = data.videogame
        },
        async callAPIGames() {
            const response = await fetch(this.API_GAMES)
            const data = await response.json()
            this.games = data
        },
        async updateReview() {
            let userId = localStorage.getItem('userId')
            const response = await axios.put(this.API_UPDATE_REVIEW, {
                id: this.$route.params.id,
                title: this.title,
                message: this.message,
                videogame: this.videogame,
                score: this.score,
                user: userId
            }, { withCredentials: true })
            if (response.status === 200) {
                const currentPath = this.$route.path
                if (currentPath.includes('/perfil')) {
                    this.$router.push('/perfil/review/' + this.$route.params.id)
                } else {
                    this.$router.push('/review/' + this.$route.params.id)
                }
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
                this.updateReview()
            }
        }
    },
}
</script>

<template>
    <main class="main">
        <h1 class="main__title">MODIFICAR RESEÑA</h1>
        <div class="main__background">
            <img className="main__background__img" src="/src/assets/img/background.jpeg" />
            <div className="main__background__opacity" />
        </div>
        <form class="main__form" @submit.prevent="checkFields">
            <div class="main__form__group">
                <div class="main__form__field">
                    <input class="main__form__field__input" type="text" placeholder="Título" aria-label="title"
                        :value="title" @input="event => title = event.target.value" maxlength="50"
                        :class="{ main__form__field__input__warning: errorTitle }" @focus="focusTitle = true"
                        @blur="focusTitle = false" />
                    <span class="main__form__field__square"
                        :class="{ main__form__field__square__active: errorTitle && focusTitle }" />
                    <p class="main__form__field__error"
                        :class="{ main__form__field__error__active: errorTitle && focusTitle }">{{
                            errorTitle
                        }}</p>
                </div>

                <div class="main__form__field">
                    <input class="main__form__field__input" type="number" placeholder="Nota" aria-label="score" step="any"
                        :value="score" @input="event => score = event.target.value" @focus="focusScore = true"
                        :class="{ main__form__field__input__warning: errorScore }" @blur="focusScore = false" />
                    <span class="main__form__field__square"
                        :class="{ main__form__field__square__active: errorScore && focusScore }" />
                    <p class="main__form__field__error main__form__field__error__square"
                        :class="{ main__form__field__error__active: errorScore && focusScore }">{{
                            errorScore
                        }}</p>
                </div>

                <div class="main__form__field">
                    <select class="main__form__field__select" name="videogames" @focus="focusVideogame = true"
                        @blur="focusVideogame = false" :class="{ main__form__field__select__warning: errorVideogame }"
                        :value="videogame" @input="event => videogame = event.target.value">
                        <option value="" selected>VIDEOJUEGOS</option>
                        <option value="">- - - - -</option>
                        <option v-for="d in games" :value="d.id">{{ d.name }}</option>
                    </select>
                    <span class="session__field__square"
                        :class="{ session__field__square__active: errorVideogame && focusVideogame }" />
                    <p class="session__field__error"
                        :class="{ session__field__error__active: errorVideogame && focusVideogame }">{{
                            errorVideogame
                        }}</p>
                </div>
            </div>
            <div class="main__form__field">
                <textarea class="main__form__field__textarea" type="text" placeholder="Texto" aria-label="text"
                    :value="message" @input="event => message = event.target.value" @focus="focusMessage = true"
                    @blur="focusMessage = false" :class="{ main__form__field__textarea__warning: errorMessage }" />
                <span class="main__form__field__square__textarea"
                    :class="{ main__form__field__square__textarea__active: errorMessage && focusMessage }" />
                <p class="main__form__field__error__textarea"
                    :class="{ main__form__field__error__textarea__active: errorMessage && focusMessage }">{{
                        errorMessage
                    }}</p>
            </div>
            <input class="main__form__button" type="submit" value="EDITAR RESEÑA">
        </form>
    </main>
</template>