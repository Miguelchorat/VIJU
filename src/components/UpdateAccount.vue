<script>
import axios from 'axios'
import {API} from '../util'
/**
 * Componente para actualizar la información del usuario
 * @vue-prop {boolean} menu - Objeto que representa el menú
 * @vue-data {string} password - Contraseña del usuario
 * @vue-data {string} repeatPassword - Repetición de la contraseña del usuario
 * @vue-data {string} date - Fecha de nacimiento del usuario
 * @vue-data {boolean} errorPassword - Indicador de error en el campo de contraseña
 * @vue-data {boolean} errorRepeatPassword - Indicador de error en el campo de repetición de contraseña
 * @vue-data {boolean} errorDate - Indicador de error en el campo de fecha de nacimiento
 * @vue-data {boolean} focusPassword - Indicador de enfoque en el campo de contraseña
 * @vue-data {boolean} focusRepeatPassword - Indicador de enfoque en el campo de repetición de contraseña
 * @vue-data {boolean} focusDate - Indicador de enfoque en el campo de fecha de nacimiento
 * @vue-data {boolean} visibility - Indicador de visibilidad de la contraseña
 * @vue-data {boolean} visibilityRepeat - Indicador de visibilidad de la repetición de contraseña
 * @vue-data {string} API_UPDATE_USER - URL de la API para actualizar la información del usuario
 * @vue-data {RegExp} emailValidation - Expresión regular para validar el formato del correo electrónico
 * @vue-data {RegExp} passwordValidation - Expresión regular para validar el formato de la contraseña
 * @vue-data {RegExp} usernameValidation - Expresión regular para validar el formato del nombre de usuario
 * @vue-data {Date} MIN_AGE_LIMIT - Fecha mínima permitida para el campo de fecha de nacimiento (13 años atrás)
 * @vue-data {Date} MAX_AGE_LIMIT - Fecha máxima permitida para el campo de fecha de nacimiento (120 años atrás)
 * @vue-event listenRemember - Cambia el valor de remember
 * @vue-event listenVisibility - Cambia el valor de visibility
 * @vue-event listenVisibilityRepeat - Cambia el valor de visibilityRepeat
 * @vue-event async updateAccount - Actualiza un usuario en el servidor
 * @vue-event checkFields - Valida los campos del formulario y actualiza el usuario si son correctos
 */
export default {
    props: ['menu'],

    data() {
        return {
            password: '',
            repeatPassword: '',
            date: '',
            errorPassword: false,
            errorRepeatPassword: false,
            errorDate: false,
            focusPassword: false,
            focusRepeatPassword: false,
            focusDate: false,
            visibility: false,
            visibilityRepeat: false,
            API_UPDATE_USER: API + "/api/v1/auth/users/id=",
            emailValidation: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            passwordValidation: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/,
            usernameValidation: /^[a-zA-Z]{3,18}$/,
            MIN_AGE_LIMIT: new Date(Date.now()).getFullYear() - 13,
            MAX_AGE_LIMIT: new Date(Date.now()).getFullYear() - 120
        }
    },
    methods: {
        listenRemember() {
            this.remember = !this.remember
        },
        listenVisibility() {
            this.visibility = !this.visibility
        },
        async updateAccount() {
            const encoder = new TextEncoder();
            const data = encoder.encode(this.password);
            const digest = await crypto.subtle.digest('SHA-1', data);
            const hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');

            await axios.put(this.API_UPDATE_USER + localStorage.getItem("userId"), {
                id: localStorage.getItem("userId"),
                date: this.date,
                password: hash
            }, { withCredentials: true })
                .then(response => {
                    this.$emit('listenMenu')
                    this.$emit('checkUser')
                })
                .catch(error => {
                    console.error("Fallo al enviar el form" + error)
                });
        },
        checkFields() {
            let check = 0
            this.errorPassword = ''
            this.errorRepeatPassword = ''
            this.errorDate = ''

            if (this.passwordValidation.test(this.password)) {
                check++
            } else {
                this.errorPassword = 'La contraseña no es válida. Debe contener al menos 8 caracteres y un número.'
            }

            if (this.repeatPassword !== "" && this.repeatPassword === this.password) {
                check++
            } else {
                this.errorRepeatPassword = 'Las contraseñas no son iguales'
            }
            if (this.date !== '' && (new Date(this.date).getFullYear() < this.MIN_AGE_LIMIT && new Date(this.date).getFullYear() > this.MAX_AGE_LIMIT)) {
                check++
            } else {
                this.errorDate = 'La fecha no es válida'
            }

            if (check == 3) {
                this.updateAccount()
            }
        }
    }
}
</script>

<template>
    <form class="session" @submit.prevent="checkFields">
        <a class="session__close material-symbols-outlined" href="#" @click="() => $emit('listenMenu')">close</a>
        <h2 class="session__title">MODIFICAR</h2>
        <div class="session__field">
            <input class="session__field__input" :class="{ session__field__input__warning: errorPassword }"
                :value="password" @input="event => password = event.target.value" placeholder="Nueva contraseña"
                :type="visibility ? 'text' : 'password'" aria-label="password" maxlength="32" @focus="focusPassword = true"
                @blur="focusPassword = false" />
            <span class="session__field__icon material-symbols-outlined" @click="listenVisibility">{{
                visibility ?
                'visibility_off' : 'visibility'
            }}</span>
            <span class="session__field__square"
                :class="{ session__field__square__active: errorPassword && focusPassword }" />
            <p class="session__field__error" :class="{ session__field__error__active: errorPassword && focusPassword }">
                {{ errorPassword }}</p>
        </div>
        <div class="session__field">
            <input class="session__field__input" :class="{ session__field__input__warning: errorRepeatPassword }"
                :value="repeatPassword" @input="event => repeatPassword = event.target.value"
                placeholder="Repetir contraseña" :type="visibilityRepeat ? 'text' : 'password'" aria-label="repeat-password"
                maxlength="32" @focus="focusRepeatPassword = true" @blur="focusRepeatPassword = false" />
            <span class="session__field__icon material-symbols-outlined" @click="listenVisibilityRepeat">{{
                visibilityRepeat ? 'visibility_off' : 'visibility'
            }}</span>
            <span class="session__field__square"
                :class="{ session__field__square__active: errorRepeatPassword && focusRepeatPassword }" />
            <p class="session__field__error"
                :class="{ session__field__error__active: errorRepeatPassword && focusRepeatPassword }">{{
                    errorRepeatPassword
                }}</p>
        </div>
        <div class="session__field">
            <input class="session__field__input" type="date" :class="{ session__field__input__warning: errorDate }"
                aria-label="date" :value="date" @input="event => date = event.target.value"
                @focus="focusDate = true" @blur="focusDate = false" />
            <span class="session__field__square" :class="{ session__field__square__active: errorDate && focusDate }" />
            <p class="session__field__error" :class="{ session__field__error__active: errorDate && focusDate }">{{
                errorDate
            }}</p>
        </div>
        <input class="session__button" type="submit" value="MODIFICAR">
    </form>
</template>