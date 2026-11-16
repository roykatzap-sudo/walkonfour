declare module 'bidi-js' {
  export interface EmbeddingLevels {
    levels: Uint8Array
    paragraphs: { start: number; end: number; level: number }[]
  }
  export interface Bidi {
    getEmbeddingLevels(text: string, baseDirection?: 'ltr' | 'rtl' | 'auto'): EmbeddingLevels
    getReorderSegments(
      text: string,
      embeddingLevels: EmbeddingLevels,
      start?: number,
      end?: number,
    ): [number, number][]
    /** מפה של אינדקס -> תו מראה (סוגריים וכדומה) לתווים ברמת הטמעה אי-זוגית. מקבלת את מערך הרמות עצמו. */
    getMirroredCharactersMap(text: string, levels: Uint8Array, start?: number, end?: number): Map<number, string>
  }
  export default function bidiFactory(): Bidi
}
