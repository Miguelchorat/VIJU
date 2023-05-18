import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/sass/main.sass'
import VueClickAway from "vue3-click-away";


const app = createApp(App)
app.use(VueClickAway)
app.use(router)

app.config.warnHandler = (message, _, options) => {
    if (options === 'OBSOLETE_METHOD_WARNING') {
        return;
    }
    console.warn(message);
};

app.mount('#app')
