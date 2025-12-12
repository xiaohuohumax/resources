import type { Plugin } from 'vitepress'
import fs from 'node:fs'
import { readMarkdownFiles } from '../util'

export default function (outDir: string): Plugin {
  return {
    name: 'vitepress:clear-dist',
    apply: 'build',
    closeBundle() {
      readMarkdownFiles(outDir).forEach(fs.unlinkSync)
    },
  }
}
