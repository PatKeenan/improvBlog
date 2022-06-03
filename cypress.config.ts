/**
 *
 * IMPORTANT!!!: If using m1 chip, follow this article to get cypress working https://www.cypress.io/blog/2021/01/20/running-cypress-on-the-apple-m1-silicon-arm-architecture-using-rosetta-2/?utm_content=152016256&utm_medium=social&utm_source=twitter&hss_channel=tw-2774638535
 *
 */
import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
