import { Request, Response } from "express";
import { Appeal } from "../models/appeal";
import { AppealStatus } from "../types/appeal";
import { Op } from "sequelize";

export const createAppeal = async (req: Request, res: Response) => {
    const { subject, message } = req.body;

    if (!subject || !message) {
        res.status(400).json({ error: 'Subject and message are required' }); 
        return;
    }
    
    const appeal = await Appeal.create({ subject, message, status: AppealStatus.NEW });
    res.status(201).json(appeal);
}

export const takeInProgress = async (req: Request, res: Response) => {
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

export const completeAppeal = async (req: Request, res: Response) => {
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

export const cancelAppeal = async (req: Request, res: Response) => {
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

export const getAppeals = async (req: Request, res: Response) => {
    const { 
        status,
        subject,
        from,
        to,
        sort = 'createdAt',
        order = 'desc',
        page = '1',
        pageSize = '10'
    } = req.query;
    
    let where: any = {};
    
    if (status) {
        where.status = status;
    }

    if (subject) {
        where.subject = { [Op.iLike]: `%${subject}%` };
    }

    if (from || to) {
        where.createdAt = {};
        if (from) where.createdAt[Op.gte] = new Date(from as string);
        if (to) where.createdAt[Op.lte] = new Date(to as string);
    }

    const limit = parseInt(pageSize as string, 10);
    const offset = (parseInt(page as string, 10) - 1) * limit;

    const { rows: appeals, count: total } = await Appeal.findAndCountAll({
        where,
        order: [[ sort as string, order as string ]],
        limit,
        offset
    });

    res.json({
        total,
        page: parseInt(page as string),
        pageSize: limit,
        appeals
    });
}

export const cancelAllInProgress = async (req: Request, res: Response) => {
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