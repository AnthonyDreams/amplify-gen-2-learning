function slugify(string: string): string {
  return string
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
}

export default slugify
