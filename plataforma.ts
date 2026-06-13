import { Router, Request, Response } from 'express';
import pool from './db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const result = await pool.query('SELECT * FROM plataforma');
    if (result.rows.length === 0) return res.status(204).send();
    res.json(result.rows);
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ mensagem: 'O ID informado não é válido' });

    const result = await pool.query('SELECT * FROM plataforma WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensagem: 'Nenhuma plataforma encontrada com esse ID' });

    res.json(result.rows[0]);
});

router.post('/', async (req: Request, res: Response) => {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ mensagem: 'Informe o nome da plataforma' });

    const result = await pool.query('INSERT INTO plataforma (nome) VALUES ($1) RETURNING *', [nome]);
    res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { nome } = req.body;

    if (!nome) return res.status(400).json({ mensagem: 'O nome não pode estar vazio' });

    const result = await pool.query('UPDATE plataforma SET nome = $1 WHERE id = $2 RETURNING *', [nome, id]);
    if (result.rows.length === 0) return res.status(404).json({ mensagem: 'Plataforma não existe no sistema' });

    res.json(result.rows[0]);
});

router.patch('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const existing = await pool.query('SELECT * FROM plataforma WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ mensagem: 'Plataforma não existe no sistema' });

    const nome = req.body.nome !== undefined ? req.body.nome : existing.rows[0].nome;

    const result = await pool.query('UPDATE plataforma SET nome = $1 WHERE id = $2 RETURNING *', [nome, id]);
    res.json(result.rows[0]);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const result = await pool.query('DELETE FROM plataforma WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensagem: 'Não foi possível deletar: plataforma não encontrada' });

    res.json({ mensagem: 'Plataforma removida com sucesso', plataforma: result.rows[0] });
});

export default router;
