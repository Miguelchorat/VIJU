<script>

import axios from 'axios'
import {API} from '../util'
/**
 * Componente que representa el formulario de inicio de sesión de un usuario.
 * @vue-prop {Boolean} menu - Indica si el menú de la aplicación está activo o no.
 * @vue-prop {Boolean} account - Indica si la cuenta del usuario está activa o no.
 * @vue-prop {Boolean} session - Indica si la sesión del usuario está activa o no.
 * @vue-prop {Number} userId - ID del usuario que está iniciando sesión.
 * @vue-data {String} email - Correo electrónico del usuario para iniciar sesión.
 * @vue-data {String} password - Contraseña del usuario para iniciar sesión.
 * @vue-data {String} errorEmail - Mensaje de error para el correo electrónico.
 * @vue-data {String} errorPassword - Mensaje de error para la contraseña.
 * @vue-data {String} errorSession - Mensaje de error para la sesión del usuario.
 * @vue-data {Boolean} visibility - Indica si la contraseña es visible o no.
 * @vue-data {Boolean} focusEmail - Indica si el campo de correo electrónico está enfocado o no.
 * @vue-data {Boolean} focusPassword - Indica si el campo de contraseña está enfocado o no.
 * @vue-data {String} API_LOGIN - URL de la API para iniciar sesión.
 * @vue-data {RegExp} emailValidation - Expresión regular para validar correos electrónicos.
 * @vue-data {RegExp} passwordValidation - Expresión regular para validar contraseñas.
 * @vue-event {Function} changeSession - Evento que se emite cuando la sesión del usuario cambia.
 * @vue-event {Function} changeUserId - Evento que se emite cuando el ID del usuario cambia.
 * @vue-event {Function} checkUser - Evento que se emite para verificar al usuario.
 * @vue-event {Function} listenAccount - Evento que se emite para escuchar la cuenta del usuario.
 * @vue-event {Function} listenMenu - Evento que se emite para escuchar el menú de la aplicación.
 */
export default {
    props: ['menu', 'account', 'session', 'userId'],

    data() {
        return {
            email: '',
            password: '',
            errorEmail: '',
            errorPassword: '',
            errorSession: '',
            visibility: false,
            focusEmail: false,
            focusPassword: false,
            API_LOGIN: API + "/api/v1/auth/users/",
            emailValidation: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            passwordValidation: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/
        }
    },
    methods: {
        listenRemember() {
            this.remember = !this.remember
        },
        listenVisibility() {
            this.visibility = !this.visibility
        },
        async loginAccount() {
            const encoder = new TextEncoder();
            const data = encoder.encode(this.password);
            const digest = await crypto.subtle.digest('SHA-1', data);
            const hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');

            await axios.post(this.API_LOGIN, {
                email: this.email,
                password: hash
            }, { withCredentials: true })
            .then(response => {
                this.$emit('changeSession', true)  
                this.$emit('changeUserId', response.data)                     
                this.$emit('checkUser')                                
                this.$emit('listenAccount')
                this.$emit('listenMenu', 0)                
            })
            .catch(error => {
                if (error.response.status === 401) {
                    this.errorSession = 'El correo o contraseña no es correcta'
                }
            })
        },
        checkFields() {
            let check = 0
            this.errorEmail = ''
            this.errorPassword = ''
            this.errorSesion = ''

            if (this.emailValidation.test(this.email)) {
                check++
            } else {
                this.errorEmail = 'El correo no es válido'
            }

            if (this.passwordValidation.test(this.password)) {
                check++
            } else {
                this.errorPassword = 'La contraseña no es válida. Debe contener al menos 8 caracteres y un número.'
            }

            if (check == 2) {
                this.loginAccount()
            }
        }
    }
}
</script>
<template>
    <form class="session" @submit.prevent="checkFields">
        <a class="session__close material-symbols-outlined" href="#" @click="() => $emit('listenMenu')">close</a>
        <h2 class="session__title">INICIAR SESIÓN</h2>
        <div class="session__field">
            <input class="session__field__input" :class="{ session__field__input__warning: errorEmail || errorSession }" type="email"
                placeholder="Correo" aria-label="email" :value="email" @input="event => email = event.target.value"
                @focus="focusEmail = true" @blur="focusEmail = false" />
            <span class="session__field__square" :class="{ session__field__square__active: errorEmail && focusEmail }" />
            <p class="session__field__error" :class="{ session__field__error__active: errorEmail && focusEmail }">{{
                errorEmail
            }}</p>
            <span class="session__field__square" :class="{ session__field__square__active: errorSession && focusEmail }" />
            <p class="session__field__error" :class="{ session__field__error__active: errorSession && focusEmail }">{{
                errorSession
            }}</p>
        </div>
        <div class="session__field">
            <input class="session__field__input" :class="{ session__field__input__warning: errorPassword }"
                :value="password" @input="event => password = event.target.value" placeholder="Contraseña"
                :type="visibility ? 'text' : 'password'" aria-label="password" maxlength="20" 
                @focus="focusPassword = true" @blur="focusPassword = false"/>
            <span class="session__field__icon material-symbols-outlined" @click="listenVisibility">{{
                visibility ?
                'visibility_off' : 'visibility'
            }}</span>
            <span class="session__field__square"
                :class="{ session__field__square__active: errorPassword && focusPassword }" />
            <p class="session__field__error" :class="{ session__field__error__active: errorPassword && focusPassword }">
                {{ errorPassword }}</p>
        </div>
        <input class="session__button" type="submit" value="INICIAR SESIÓN">
        <div class="session__signin">
            <label class="session__signin__label">¿No tienes cuenta?</label>
            <a href="#" class="session__signin__link" @click="() => $emit('listenMenu', 2)">Create una</a>
        </div>
    </form>
</template>