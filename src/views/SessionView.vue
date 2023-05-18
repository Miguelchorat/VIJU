<script setup>
import { RouterLink } from 'vue-router';

</script>

<script>
export default {

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
            number: 0
        }
    },
    created() {
        this.number = Math.floor(Math.random() * this.phrases.length)
    },
    methods: {
        listenSession() {
            this.session = !this.session
        },
        listenVisibility() {
            this.visibility = !this.visibility
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
                    <form v-if="session" class="main__session__form__signin" @submit.prevent="">
                        <div class="main__session__form__signin__field">
                            <span class="main__session__form__signin__field__icon material-symbols-sharp">mail</span>
                            <input class="main__session__form__signin__field__input" type="email" placeholder="Correo"
                                aria-label="email" />
                        </div>
                        <div class="main__session__form__signin__field">
                            <span class="main__session__form__signin__field__icon material-symbols-sharp">lock</span>
                            <input class="main__session__form__signin__field__input"
                                :type="visibility ? 'text' : 'password'" placeholder="Contraseña" aria-label="password" />
                            <a href="#" class="main__session__form__signin__field__icon material-symbols-sharp"
                                @click="listenVisibility">
                                {{ visibility ? 'visibility_off' : 'visibility' }}
                            </a>
                        </div>
                        <input class="main__session__form__signin__button" type="submit" value="INICIAR SESIÓN">
                    </form>
                    <form v-if="!session" class="main__session__form__signin" @submit.prevent="">
                        <div class="main__session__form__signin__field">
                            <span class="main__session__form__signin__field__icon material-symbols-sharp">mail</span>
                            <input class="main__session__form__signin__field__input" type="email" placeholder="Correo"
                                aria-label="email" />
                        </div>
                        <div class="main__session__form__signin__field">
                            <span class="main__session__form__signin__field__icon material-symbols-sharp">face</span>
                            <input class="main__session__form__signin__field__input" type="text"
                                placeholder="Nombre de usuario" aria-label="username" />
                        </div>
                        <div class="main__session__form__signin__field">
                            <span class="main__session__form__signin__field__icon material-symbols-sharp">lock</span>
                            <input class="main__session__form__signin__field__input"
                                :type="visibility ? 'text' : 'password'" placeholder="Contraseña" aria-label="password" />
                            <a href="#" class="main__session__form__signin__field__icon material-symbols-sharp"
                                @click="listenVisibility">
                                {{ visibility ? 'visibility_off' : 'visibility' }}
                            </a>
                        </div>
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