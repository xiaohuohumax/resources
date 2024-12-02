import type { Doc } from '../resource'
import chalk from 'chalk'
import * as constant from '../constant'
import { ResourceManager } from '../resource'

interface LinkText {
  text: string
  count: number
}

interface Tag {
  name: string
  count: number
}

interface Stat {
  linkCount: number
  docCount: number
  collectionCount: number
  tagCount: number
  linkTexts: LinkText[]
  tags: Tag[]
}

async function main() {
  const stat: Stat = {
    linkCount: 0,
    docCount: 0,
    collectionCount: 0,
    tagCount: 0,
    linkTexts: [],
    tags: [],
  }
  const resourceManager = new ResourceManager(
    {
      srcDir: constant.SRC_DIR,
      srcExclude: constant.SRC_EXCLUDE,
      collectionIconDefault: {
        src: constant.FOLDER_ICON_PATH,
      },
      togoTextDefault: '',
    },
  )

  const docs: Doc[] = resourceManager.getAllDocs()
  stat.docCount = docs.length
  const linkTextMap: Record<string, number> = {}
  const tagMap: Record<string, number> = {}

  for (const doc of docs) {
    for (const link of doc.links) {
      stat.linkCount++
      linkTextMap[link.text] = (linkTextMap[link.text] || 0) + 1
    }
    for (const tag of doc.tags || []) {
      tagMap[tag] = (tagMap[tag] || 0) + 1
    }
  }

  stat.linkTexts = Object.entries(linkTextMap).map(([text, count]) => ({
    text,
    count,
  })).sort((a, b) => b.count - a.count)

  stat.tagCount = Object.keys(tagMap).length
  stat.tags = Object.entries(tagMap).map(([name, count]) => ({
    name,
    count,
  })).sort((a, b) => b.count - a.count)

  const collections = resourceManager.getAllCollections()
  stat.collectionCount = collections.length

  console.log(stat)
}

main().catch(err => console.log(chalk.red(err.message)))
