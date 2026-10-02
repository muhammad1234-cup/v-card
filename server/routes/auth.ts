import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'User not found with this email' });
  }

  // Demo pass check
  if (password && user.passwordHash !== password) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const token = `token-${user.id}`;
  const employee = user.employeeId ? db.getEmployeeById(user.employeeId) : undefined;

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      employeeId: user.employeeId,
    },
    employee,
  });
});

router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const employee = user.employeeId ? db.getEmployeeById(user.employeeId) : undefined;

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      employeeId: user.employeeId,
    },
    employee,
  });
});

export default router;
