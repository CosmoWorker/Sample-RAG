export const createChunks = (text: string): string[] => {
    //chunking if the minimum chunk limit is 4000 and if the sentence is complete indicating using a period (.)

    let chunks: string[] = []
    let chunkSize = 3990
    for (let i = 0; i < text.length; i += chunkSize) {
        let textEle = text.slice(i, i + chunkSize)
        let addedChars = likelySentenceEnd(text, i + chunkSize)
        const endIdx = addedChars?.likelyEndIdx ?? i + chunkSize;
        textEle += text.slice(i + chunkSize, endIdx)
        chunks.push(textEle.trim())
    }

    return chunks;
}

const likelySentenceEnd = (text: string, index: number) => {
    const nonBreakingAbbreviations = ["e.g", "i.e", "etc", "vs", "VS", "No", "no", "dr", "Dr", "Mr", "Mrs", "Ms"]
    while (index < text.length) {
        let wordSnippetIdx = getRandomInt(6, 7) // most average character length wrt this industry being 6-7
        let wordSnippet = text.slice(index, index + wordSnippetIdx)
        const multiPeriods = /([A-Z]\.){2,}/.test(wordSnippet)
        const hasDotComma = /\.,/.test(wordSnippet)
        const nextIsLowercase = /[ ][a-z]/.test(wordSnippet)
        const periodWithSpace = /[\.?!]\s+[A-Z]/.test(wordSnippet)

        // check word before the dot
        const lookBehind = text.slice(index - 6, index + 1); // a small snippet
        const abbrevMatch = nonBreakingAbbreviations.some(abbrev =>
            lookBehind.includes(abbrev + ".")
        );

        if ((!multiPeriods && !nextIsLowercase && !hasDotComma && !abbrevMatch) || periodWithSpace) {
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