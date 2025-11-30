import type { Plugin } from 'vitepress'
import type { Collection, Empty, Resource } from '../view'
import fs from 'node:fs'
import path from 'node:path'
import { updateMarkdownFrontmatter } from '../view'

export default function (templatesDir: string): Plugin {
  function createTemplate<T extends Record<string, any>>(template: T, filename: string) {
    updateMarkdownFrontmatter(path.join(templatesDir, filename), template)
  }

  return {
    name: 'vitepress:create-template',
    apply: 'build',
    buildStart() {
      fs.rmSync(templatesDir, { recursive: true, force: true })
      fs.mkdirSync(templatesDir, { recursive: true })

      type OmitCore = 'id' | 'pathname' | 'collectionId'

      createTemplate<Omit<Collection, OmitCore>>({
        disabled: false,
        order: 0,
        layout: 'collection',
        icon: '/folder.svg',
        title: 'Title',
        description: 'Description',
      }, 'index.md')

      createTemplate<Omit<Resource, OmitCore>>({
        disabled: false,
        order: 0,
        layout: 'resource',
        icon: 'file.svg',
        title: 'Title',
        description: 'Description',
        links: [
          {
            text: 'Link',
            link: 'https://example.com',
          },
        ],
        tags: ['tag1', 'tag2'],
      }, 'resource.md')

      createTemplate<Omit<Empty, OmitCore>>({
        disabled: false,
        order: 0,
        layout: 'empty',
        title: 'Title',
        description: 'Description',
      }, 'empty.md')
    },
  }
}
