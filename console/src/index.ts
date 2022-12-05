import { definePlugin } from "@halo-dev/console-shared";
import { markRaw } from "vue";
import PixabaySelectorProvider from "./components/PixabaySelectorProvider.vue";
import "./styles/tailwind.css";

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    "attachment:selector:create": () => {
      return [
        {
          id: "pixabay",
          label: "Pixabay",
          component: markRaw(PixabaySelectorProvider),
        },
      ];
    },
  },
});
