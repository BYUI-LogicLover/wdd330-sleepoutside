import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        "product-northface-alpine": resolve(__dirname, "src/product_pages/northface-alpine-3.html"),
        "product-marmot-ajax": resolve(__dirname, "src/product_pages/marmot-ajax-3.html"),
        "product-northface-talus": resolve(__dirname, "src/product_pages/northface-talus-4.html"),
        "product-cedar-ridge": resolve(__dirname, "src/product_pages/cedar-ridge-rimrock-2.html"),
      },
    },
  },
});
