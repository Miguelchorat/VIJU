<script setup>
import axios from 'axios'
import { API } from '../util'
</script>

<script>

export default {
    props: ['message', 'title', 'active', 'type', 'email', 'username'],
    emits: ['listenDialog','listenToast','listenTrigger'],
    data() {
        return {
            select: '',
            errorUsername: '',
            errorEmail: '',
            errorPassword: '',
            errorPassword2: '',
            visibility: false,
            password: '',
            password2: '',
            API_UPDATE: API + "/user",
        }
    },
    created() {
        this.select = localStorage.getItem('avatar')
    },
    methods: {
        listenDialog(value) {
            this.$emit('listenDialog', value, this.select)
            this.clearFields()
        },
        listenSelect(value) {
            this.select = value
        },
        listenVisibility() {
            this.visibility = !this.visibility
        },
        clearFields() {
            this.password = ''
            this.password2 = ''
            this.errorEmail = ''
            this.errorUsername = ''
            this.errorPassword = ''
            this.errorPassword2 = ''
        },
        async updateAccount() {
            await axios.put(this.API_UPDATE, {
                username: this.username,
                email: this.email,
                password: this.password,
                password2: this.password2
            }, {
                withCredentials: true,
                headers:
                {
                    'Authorization': `Bearer ${localStorage.getItem('tokenjwt')}`,
                    'Content-Type': 'application/json'
                },
            })
                .then(response => {
                    this.listenDialog('close-ok')                    
                    localStorage.setItem('username',this.username)
                    this.$emit('listenToast', 'Has actualizado satisfactoriamente', 'success')                    
                    this.$emit('listenTrigger')
                    this.$router.push('/perfil/'+localStorage.getItem('username'))
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
                        this.$emit('listenToast', 'Hubo un error inesperado', 'warning')
                    }
                });
        },
        listenToast(message, title) {
            this.$emit('listenToast', message, title)
        },
    }
}
</script>

<template>
    <div v-if="active" class="dialog">
        <div class="dialog__group1">
            <h2 class="dialog__group1__title">{{ title }}</h2>
            <p v-if="type == 'confirm'" class="dialog__group1__message">{{ message }}</p>
        </div>

        <div v-if="type == 'avatarEdit'" class="dialog__group3">
            <img class="dialog__group3__img" :class="select == '1.svg' ? 'dialog__group3__img__active' : ''"
                src="../assets/img/avatar/1.svg" alt="" @click="listenSelect('1.svg')">
            <img class="dialog__group3__img" :class="select == '2.svg' ? 'dialog__group3__img__active' : ''"
                src="../assets/img/avatar/2.svg" alt="" @click="listenSelect('2.svg')">
            <img class="dialog__group3__img" :class="select == '3.svg' ? 'dialog__group3__img__active' : ''"
                src="../assets/img/avatar/3.svg" alt="" @click="listenSelect('3.svg')">
            <img class="dialog__group3__img" :class="select == '4.svg' ? 'dialog__group3__img__active' : ''"
                src="../assets/img/avatar/4.svg" alt="" @click="listenSelect('4.svg')">
        </div>

        <form v-if="type == 'userEdit'" class="dialog__group4" @submit.prevent="">
            <div class="dialog__group4__field">
                <span class="dialog__group4__field__icon material-symbols-sharp">mail</span>
                <input class="dialog__group4__field__input" type="email" placeholder="Correo" aria-label="email"
                    :value="email" @input="event => email = event.target.value" name="emailSignup"
                    @focus="errorEmail = ''" />
            </div>
            <label v-if="errorEmail" for="emailSignup" class="dialog__group4__label">{{ errorEmail
            }}</label>
            <div class="dialog__group4__field">
                <span class="dialog__group4__field__icon material-symbols-sharp">face</span>
                <input class="dialog__group4__field__input" type="text" placeholder="Nombre de usuario"
                    aria-label="username" :value="username" @input="event => username = event.target.value"
                    name="usernameSignup" @focus="errorUsername = ''" />
            </div>
            <label v-if="errorUsername" for="usernameSignup" class="dialog__group4__label">{{
                errorUsername }}</label>
            <div class="dialog__group4__field">
                <span class="dialog__group4__field__icon material-symbols-sharp">lock</span>
                <input class="dialog__group4__field__input" :type="visibility ? 'text' : 'password'"
                    placeholder="Contraseña" aria-label="password" :value="password"
                    @input="event => password = event.target.value" name="passwordSignup" @focus="errorPassword = ''" />
                <a href="#" class="dialog__group4__field__icon material-symbols-sharp" @click="listenVisibility"
                    tabindex="-1">
                    {{ visibility ? 'visibility_off' : 'visibility' }}
                </a>
            </div>
            <label v-if="errorPassword" for="passwordSignup" class="dialog__group4__label">{{
                errorPassword }}</label>
            <div class="dialog__group4__field">
                <span class="dialog__group4__field__icon material-symbols-sharp">lock</span>
                <input class="dialog__group4__field__input" :type="visibility ? 'text' : 'password'"
                    placeholder="Repetir contraseña" aria-label="repeat-password" :value="password2"
                    @input="event => password2 = event.target.value" name="password2Signup" @focus="errorPassword2 = ''" />
                <a href="#" class="dialog__group4__field__icon material-symbols-sharp" @click="listenVisibility"
                    tabindex="-1">
                    {{ visibility ? 'visibility_off' : 'visibility' }}
                </a>
            </div>
        </form>
        <div class="dialog__group2">
            <a href="#" class="dialog__group2__button dialog__group2__button__active"
                @click="listenDialog('close')">Cancelar</a>
            <a v-if="type != 'userEdit'" href="#" class="dialog__group2__button" @click="listenDialog('close-ok')">Aceptar</a>
            <a v-else href="#" class="dialog__group2__button" @click="updateAccount">Aceptar</a>
        </div>
    </div>
    <div v-if="active" class="dialog__screen" @click="listenDialog('close')"></div>
</template>
