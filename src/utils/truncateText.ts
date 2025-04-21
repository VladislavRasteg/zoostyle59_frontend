export const truncateText = (text: string | undefined, num: number): string => {
  if (!text) return ''
  return text?.length > num ? `${text?.substring(0, num)}...` : text
}
