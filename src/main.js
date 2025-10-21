import "./assets/css/main.css";

import components from "@lewishowles/components";
import router from "@/router";
import { createApp } from "vue";

import App from "./App.vue";

const app = createApp(App);

app.use(router);
app.use(components);
app.mount("#app");
