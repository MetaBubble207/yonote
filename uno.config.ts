import { defineConfig, presetUno } from 'unocss'
export default defineConfig({
    presets: [
        presetUno(),
        // ...
    ],
    theme: {
        colors: {
            // ...
            'custom-blue': 'rgba(205, 233, 251, 1)',
            'custom-teal': 'rgba(236, 249, 249, 1)',
            'custom-light-blue': 'rgba(245, 245, 251,0.6)'
        }
    }
})
