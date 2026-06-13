import pool from './db';

function gerarSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now();
}

async function criarUsuario(email: string, senha: string) {
    await pool.query('INSERT INTO usuario (email, senha) VALUES ($1, $2)', [email, senha]);
}

async function buscarUsuarioPorEmail(email: string) {
    const result = await pool.query('SELECT id, email, senha FROM usuario WHERE email = $1', [email]);
    return result.rows[0];
}

async function criaSessao(usuarioId: number, sessionId: string) {
    await pool.query('INSERT INTO sessao (usuario_id, session_id) VALUES ($1, $2)', [usuarioId, sessionId]);
}

async function buscarSessao(sessionId: string) {
    const result = await pool.query('SELECT * FROM sessao WHERE session_id = $1', [sessionId]);
    return result.rows[0];
}

async function deletarSessao(sessionId: string) {
    await pool.query('DELETE FROM sessao WHERE session_id = $1', [sessionId]);
}

async function registrar(email: string, senha: string) {
    await criarUsuario(email, senha);
}

async function login(email: string, senha: string): Promise<string> {
    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario || usuario.senha !== senha) {
        throw new Error('Credenciais inválidas');
    }
    const sessionId = gerarSessionId();
    await criaSessao(usuario.id, sessionId);
    return sessionId;
}

async function logout(sessionId: string) {
    await deletarSessao(sessionId);
}

export { registrar, login, logout, buscarSessao };
