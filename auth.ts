import { Router, Request, Response } from 'express';
import { registrar, login, logout } from './authService';

const router = Router();

router.post('/registrar', async (req: Request, res: Response) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Email e senha obrigatórios' });

    try {
        await registrar(email, senha);
        res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
    } catch (err) {
        res.status(400).json({ error: 'Erro ao registrar usuário' });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Email e senha obrigatórios' });

    try {
        const sessionId = await login(email, senha);
        res.cookie('sessionId', sessionId, { httpOnly: true });
        res.json({ mensagem: 'Login realizado com sucesso' });
    } catch (err) {
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

router.post('/logout', async (req: Request, res: Response) => {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) return res.status(400).json({ error: 'Nenhuma sessão ativa' });

    await logout(sessionId);
    res.clearCookie('sessionId');
    res.json({ mensagem: 'Logout realizado com sucesso' });
});

export default router;
