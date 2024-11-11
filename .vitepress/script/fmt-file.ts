import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import glob from 'fast-glob'
import { normalizePath } from 'vite'
import * as constant from '../constant'

const REPLACE_PATTERN = /[()[\]{}\- _.]+/g
const ICON_PATTERN = / {2}(dark|light|src): \/image\/logo\/(.*)/g

function fmtFileName(fileName: string): string {
  const ext = path.extname(fileName)
  const name = path.basename(fileName, ext)
  const fmtName = name.replaceAll(REPLACE_PATTERN, () => '_').toLocaleLowerCase()
  return fmtName + ext
}

function fmtFile(filePath: string) {
  const fileName = path.basename(filePath)
  const fmtName = fmtFileName(fileName)
  const dirPath = path.dirname(filePath)
  if (fileName !== fmtName) {
    console.log(chalk.yellow(`Rename ${filePath} => ${fmtName}`))
    fs.renameSync(filePath, path.join(dirPath, fmtName))
  }
}

async function main() {
  console.log(chalk.green('Start format files'))

  const resourcePaths = glob.sync(
    normalizePath(path.join(constant.SRC_DIR, '**/*.md')),
    {
      ignore: constant.SRC_EXCLUDE,
    },
  )

  for (const resourcePath of resourcePaths) {
    const resourceContent = fs.readFileSync(resourcePath, 'utf-8')

    const newContent = resourceContent.replaceAll(ICON_PATTERN, (_, $1, $2) => {
      return `  ${$1}: /image/logo/${fmtFileName($2)}`
    })
    if (newContent !== resourceContent) {
      console.log(chalk.green(`Format ${resourcePath} icons`))
      fs.writeFileSync(resourcePath, newContent, 'utf-8')
    }

    fmtFile(resourcePath)
  }

  const logoPaths = glob.sync(normalizePath(path.join(constant.PUBLIC_DIR, '/image/**')))

  for (const logoPath of logoPaths) {
    fmtFile(logoPath)
  }

  console.log(chalk.green('Format files complete'))
}

main().catch(err => console.log(chalk.red(err.message)))
