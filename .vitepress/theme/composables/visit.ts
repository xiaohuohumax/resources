export function useVisit() {
  const id = 'visit-count'
  const visit = document.getElementById(id)
  if (visit) {
    document.head.removeChild(visit)
  }

  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.id = id
  script.src = 'https://cn.vercount.one/js'
  document.head.appendChild(script)
}
