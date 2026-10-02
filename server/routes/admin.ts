import { Router, Response } from 'express';
import { db } from '../db';
import { authMiddleware, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

// GET /api/admin/stats
router.get('/stats', (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getStats());
});

// GET /api/admin/employees
router.get('/employees', (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getEmployees());
});

// GET /api/admin/employees/:id
router.get('/employees/:id', (req: AuthenticatedRequest, res: Response) => {
  const emp = db.getEmployeeById(req.params.id);
  if (!emp) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  return res.json(emp);
});

// POST /api/admin/employees
router.post('/employees', (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = db.createEmployee(req.body);
    return res.status(201).json(created);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create employee';
    return res.status(400).json({ error: msg });
  }
});

// PUT /api/admin/employees/:id
router.put('/employees/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateEmployee(req.params.id, req.body);
    return res.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update employee';
    return res.status(400).json({ error: msg });
  }
});

// DELETE /api/admin/employees/:id
router.delete('/employees/:id', (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteEmployee(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  return res.json({ success: true });
});

// GET /api/admin/company
router.get('/company', (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getCompanySettings());
});

// PUT /api/admin/company
router.put('/company', (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateCompanySettings(req.body);
  return res.json(updated);
});

export default router;
