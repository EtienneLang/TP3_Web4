import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import "vue-toastification/dist/index.css";

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Toast from "vue-toastification";

const options = {
    // You can set your default options here
};
const app = createApp(App);


app.use(Toast, options);
app.use(router);

app.mount('#app');
