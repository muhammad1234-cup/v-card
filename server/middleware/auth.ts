import { Request, Response, NextFunction } from 'express';
import { db, DBUser } from '../db';

export interface AuthenticatedRequest extends Request {
  user?: DBUser;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Decodes either `token-<userId>` or base64 token
    let userId = token.replace('token-', '');
    if (token.startsWith('eyJ') || token.includes('=')) {
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const parsed = JSON.parse(decoded);
        userId = parsed.id || userId;
      } catch {
        // use as is
      }
    }

    const user = db.getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Session expired or user not found' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
}
