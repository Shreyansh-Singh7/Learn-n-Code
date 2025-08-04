export interface IUserPreferenceRepository {
    getUserPrefrenceKeywords(userId: number): Promise<string[]>;
    getUserPrefrenceCategories(userId: number): Promise<number[]>;
    addPreferenceKeywords(userId: number, keywords: string[]): Promise<void>;
    addPreferenceCategories(userId: number, categories: number[]): Promise<void>
}
  