import fs from 'node:fs'
import { LinkChecker } from 'linkinator'

async function simple() {
  const checker = new LinkChecker()
  checker.on('link', result => console.log(result.status, result.url))

  const { links, passed } = await checker.check({
    path: 'docs/**/*.md',
    markdown: true,
  })

  const results: Record<string, any> = { passed, unknown: [] }
  for (const link of links.filter(link => !link.url.endsWith('.md'))) {
    const key = link.status !== undefined ? link.status : 'unknown'
    const statusList = results[key] || []
    statusList.push(link)
    results[key] = statusList
  }

  fs.writeFileSync('linkinator.json', JSON.stringify(results, null, 2))
}
simple()
