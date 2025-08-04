import { IExternalServer } from '../../utils/interfaces';
import { ask } from '../../utils/helpers';

export class AdminDashboardView {
    async promptOption(): Promise<string> {
        console.log('\n=== Admin Dashboard ===');
        console.log('1. View the list of external servers and status');
        console.log('2. View the external server’s details');
        console.log('3. Update/Edit the external server’s API key');
        console.log('4. Add new News Category');
        console.log('5. Content Moderation');
        console.log('6. Review Reported Articles');
        console.log('0. Logout');
        return await ask('Choose an option: ');
    }

    showServers(servers: IExternalServer[]): void {
        console.log('\nID\tName\tStatus\tLast Accessed');
        servers.forEach(s => {
            console.log(s.serverId, '\t', s.name, '\t', s.status, '\t', new Date(s.lastAccessed).toLocaleString());
        });
    }

    showServerDetails(s: IExternalServer): void {
        console.log('\n--- Server Details ---');
        console.log(`ID:            ${s.serverId}`);
        console.log(`Name:          ${s.name}`);
        console.log(`API Key:       ${s.apiKey}`);
        console.log(`Status:        ${s.status}`);
        console.log(`Last Accessed: ${new Date(s.lastAccessed).toLocaleString()}`);
    }

    async promptServerName(): Promise<string> {
        return ask('Enter server name: ');
    }

    async promptNewApiKey(): Promise<string> {
        return ask('Enter new API key: ');
    }

    async promptCategoryName(): Promise<string> {
        return ask('Enter new category name: ');
    }

    showCategoryAdded(): void {
        console.log(`New category added`);
      }

    showMessage(msg: string): void {
        console.log(msg);
    }
}
