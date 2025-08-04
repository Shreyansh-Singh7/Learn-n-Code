import { ask } from '../../utils/helpers';
import { IBlockedKeyword } from '../../utils/interfaces';

export class AdminModerationView {
    async promptModerationMenu(): Promise<string> {
        console.log('\n=== Content Moderation ===');
        console.log('1. Hide Article');
        console.log('2. Hide Category');
        console.log('3. Manage Blocked Keywords');
        console.log('4. Back');
        return ask('Choose an option: ');
    }

    async promptKeywordMenu(): Promise<string> {
        console.log('\n--- Blocked Keyword Management ---');
        console.log('1. Add Blocked Keyword');
        console.log('2. Remove Blocked Keyword');
        console.log('3. View Blocked Keywords');
        console.log('4. Back');
        return ask('Choose an option: ');
    }

    async promptArticleId(): Promise<number> {
        const input = await ask('Enter article ID to hide: ');
        return parseInt(input, 10);
    }

    async promptCategoryId(): Promise<number> {
        const input = await ask('Enter category ID to hide: ');
        return parseInt(input, 10);
    }

    async promptKeyword(): Promise<string> {
        return ask('Enter keyword: ');
    }

    showMessage(msg: string): void {
        console.log(msg);
    }

    showKeywords(keywords: IBlockedKeyword[]): void {
        console.log('\nBlocked Keywords:');
        keywords.forEach(k => {
            console.log(`- ${k.keyword} (added on ${new Date(k.created_at).toLocaleString()})`);
        });
    }
}
