import { defineConfig, presetUno, presetWebFonts } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "Noto Sans SC",
        mono: ["Fira Code", "Fira Mono:400,700"],
      },
    }),
    // ...
  ],
  theme: {
    colors: {
      primary: "#45E1B8",
      secondary: "#5CE5C1",
      third: "#1DB48D",
      neutral: "#252525",
      "custom-user_gradient_1": "rgba(205, 233, 251, 1)",
      "custom-user_gradient_2": "rgba(236, 249, 249, 1)",
      "custom-user_gradient_3": "rgba(245, 245, 251,0.6)",
    },
    height: {
      "subtract-register": "calc(100vh - 200px)"
    }
  },
});
