import { Router, Request, Response } from 'express';
import pool from './db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const { idSerie } = req.query;
    if (idSerie) {
        const result = await pool.query('SELECT * FROM episodio WHERE id_serie = $1', [Number(idSerie)]);
        return res.json(result.rows);
    }
    const result = await pool.query('SELECT * FROM episodio');
    res.json(result.rows);
});

router.get('/:id', async (req: Request, res: Response) => {
    const result = await pool.query('SELECT * FROM episodio WHERE id = $1', [Number(req.params.id)]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Episódio não encontrado' });
    res.json(result.rows[0]);
});

router.post('/', async (req: Request, res: Response) => {
    const titulo = req.body.titulo;
    const numero = Number(req.body.numero);
    const idSerie = req.body.idSerie ? Number(req.body.idSerie) : null;

    const result = await pool.query(
        'INSERT INTO episodio (titulo, numero, id_serie) VALUES ($1, $2, $3) RETURNING *',
        [titulo, numero, idSerie]
    );
    res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const titulo = req.body.titulo;
    const numero = Number(req.body.numero);
    const idSerie = req.body.idSerie ? Number(req.body.idSerie) : null;

    const result = await pool.query(
        'UPDATE episodio SET titulo = $1, numero = $2, id_serie = $3 WHERE id = $4 RETURNING *',
        [titulo, numero, idSerie, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Episódio não encontrado' });

    res.json(result.rows[0]);
});

router.patch('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const existing = await pool.query('SELECT * FROM episodio WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Episódio não encontrado' });

    const current = existing.rows[0];
    const titulo = req.body.titulo !== undefined ? req.body.titulo : current.titulo;
    const numero = req.body.numero !== undefined ? Number(req.body.numero) : current.numero;
    const idSerie = req.body.idSerie !== undefined ? Number(req.body.idSerie) : current.id_serie;

    const result = await pool.query(
        'UPDATE episodio SET titulo = $1, numero = $2, id_serie = $3 WHERE id = $4 RETURNING *',
        [titulo, numero, idSerie, id]
    );
    res.json(result.rows[0]);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const result = await pool.query('DELETE FROM episodio WHERE id = $1 RETURNING *', [Number(req.params.id)]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Episódio não encontrado' });
    res.json(result.rows[0]);
});

export default router;
