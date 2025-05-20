import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
    createAppeal,
    takeInProgress,
    completeAppeal,
    cancelAppeal,
    getAppeals,
    cancelAllInProgress
} from "../controllers/appealController";

const router = Router();

router.post('/', asyncHandler(createAppeal));
router.patch('/:id/start', asyncHandler(takeInProgress));
router.patch('/:id/complete', asyncHandler(completeAppeal));
router.patch('/:id/cancel', asyncHandler(cancelAppeal));
router.get('/', asyncHandler(getAppeals));
router.post('/progress-to-cancel', asyncHandler(cancelAllInProgress));

export default router;