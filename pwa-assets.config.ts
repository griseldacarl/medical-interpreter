import { defineConfig } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  images: ['public/icon.svg'],
  preset: {
    transparent: {
      sizes: [192, 512],
      favicons: [],
    },
    maskable: {
      sizes: [192, 512],
    },
    apple: {
      sizes: [120, 152, 167, 180],
    },
  },
})
