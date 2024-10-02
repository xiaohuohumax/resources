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
  languageOptions: {
    parserOptions: {
      warnOnUnsupportedTypeScriptVersion: false,
    },
  },
  ignores: [
    '**/cache',
  ],
  rules: {
    'no-console': 'off',
  },
})
