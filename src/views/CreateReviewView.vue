<script>
import axios from 'axios'

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
            API_GAMES: "http://localhost:3001/api/v1/games",
            API_CREATE_REVIEW: "http://localhost:3001/api/v1/auth/reviews",
            scoreValidation: /^(?:[0-5](?:\.[0-9])?|\.[0-9])$/,
        }
    },
    methods: {
        async callAPIGames() {
            const response = await fetch(this.API_GAMES)
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
        }
    },
}
</script>

<template>
    <main class="main">
        <h1 class="main__title">CREAR RESEÑA</h1>
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
                    <select class="main__form__field__select" name="videogames" @click="callAPIGames"
                        @focus="focusVideogame = true" @blur="focusVideogame = false"
                        :class="{ main__form__field__select__warning: errorVideogame }"
                        @input="event => videogame = event.target.value">
                        <option value="" selected>VIDEOJUEGOS</option>
                        <option value="">- - - - -</option>
                        <option v-for="d in games" :value="d.id">{{ d.name }}</option>
                    </select><span class="session__field__square"
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
            <input class="main__form__button" type="submit" value="CREAR RESEÑA">
        </form>
    </main>
</template>