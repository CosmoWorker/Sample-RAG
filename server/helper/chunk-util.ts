export const createChunks = (text: string, chunkSize = 990): string[] => {

    //chunking if the minimum chunk limit is 1000 and if the sentence is complete indicating using a period (.)

    let chunks: string[] = []

    for (let i = 0; i < text.length; i += chunkSize) {
        let textEle = text.slice(i, i + chunkSize)
        let addedChars = likelySentenceEnd(text, i + chunkSize)
        const endIdx = addedChars?.likelyEndIdx ?? i + chunkSize;
        textEle += text.slice(i + chunkSize, endIdx)
        chunks.push(textEle)
    }

    return chunks;
}

const likelySentenceEnd = (text: string, index: number) => {
    while (index < text.length) {
        let wordSnippetIdx = getRandomInt(5, 8) // chosen 5 and 8 as most average character length wrt this industry being 6-7
        let wordSnippet = text.slice(index, index + wordSnippetIdx)
        const multiPeriods = wordSnippet.match(/([A-Z]\.){2,}/)
        const hasDotComma = wordSnippet.match(/^\.,$/)
        const nextIsLowercase = wordSnippet.match(/^[ ][a-z]$/)
        const periodWithSpace = wordSnippet.match(/^\.\s[A-Z]$/)

        if ((!multiPeriods && !nextIsLowercase && !hasDotComma) || periodWithSpace) {
            return {
                likelyEndIdx: index + wordSnippetIdx + 1
            }
        }
        index += wordSnippetIdx
    }
}

const getRandomInt = (min: number, max: number) => {
    // getting random integer inclusive of min & max
    return Math.floor(Math.random() * (max - min + 1) + min)
}