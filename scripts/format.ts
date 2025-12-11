import fs from 'node:fs'
import path from 'node:path'
import { string2Anchor } from '../.vitepress/utils'
import {
  DefaultIcon,
  formatIcon,
  normalizePath,
  readFolders,
  readMarkdownFiles,
  readMarkdownFrontmatter,
  readView,
  updateMarkdownFrontmatter,
} from '../.vitepress/view'

function formatFilename(filePath: string): string {
  const extname = path.extname(filePath)
  const filename = path.basename(filePath, extname)
  const newFilename = string2Anchor(filename)
  const dirname = path.dirname(filePath)
  const newFilePath = normalizePath(path.join(dirname, `${newFilename}${extname}`))
  if (normalizePath(filePath) !== newFilePath) {
    fs.renameSync(filePath, newFilePath)
    console.log(`Rename ${filePath} -> ${newFilePath}`)
  }
  return newFilePath
}

function formatView(srcDir: string, filePath: string): void {
  const view = readView(filePath, srcDir)
  if (!view) {
    return
  }
  const frontmatter = readMarkdownFrontmatter(filePath)
  if (frontmatter.icon === undefined) {
    return
  }

  const defaultIcon = view.layout === 'collection' ? DefaultIcon.Collection : DefaultIcon.Resource
  let icon = formatIcon(frontmatter.icon, view.pathname, defaultIcon)
  if (typeof icon === 'string') {
    formatFilename(path.join(srcDir, icon))
    icon = string2Anchor(frontmatter.icon)
  }
  else {
    if (icon.dark !== undefined) {
      formatFilename(path.join(srcDir, icon.dark))
      icon.dark = string2Anchor(frontmatter.icon.dark)
    }
    if (icon.light !== undefined) {
      formatFilename(path.join(srcDir, icon.light))
      icon.light = string2Anchor(frontmatter.icon.light)
    }
  }

  updateMarkdownFrontmatter(filePath, { icon })
}

const srcDir = path.join(__dirname, '../docs')

readFolders(srcDir).forEach(formatFilename)
readMarkdownFiles(srcDir).map(formatFilename).forEach(formatView.bind(null, srcDir))
