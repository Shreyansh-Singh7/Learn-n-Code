import { ask } from '../../utils/helpers';
import { IAdminNotification } from '../../utils/interfaces';

export class AdminNotificationView {
    async promptAdminNotificationMenu(): Promise<string> {
        console.log('\n=== Admin Reported Articles Notifications ===');
        console.log('1. View Pending Notifications');
        console.log('2. Mark Notification as Read');
        console.log('3. Back');
        return ask('Choose an option: ');
    }

    showNotifications(notifications: IAdminNotification[]): void {
        if (!notifications.length) {
            console.log('\nNo new notifications.');
            return;
        }

        console.log('\nPending Notifications:');
        notifications.forEach(notification => {
            console.log(`- ID: ${notification.notification_id}`);
            console.log(`  Report ID: ${notification.article_id}`);
            console.log(`  Reason: ${notification.reason}`);
            console.log(`  Report Time & Date: ${new Date(notification.created_at).toLocaleString()}`);
            console.log(`  Read: ${notification.read ? 'Yes' : 'No'}`);
            console.log('---');
        });
    }

    async promptNotificationId(): Promise<number> {
        const input = await ask('Enter Notification ID to mark as read: ');
        return parseInt(input, 10);
    }

    showMessage(msg: string): void {
        console.log(msg);
    }
}
