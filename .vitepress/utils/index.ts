import slugify from 'slugify'

// Ref: https://github.com/sodiray/radash/blob/master/src/curry.ts debounce
export interface DebounceFunction<TArgs extends any[]> {
  (...args: TArgs): void
}
export function debounce<TArgs extends any[]>({ delay }: { delay: number }, func: (...args: TArgs) => any) {
  let timer: NodeJS.Timeout | undefined
  const debounced: DebounceFunction<TArgs> = (...args: TArgs) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
      timer = undefined
    }, delay)
  }
  return debounced
}

export function string2Anchor(str: string): string {
  return slugify(str, { remove: /[*+~()'"!:@]/g, lower: true, replacement: '_' })
}
