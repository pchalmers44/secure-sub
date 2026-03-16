import bcrypt from "bcrypt";

const DEFAULT_COST = 12;
const MIN_COST = 10;
const MAX_COST = 14;

function getCost(): number {
  const raw = process.env.BCRYPT_COST;
  if (!raw) return DEFAULT_COST;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return DEFAULT_COST;
  return Math.min(MAX_COST, Math.max(MIN_COST, n));
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, getCost());
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
