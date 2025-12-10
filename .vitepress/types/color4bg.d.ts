declare module 'color4bg' {
  class GridArrayBg {
    constructor(params: {
      dom: string
      loop: boolean
      colors: string[]
    })
    update(option: string, value: any): void
    colors(colors: string[]): void
    destroy(): void
  }
}
