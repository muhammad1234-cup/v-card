import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  // If base64 data url, return it directly so it renders immediately without filesystem fragility
  return res.json({ url: image });
});

export default router;
