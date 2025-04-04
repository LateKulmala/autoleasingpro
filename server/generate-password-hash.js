import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function main() {
  const password = process.argv[2] || 'SecureAdminPass2023!';
  const hash = await hashPassword(password);
  console.log('Password:', password);
  console.log('Hashed:', hash);
}

main().catch(console.error);
