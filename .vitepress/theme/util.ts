import slugify from 'slugify'

const REMOVE_RE = /[*+~()'"!:@]/g

export function string2Anchor(str: string): string {
  return slugify(str, { remove: REMOVE_RE, lower: true, replacement: '_' })
}
