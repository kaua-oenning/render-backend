import pool from '../db';
import { registrar, login, logout } from '../authService';

const resolvers = {
    registrar: async ({ email, senha }: { email: string; senha: string }) => {
        await registrar(email, senha);
        return { mensagem: 'Usuário criado com sucesso' };
    },
    login: async ({ email, senha }: { email: string; senha: string }) => {
        await login(email, senha);
        return { mensagem: 'Login realizado com sucesso' };
    },
    logout: async ({ sessionId }: { sessionId: string }) => {
        await logout(sessionId);
        return { mensagem: 'Logout realizado com sucesso' };
    },

    plataformas: async () => {
        const result = await pool.query('SELECT * FROM plataforma');
        return result.rows;
    },
    plataforma: async ({ id }: { id: number }) => {
        const result = await pool.query('SELECT * FROM plataforma WHERE id = $1', [id]);
        return result.rows[0] || null;
    },
    criarPlataforma: async ({ nome }: { nome: string }) => {
        const result = await pool.query('INSERT INTO plataforma (nome) VALUES ($1) RETURNING *', [nome]);
        return result.rows[0];
    },
    atualizarPlataforma: async ({ id, nome }: { id: number; nome: string }) => {
        const result = await pool.query('UPDATE plataforma SET nome = $1 WHERE id = $2 RETURNING *', [nome, id]);
        return result.rows[0] || null;
    },
    deletarPlataforma: async ({ id }: { id: number }) => {
        const result = await pool.query('DELETE FROM plataforma WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return null;
        return { mensagem: 'Plataforma removida com sucesso', plataforma: result.rows[0] };
    },

    series: async ({ idPlataforma }: { idPlataforma?: number }) => {
        if (idPlataforma) {
            const result = await pool.query('SELECT * FROM serie WHERE id_plataforma = $1', [idPlataforma]);
            return result.rows;
        }
        const result = await pool.query('SELECT * FROM serie');
        return result.rows;
    },
    serie: async ({ id }: { id: number }) => {
        const result = await pool.query('SELECT * FROM serie WHERE id = $1', [id]);
        return result.rows[0] || null;
    },
    criarSerie: async ({ titulo, temporadas, idPlataforma }: { titulo: string; temporadas?: number; idPlataforma?: number }) => {
        const result = await pool.query(
            'INSERT INTO serie (titulo, temporadas, id_plataforma) VALUES ($1, $2, $3) RETURNING *',
            [titulo, temporadas ?? 1, idPlataforma ?? null]
        );
        return result.rows[0];
    },
    atualizarSerie: async ({ id, titulo, temporadas, idPlataforma }: { id: number; titulo: string; temporadas: number; idPlataforma?: number }) => {
        const result = await pool.query(
            'UPDATE serie SET titulo = $1, temporadas = $2, id_plataforma = $3 WHERE id = $4 RETURNING *',
            [titulo, temporadas, idPlataforma ?? null, id]
        );
        return result.rows[0] || null;
    },
    atualizarParcialSerie: async ({ id, titulo, temporadas, idPlataforma }: { id: number; titulo?: string; temporadas?: number; idPlataforma?: number }) => {
        const existing = await pool.query('SELECT * FROM serie WHERE id = $1', [id]);
        if (existing.rows.length === 0) return null;

        const current = existing.rows[0];
        const result = await pool.query(
            'UPDATE serie SET titulo = $1, temporadas = $2, id_plataforma = $3 WHERE id = $4 RETURNING *',
            [
                titulo !== undefined ? titulo : current.titulo,
                temporadas !== undefined ? temporadas : current.temporadas,
                idPlataforma !== undefined ? idPlataforma : current.id_plataforma,
                id
            ]
        );
        return result.rows[0];
    },
    deletarSerie: async ({ id }: { id: number }) => {
        const result = await pool.query('DELETE FROM serie WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] || null;
    },

    episodios: async ({ idSerie }: { idSerie?: number }) => {
        if (idSerie) {
            const result = await pool.query('SELECT * FROM episodio WHERE id_serie = $1', [idSerie]);
            return result.rows;
        }
        const result = await pool.query('SELECT * FROM episodio');
        return result.rows;
    },
    episodio: async ({ id }: { id: number }) => {
        const result = await pool.query('SELECT * FROM episodio WHERE id = $1', [id]);
        return result.rows[0] || null;
    },
    criarEpisodio: async ({ titulo, numero, idSerie }: { titulo: string; numero: number; idSerie?: number }) => {
        const result = await pool.query(
            'INSERT INTO episodio (titulo, numero, id_serie) VALUES ($1, $2, $3) RETURNING *',
            [titulo, numero, idSerie ?? null]
        );
        return result.rows[0];
    },
    atualizarEpisodio: async ({ id, titulo, numero, idSerie }: { id: number; titulo: string; numero: number; idSerie?: number }) => {
        const result = await pool.query(
            'UPDATE episodio SET titulo = $1, numero = $2, id_serie = $3 WHERE id = $4 RETURNING *',
            [titulo, numero, idSerie ?? null, id]
        );
        return result.rows[0] || null;
    },
    atualizarParcialEpisodio: async ({ id, titulo, numero, idSerie }: { id: number; titulo?: string; numero?: number; idSerie?: number }) => {
        const existing = await pool.query('SELECT * FROM episodio WHERE id = $1', [id]);
        if (existing.rows.length === 0) return null;

        const current = existing.rows[0];
        const result = await pool.query(
            'UPDATE episodio SET titulo = $1, numero = $2, id_serie = $3 WHERE id = $4 RETURNING *',
            [
                titulo !== undefined ? titulo : current.titulo,
                numero !== undefined ? numero : current.numero,
                idSerie !== undefined ? idSerie : current.id_serie,
                id
            ]
        );
        return result.rows[0];
    },
    deletarEpisodio: async ({ id }: { id: number }) => {
        const result = await pool.query('DELETE FROM episodio WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] || null;
    },
};

export default resolvers;
