import { Router, Request, Response } from 'express';
import { db } from '../db';
import { formatVCard } from '../vcard';

const router = Router();

// GET /api/public/cards/:slug
router.get('/cards/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const employee = db.getEmployeeBySlug(slug);

  if (!employee) {
    return res.status(404).json({ error: 'Digital business card not found' });
  }

  if (employee.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'This card profile is currently inactive' });
  }

  const company = db.getCompanySettings();
  return res.json({ employee, company });
});

// POST /api/public/cards/:slug/track
router.post('/cards/:slug/track', (req: Request, res: Response) => {
  const { slug } = req.params;
  const { action } = req.body; // 'scan' or 'vcard'

  if (action === 'scan' || action === 'vcard') {
    db.incrementCardAction(slug, action);
  }

  return res.json({ success: true });
});

// GET /api/public/cards/:slug/vcard
router.get('/cards/:slug/vcard', (req: Request, res: Response) => {
  const { slug } = req.params;
  const employee = db.getEmployeeBySlug(slug);

  if (!employee) {
    return res.status(404).send('Card not found');
  }

  // Increment vcard download count
  db.incrementCardAction(slug, 'vcard');

  const company = db.getCompanySettings();
  const vcardText = formatVCard(employee, company);

  const filename = `${employee.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_contact.vcf`;
  res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.send(vcardText);
});

export default router;
