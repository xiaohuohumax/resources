import slugify from 'slugify'

export function string2Anchor(str: string): string {
  return slugify(str, { remove: /[*+~()'"!:@]/g, lower: true, replacement: '_' })
}
