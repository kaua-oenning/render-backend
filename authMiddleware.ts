import { Request, Response, NextFunction } from 'express';
import { buscarSessao } from './authService';

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Não autenticado' });
    }

    const sessao = await buscarSessao(sessionId);

    if (!sessao) {
        return res.status(401).json({ error: 'Sessão inválida' });
    }

    (req as any).usuarioId = sessao.usuario_id;
    next();
}

export default authMiddleware;
