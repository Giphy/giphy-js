export function fillArray(length: number, columnOffsets: number[] = []) {
    return Array.apply(null, Array(length)).map((_, index: number) => columnOffsets[index] || 0)
}
