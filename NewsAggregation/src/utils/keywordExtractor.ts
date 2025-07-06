import { IArticle } from "./interfaces";
import natural from 'natural';

export class KeywordExtractor {
    private static tokenizer = new natural.WordTokenizer();
    private static stopwords = new Set(natural.stopwords);

    static extractKeywords(article: IArticle): string[] {
        const text = `${article.title} ${article.description}`.toLowerCase();
        const words = this.tokenizer.tokenize(text.toLowerCase());
        const keywords = words.filter(word =>
            word.length > 2 && !this.stopwords.has(word)
        ).map(word => natural.PorterStemmer.stem(word));
        return [...new Set(keywords)];
    }
}
