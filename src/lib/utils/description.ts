// Extract clean description text and optional uploaded image URL from composite text field
export function parseDescription(rawDescription: string): { description: string; imageUrl: string } {
  if (!rawDescription) return { description: '', imageUrl: '' }
  if (rawDescription.includes('\n\n||image_url||')) {
    const parts = rawDescription.split('\n\n||image_url||')
    return {
      description: parts[0],
      imageUrl: parts[1] || ''
    }
  }
  return { description: rawDescription, imageUrl: '' }
}
