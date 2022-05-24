export function toCapitalCase(string: string){
    if(string){
        const words: string[] = string.trim().split(' ')
        let newWords: string[] = []
        words.forEach(i => {
           return newWords.push(i[0].toUpperCase() + i.substring(1))
        })
        return newWords.join(" ")
    }
    return string
}