import { CategoryRepository } from '../repositories/categoryRepository';

export class CategoryService {
    private categoryRepo = new CategoryRepository();

    async createCategory(name: string): Promise<number> {
        if (!name.trim()) {
            throw new Error('Category name cannot be empty');
        }
        const isCategoryExists = await this.categoryRepo.exists(name);
        if (isCategoryExists) {
            throw new Error(`Category "${name}" already exists.`);
        }
        return this.categoryRepo.createCategory(name);
    }
}
