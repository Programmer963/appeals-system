import { Router } from "express";
import {
    createAppeal,
    takeInProgress,
    completeAppeal,
    cancelAppeal,
    getAppeals,
    cancelAllInProgress
} from "../controllers/appealController";

const router = Router();

router.post('/', createAppeal);
router.patch('/:id/start', takeInProgress);
router.patch('/:id/complete', completeAppeal);
router.patch('/:id/cancel', cancelAppeal);
router.get('/', getAppeals);
router.post('/progress-to-cancel', cancelAllInProgress);

export default router;