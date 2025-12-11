import type { Plugin } from 'vitepress'
import type { ArticleView, CollectionView, EmptyView, ResourceView } from '../view'
import fs from 'node:fs'
import path from 'node:path'
import { DefaultIcon, updateMarkdownFrontmatter } from '../view'

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

      createTemplate<Omit<CollectionView, OmitCore>>({
        disabled: false,
        order: 0,
        layout: 'collection',
        icon: DefaultIcon.Collection,
        title: 'Title',
        description: 'Description',
      }, 'index.md')

      createTemplate<Omit<ResourceView, OmitCore>>({
        disabled: false,
        order: 0,
        layout: 'resource',
        icon: DefaultIcon.Resource,
        title: 'Title',
        description: 'Description',
        links: [
          {
            icon: 'question-mark',
            text: 'Link',
            link: 'https://example.com',
          },
        ],
        tags: ['tag1', 'tag2'],
      }, 'resource.md')

      createTemplate<Omit<ArticleView, OmitCore>>({
        disabled: false,
        order: 0,
        layout: 'article',
        icon: DefaultIcon.Article,
        title: 'Title',
        description: 'Description',
        tags: ['tag1', 'tag2'],
      }, 'article.md')

      createTemplate<Omit<EmptyView, OmitCore>>({
        disabled: false,
        order: 0,
        layout: 'empty',
        title: 'Title',
        description: 'Description',
      }, 'empty.md')
    },
  }
}
