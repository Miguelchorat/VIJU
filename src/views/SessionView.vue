<script setup>
import { RouterLink } from 'vue-router';
import Toast from '../components/Toast.vue'
import axios from 'axios'
import { API } from '../util'

</script>

<script>
export default {
    components: {
        Toast
    },
    emits: ['listenTrigger','listenToast'],
    data() {
        return {
            session: true,
            visibility: false,
            phrases: [
                ['"Ningún rey gobierna para siempre, hijo mío"', '-Terenas Menethil II'],
                ['"¡No estáis preparados!"', '-Illidan Tempestira'],
                ['"¡Es peligroso ir por allí solo! Toma ésto."', '-Sabio'],
                ['"No lo sientas, debes mejorar"', '-Kratos'],
                ['"La mitad de lo que conocemos es mentira. La otra mitad es una mentira bien construida"', '-Big Boss']
            ],
            number: 0,
            email: '',
            password: '',
            password2: '',
            username: '',
            errorUsername: '',
            errorEmail: '',
            errorPassword: '',
            errorPassword2: '',
            API_REGISTER: API + "/user",
            API_LOGIN: API + "/auth/login",
        }
    },
    created() {
        this.number = Math.floor(Math.random() * this.phrases.length)
        localStorage.setItem('path','session')
        localStorage.removeItem('method')
    },
    methods: {
        listenSession() {
            this.session = !this.session
            this.clearFields()
        },
        listenVisibility() {
            this.visibility = !this.visibility
        },
        clearFields() {
            this.email = ''
            this.username = ''
            this.password = ''
            this.password2 = ''
            this.errorEmail = ''
            this.errorUsername = ''
            this.errorPassword = ''
            this.errorPassword2 = ''
            this.visibility = false
        },
        async registerAccount() {
            await axios.post(this.API_REGISTER, {
                username: this.username,
                email: this.email,
                password: this.password,
                password2: this.password2
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    this.listenSession()
                    this.$emit('listenToast','Te has registrado satisfactoriamente','success')
                })
                .catch(error => {
                    let e = error.response.data.message
                    if (e == 'Las contraseñas no coinciden') {
                        this.errorPassword2 = e
                    }
                    else if (e == 'El nombre de usuario y el correo electrónico ya existen') {
                        this.errorUsername = 'El nombre de usuario ya existe'
                        this.errorEmail = 'El correo electronico ya existe'
                    }
                    else if (e == 'El nombre de usuario ya existe') {
                        this.errorUsername = e
                    }
                    else if (e == 'El correo electrónico ya existe') {
                        this.errorEmail = e
                    }
                    else if (e == 'Correo electrónico no válido') {
                        this.errorEmail = e
                    }
                    else if (e == 'Nombre de usuario no válido') {
                        this.errorUsername = e
                    }
                    else if (e == 'Contraseña no válida') {
                        this.errorPassword = e
                    }
                    else {
                        this.$emit('listenToast','Hubo un error inesperado','warning')
                    }
                });
        },
        async login() {
            await axios.post(this.API_LOGIN, {
                username: this.username,
                password: this.password
            }, { withCredentials: true })
                .then(response => {
                    localStorage.setItem('tokenjwt', response.data.token);
                    localStorage.setItem('username', response.data.username);
                    localStorage.setItem('avatar', response.data.avatar);
                    this.$emit('listenTrigger')
                    this.$router.push('/')
                })
                .catch(error => {
                    if (error.response.data.message == "Bad credentials")
                        this.errorUsername = 'Usuario o contraseña incorrecta'
                    else if (error.response.data.message == 'Nombre de usuario no válido') {
                        this.errorUsername = 'Nombre de usuario no válido'
                    }
                    else if (error.response.data.message == 'Contraseña no válida') {
                        this.errorPassword = 'Contraseña no válida'
                    }
                    else {
                        this.$emit('listenToast','Hubo un error inesperado','warning')
                    }
                })
        }
    }
}
</script>

<template>
    <main class="main main--session">
        <div class="container container--session">
            <img class="main__img" src="../assets/img/final.jpg" alt="">
            <section class="main__session">
                <RouterLink to="/"><img class="main__session__logo" src="../assets/img/logo.svg" alt=""></RouterLink>
                <article class="main__session__form">
                    <div class="main__session__form__tab">
                        <a class="main__session__form__tab__link"
                            :class="{ main__session__form__tab__link__active: session }" href="#"
                            @click="listenSession">INICIAR SESIÓN</a>
                        <a class="main__session__form__tab__link"
                            :class="{ main__session__form__tab__link__active: !session }" href="#"
                            @click="listenSession">REGISTRARSE</a>
                    </div>
                    <form v-if="session" class="main__session__form__signin" @submit.prevent="login">
                        <div class="main__session__form__signin__field">
                            <span class="main__session__form__signin__field__icon material-symbols-sharp">face</span>
                            <input class="main__session__form__signin__field__input" type="text"
                                placeholder="Nombre de usuario" aria-label="usernameSignin" name="usernameSignin"
                                :value="username" @input="event => username = event.target.value"
                                @focus="errorUsername = ''" />
                        </div>
                        <label v-if="errorUsername" for="usernameSignin" class="main__session__form__signin__label">
                            {{ errorUsername }}
                        </label>
                        <div class="main__session__form__signin__field">
                            <span class="main__session__form__signin__field__icon material-symbols-sharp">lock</span>
                            <input class="main__session__form__signin__field__input"
                                :type="visibility ? 'text' : 'password'" placeholder="Contraseña"
                                aria-label="passwordSignin" :value="password"
                                @input="event => password = event.target.value" name="passwordSignin"
                                @focus="errorPassword = ''" />
                            <a href="#" class="main__session__form__signin__field__icon material-symbols-sharp"
                                @click="listenVisibility" tabindex="-1">
                                {{ visibility ? 'visibility_off' : 'visibility' }}
                            </a>
                        </div>
                        <label v-if="errorPassword" for="passwordSignin" class="main__session__form__signin__label">
                            {{ errorPassword }}
                        </label>
                        <input class="main__session__form__signin__button" type="submit" value="INICIAR SESIÓN">
                    </form>
                    <form v-if="!session" class="main__session__form__signin" @submit.prevent="registerAccount">
                        <div class="main__session__form__signin__field">
                            <span class="main__session__form__signin__field__icon material-symbols-sharp">mail</span>
                            <input class="main__session__form__signin__field__input" type="email" placeholder="Correo"
                                aria-label="email" :value="email" @input="event => email = event.target.value"
                                name="emailSignup" @focus="errorEmail = ''" />
                        </div>
                        <label v-if="errorEmail" for="emailSignup" class="main__session__form__signin__label">{{ errorEmail
                        }}</label>
                        <div class="main__session__form__signin__field">
                            <span class="main__session__form__signin__field__icon material-symbols-sharp">face</span>
                            <input class="main__session__form__signin__field__input" type="text"
                                placeholder="Nombre de usuario" aria-label="username" :value="username"
                                @input="event => username = event.target.value" name="usernameSignup"
                                @focus="errorUsername = ''" />
                        </div>
                        <label v-if="errorUsername" for="usernameSignup" class="main__session__form__signin__label">{{
                            errorUsername }}</label>
                        <div class="main__session__form__signin__field">
                            <span class="main__session__form__signin__field__icon material-symbols-sharp">lock</span>
                            <input class="main__session__form__signin__field__input"
                                :type="visibility ? 'text' : 'password'" placeholder="Contraseña" aria-label="password"
                                :value="password" @input="event => password = event.target.value" name="passwordSignup"
                                @focus="errorPassword = ''" />
                            <a href="#" class="main__session__form__signin__field__icon material-symbols-sharp"
                                @click="listenVisibility" tabindex="-1">
                                {{ visibility ? 'visibility_off' : 'visibility' }}
                            </a>
                        </div>
                        <label v-if="errorPassword" for="passwordSignup" class="main__session__form__signin__label">{{
                            errorPassword }}</label>
                        <div class="main__session__form__signin__field">
                            <span class="main__session__form__signin__field__icon material-symbols-sharp">lock</span>
                            <input class="main__session__form__signin__field__input"
                                :type="visibility ? 'text' : 'password'" placeholder="Repetir contraseña"
                                aria-label="repeat-password" :value="password2"
                                @input="event => password2 = event.target.value" name="password2Signup"
                                @focus="errorPassword2 = ''" />
                            <a href="#" class="main__session__form__signin__field__icon material-symbols-sharp"
                                @click="listenVisibility" tabindex="-1">
                                {{ visibility ? 'visibility_off' : 'visibility' }}
                            </a>
                        </div>
                        <label v-if="errorPassword2" for="password2Signup" class="main__session__form__signin__label">{{
                            errorPassword2 }}</label>
                        <input class="main__session__form__signin__button" type="submit" value="REGISTRARSE">
                    </form>
                </article>
                <article class="main__session__phrase">
                    <p class="main__session__phrase__text">{{ phrases[number][0] }}<br>{{ phrases[number][1] }}</p>
                </article>
            </section>
        </div>
    </main>
</template>