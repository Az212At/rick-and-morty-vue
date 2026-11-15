import { createApp } from "vue";
import App from "./App.vue";
import { createAppRouter } from "./providers/router";
import "./styles/global.css";
import "./styles/components.css";

const app = createApp(App);
app.use(createAppRouter());
app.mount("#root");
