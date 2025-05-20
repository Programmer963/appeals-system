import { Request, Response } from "express";
import { Appeal, AppealStatus } from "../models/appeal";
import { Op } from "sequelize";

export const createAppeal = async (req: Request, res: Response) => {
    try {
        const { subject, message } = req.body;

        if (!subject || !message) {
            res.status(400).json({ error: 'Subject and message are required' }); 
            return;
        }
        
        const appeal = await Appeal.create({ subject, message, status: AppealStatus.NEW });
        res.status(201).json(appeal);
    }
    catch (error) {
        console.error('Error creating appeal: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const takeInProgress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const appeal = await Appeal.findByPk(id);
        if (!appeal) {
            res.status(404).json({ error: 'Appeal not found' });
            return;
        }

        if (appeal.status !== AppealStatus.NEW) {
            res.status(400).json({ error: 'Appeal must be in NEW status' });
        }

        appeal.status = AppealStatus.IN_PROGRESS;
        await appeal.save();
        res.json(appeal);
    }
    catch (error) {
        console.error('Error take IN_PROGRESS: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const completeAppeal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { resolutionText } = req.body;
        
        const appeal = await Appeal.findByPk(id);
        if (!appeal) {
            res.status(404).json({ error: 'Appeal not found' });
            return;
        }
        
        if (appeal.status !== AppealStatus.IN_PROGRESS) {
            res.status(400).json({ error: 'Only IN_PROGRESS appeals can be completed' });
        }
        
        appeal.status = AppealStatus.COMPLETED;
        appeal.resolutionText = resolutionText || '';
        await appeal.save();
        res.json(appeal);
    }
    catch (error) {
        console.error('Error completing appeal: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const cancelAppeal = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const { cancellationReason } = req.body;
        
        const appeal = await Appeal.findByPk(id);
        if (!appeal) {
            res.status(404).json({ error: 'Appeal not found' });
            return;
        }
        
        if (appeal.status === AppealStatus.COMPLETED || appeal.status === AppealStatus.CANCELLED) {
            res.status(400).json({ error: 'Appeal already finished' });
        }
        
        appeal.status = AppealStatus.CANCELLED;
        appeal.cancellationReason = cancellationReason || '';
        await appeal.save();
        res.json(appeal);
    }
    catch (error) {
        console.error('Error canceling appeal: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAppeals = async (req: Request, res: Response) => {
    try {

        const { date, from, to } = req.query;
        
        let where: any = {};
        
        if (date) {
            where.createdAt = {
                [Op.gte]: new Date(date as string),
                [Op.lt]: new Date(new Date(date as string).getTime() + 24 * 60 * 60 * 1000)
            };
        }
        else if (from && to) {
            where.createdAt = {
                [Op.between]: [new Date(from as string), new Date(to as string)],
            };
        }
        
        const appeals = await Appeal.findAll({ where, order: [['createdAt', 'DESC']] });
        res.json(appeals);
    }
    catch (error) {
        console.error('Error getting list of appeals: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const cancelAllInProgress = async (req: Request, res: Response) => {
    try {
        const [count] = await Appeal.update(
            {
                status: AppealStatus.CANCELLED,
                cancellationReason: 'Автоматическая отмена'
            },
            {
                where: { status: AppealStatus.IN_PROGRESS }
            }
        );
        
        res.json({ message: `Canceled ${count} appeal(s)` });
    }
    catch (error) {
        console.error('Error canceling all appeals: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}