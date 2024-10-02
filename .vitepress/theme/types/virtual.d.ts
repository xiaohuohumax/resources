declare module 'virtual:resources' {
  const data: Record<string, () => Promise<{ default: import('./index.d').Resource[] }>>
  export default data
}

declare module 'virtual:breadcrumb' {
  const data: Record<string, import('./index.d').Breadcrumb[]>
  export default data
}
