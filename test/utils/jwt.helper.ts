import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'sb&t-app-secret';

export const generateJwt = (payload: Record<string, unknown>) => jwt.sign(payload, SECRET, { expiresIn: 300 });
