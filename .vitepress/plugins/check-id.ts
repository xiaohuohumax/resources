import type { Plugin } from 'vitepress'
import { readViews } from '../util'

export default function (srcDir: string): Plugin {
  return {
    name: 'vitepress:check-id',
    apply: 'build',
    buildStart() {
      const views = readViews(srcDir)
      const map = new Map<string, string>()
      for (const view of views) {
        if (map.has(view.id)) {
          const oldPath = map.get(view.id)
          throw new Error(`Duplicate id "${view.id}" found in "${view.pathname}" and "${oldPath}"`)
        }
        else {
          map.set(view.id, view.pathname)
        }
      }
    },
  }
}
