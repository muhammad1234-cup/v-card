import { Router, Response } from 'express';
import { db } from '../db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// GET /api/employee/profile
router.get('/profile', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  let employee = user.employeeId ? db.getEmployeeById(user.employeeId) : undefined;

  // Fallback: If admin or unlinked, take first employee for preview
  if (!employee) {
    const all = db.getEmployees();
    employee = all[0];
  }

  const company = db.getCompanySettings();
  return res.json({ employee, company });
});

// PUT /api/employee/profile
router.put('/profile', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const employeeId = user.employeeId || db.getEmployees()[0]?.id;

  if (!employeeId) {
    return res.status(404).json({ error: 'No employee card linked' });
  }

  // Self-service allowed fields: name, title, phone, location, bio, socials, avatar, themeColor
  const { name, title, phone, location, bio, socials, avatar, themeColor } = req.body;
  const updated = db.updateEmployee(employeeId, {
    name,
    title,
    phone,
    location,
    bio,
    socials,
    avatar,
    themeColor,
  });

  return res.json(updated);
});

// POST /api/employee/nfc
router.post('/nfc', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const employeeId = user.employeeId || db.getEmployees()[0]?.id;

  if (!employeeId) {
    return res.status(404).json({ error: 'No employee card linked' });
  }

  const { tagId, writeStatus } = req.body;
  const updated = db.updateEmployee(employeeId, {
    nfcConfig: {
      tagId: tagId || `TAG-${Date.now().toString(36)}`,
      encodedAt: new Date().toISOString(),
      writeStatus: writeStatus || 'written',
    },
  });

  return res.json(updated);
});

export default router;
