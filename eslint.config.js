import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  typescript: true,
  vue: true,
  jsonc: false,
  yaml: false,
  markdown: true,
  ignores: [
    '**/cache',
  ],
})
