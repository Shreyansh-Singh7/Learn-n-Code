export function validateEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}