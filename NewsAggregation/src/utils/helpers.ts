import { IncomingMessage } from 'http';
import readline from 'readline';

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
    output: process.stdout,
    terminal: true
});

export const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => readLine.question(query, resolve));
}

export const ask = (question: string): Promise<string> => {
    return new Promise((resolve) => {
        readLine.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
};

export function getRandomInt(min: number, max: number): number {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}
