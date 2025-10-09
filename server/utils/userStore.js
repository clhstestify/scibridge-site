import { promises as fs } from 'fs';
import path from 'path';

const usersFilePath = path.resolve(process.cwd(), 'server/data/users.json');

async function ensureFile() {
  try {
    await fs.access(usersFilePath);
  } catch (error) {
    await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
    await fs.writeFile(usersFilePath, '[]', 'utf8');
  }
}

export async function readUsers() {
  await ensureFile();
  const contents = await fs.readFile(usersFilePath, 'utf8');
  try {
    const parsed = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export async function writeUsers(users) {
  await ensureFile();
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
}
