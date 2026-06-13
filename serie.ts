import { Router, Request, Response } from 'express';
import pool from './db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const { idPlataforma } = req.query;
    if (idPlataforma) {
        const result = await pool.query('SELECT * FROM serie WHERE id_plataforma = $1', [Number(idPlataforma)]);
        return res.json(result.rows);
    }
    const result = await pool.query('SELECT * FROM serie');
    res.json(result.rows);
});

router.get('/:id', async (req: Request, res: Response) => {
    const result = await pool.query('SELECT * FROM serie WHERE id = $1', [Number(req.params.id)]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Série não encontrada' });
    res.json(result.rows[0]);
});

router.post('/', async (req: Request, res: Response) => {
    const titulo = req.body.titulo;
    const temporadas = req.body.temporadas ? Number(req.body.temporadas) : 1;
    const idPlataforma = req.body.idPlataforma ? Number(req.body.idPlataforma) : null;

    const result = await pool.query(
        'INSERT INTO serie (titulo, temporadas, id_plataforma) VALUES ($1, $2, $3) RETURNING *',
        [titulo, temporadas, idPlataforma]
    );
    res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const titulo = req.body.titulo;
    const temporadas = Number(req.body.temporadas);
    const idPlataforma = req.body.idPlataforma ? Number(req.body.idPlataforma) : null;

    const result = await pool.query(
        'UPDATE serie SET titulo = $1, temporadas = $2, id_plataforma = $3 WHERE id = $4 RETURNING *',
        [titulo, temporadas, idPlataforma, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Série não encontrada' });

    res.json(result.rows[0]);
});

router.patch('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const existing = await pool.query('SELECT * FROM serie WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Série não encontrada' });

    const current = existing.rows[0];
    const titulo = req.body.titulo !== undefined ? req.body.titulo : current.titulo;
    const temporadas = req.body.temporadas !== undefined ? Number(req.body.temporadas) : current.temporadas;
    const idPlataforma = req.body.idPlataforma !== undefined ? Number(req.body.idPlataforma) : current.id_plataforma;

    const result = await pool.query(
        'UPDATE serie SET titulo = $1, temporadas = $2, id_plataforma = $3 WHERE id = $4 RETURNING *',
        [titulo, temporadas, idPlataforma, id]
    );
    res.json(result.rows[0]);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const result = await pool.query('DELETE FROM serie WHERE id = $1 RETURNING *', [Number(req.params.id)]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Série não encontrada' });
    res.json(result.rows[0]);
});

export default router;
