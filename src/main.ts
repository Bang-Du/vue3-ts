import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import { loadAllPlugins } from './plugins'
import './assets/css/element-common.scss'
import './assets/css/main.scss'
import './assets/css/mixin.scss'
import './assets/css/other.scss'
import './assets/iconfont/iconfont.css'

const app = createApp(App);

loadAllPlugins(app);


app.use(store).use(router).mount('#app')

