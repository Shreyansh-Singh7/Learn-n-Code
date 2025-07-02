import readlineSync from "readline-sync";
import axios from "axios";

let token: string | null = null;
let role: string | null = null;

type Session = {
  token: string | null;
  role: string | null;
};

export async function login() {
  const email = readlineSync.questionEMail("Enter email: ");
  const password = readlineSync.question("Enter password: ", {
    hideEchoBack: true,
  });

  try {
    const res = await axios.post("http://localhost:3000/api/auth/login", {
      email,
      password,
    });
    token = res.data.token;
    role = res.data.role;
    console.log(`✅ Logged in as ${role}`);
    return { token, role };
  } catch (err: any) {
    let message = "Unknown error";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.error || err.message;
    } else if (err instanceof Error) {
      message = err.message;
    } else {
      message = JSON.stringify(err);
    }

    console.error("❌ Login failed:", message);
    return null;
  }
}

export async function signup() {
  const username = readlineSync.question("Enter username: ");
  const email = readlineSync.questionEMail("Enter email: ");
  const password = readlineSync.question("Enter password: ", {
    hideEchoBack: true,
  });

  try {
    await axios.post("http://localhost:3000/api/auth/signup", {
      username,
      email,
      password,
    });
    console.log("✅ Signup successful. Please login.");
  } catch (err: any) {
    let message = "Unknown error";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.error || err.message;
    } else if (err instanceof Error) {
      message = err.message;
    } else {
      message = JSON.stringify(err);
    }

    console.error("❌ Signup failed:", message);
    return null;
  }
}

export function getSession(): Session {
  return { token, role };
}
