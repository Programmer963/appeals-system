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

/**
 * @swagger
 * /api/appeals:
 *   post:
 *     summary: Создать новое обращение
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subject, message]
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Обращение успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appeal'
 */
router.post('/', asyncHandler(createAppeal));

/**
 * @swagger
 * /api/appeals/{id}/start:
 *   patch:
 *     summary: Взять обращение в работу
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Обращение взято в работу
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appeal'
 */
router.patch('/:id/start', asyncHandler(takeInProgress));

/**
 * @swagger
 * /api/appeals/{id}/complete:
 *   patch:
 *     summary: Завершить обращение
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resolutionText]
 *             properties:
 *               resolutionText:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обращение завершено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appeal'
 */
router.patch('/:id/complete', asyncHandler(completeAppeal));

/**
 * @swagger
 * /api/appeals/{id}/cancel:
 *   patch:
 *     summary: Отменить обращение
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cancellationReason]
 *             properties:
 *               cancellationReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обращение отменено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appeal'
 */
router.patch('/:id/cancel', asyncHandler(cancelAppeal));

/**
 * @swagger
 * /api/appeals:
 *   get:
 *     summary: Получить список обращений
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [новое, в работе, завершено, отменено]
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Список обращений с пагинацией и фильтрацией
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *                 appeals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appeal'
 */
router.get('/', asyncHandler(getAppeals));

/**
 * @swagger
 * /api/appeals/progress-to-cancel:
 *   post:
 *     summary: Отменить все обращения в статусе "В работе"
 *     responses:
 *       200:
 *         description: Все обращения в работе отменены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Canceled 1 appeal(s)
 */
router.post('/progress-to-cancel', asyncHandler(cancelAllInProgress));


export default router;
