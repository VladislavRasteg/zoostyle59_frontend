export const trimText = (text: string | undefined, symbols: number): string => {
    if (!text) return ''
    if(text.length <= symbols) return text
    return `${text.trim().slice(0, symbols-1)}…`
}