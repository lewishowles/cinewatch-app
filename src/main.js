import "./assets/css/main.css";

import components from "@lewishowles/components";
import { createApp } from "vue";

import App from "./App.vue";

const app = createApp(App);

app.use(components);
app.mount("#app");
