import { IncomingMessage } from 'http';
import readline from 'readline';
import bcrypt from 'bcrypt';

export const hashPassword = async (plainPassword: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
};

export const parseJsonBody = async (request: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', (chunk) => (body += chunk));
        request.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(new Error('Invalid JSON body'));
            }
        });
        request.on('error', reject);
    });
}

const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => readLine.question(query, resolve));
}
  