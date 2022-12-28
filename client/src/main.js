// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

// import Vue from 'vue'
// import App from './App.vue'
// import {router} from './router'

// Vue.config.productionTip = false

// new Vue({
//   router,
//   render: h => h(App),
// }).$mount('#app')



import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
        path: "/users",
        alias: "/users",
        name: "users",
        component: () => import("./components/UsersList")
      },
  ],
})

const app = createApp(App)
app.use(router)

window.vm = app.mount('#app')