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

export const ask = (question: string, maskInput = false): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!maskInput) {
      readLine.question(question, (answer) => {
        resolve(answer.trim());
      });
    } else {
      const stdin = process.stdin;
      const stdout = process.stdout;
      let password = '';

      stdout.write(question);
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding('utf8');

      const onData = (data: Buffer) => {
        const char = data.toString('utf8');

        if (char === '\r' || char === '\n') {
          stdout.write('\n');
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          resolve(password.trim());
        }
        else if (char === '\u0003') {
          stdout.write('\n');
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          reject(new Error('User interrupted input'));
        }
        else if (char === '\b' || char.charCodeAt(0) === 127) {
          if (password.length > 0) {
            password = password.slice(0, -1);
            stdout.clearLine(0);
            stdout.cursorTo(0);
            stdout.write(question + '*'.repeat(password.length));
          }
        }
        else if (char >= ' ' && char <= '~') {
          password += char;
          stdout.clearLine(0);
          stdout.cursorTo(0);
          stdout.write(question + '*'.repeat(password.length));
        }
      };

      stdin.on('data', onData);

      stdin.on('error', (err) => {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        reject(err);
      });
    }
  });
};


export function getRandomInt(min: number, max: number): number {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}
