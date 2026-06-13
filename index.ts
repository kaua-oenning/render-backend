import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
import authRouter from './auth';
import authMiddleware from './authMiddleware';
import rotasPlataforma from './plataforma';
import rotasSerie from './serie';
import rotasEpisodio from './episodio';

const app = express();
app.use(express.json());
app.use(cookieParser());
// CORS baseado na configuração do meu ngrok (ngrok http 4000)...
app.use(cors({ origin: 'http://localhost:4000', credentials: true }));

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'");
    next();
});

app.use('/auth', authRouter);

app.use('/plataforma', authMiddleware, rotasPlataforma);
app.use('/serie', authMiddleware, rotasSerie);
app.use('/episodio', authMiddleware, rotasEpisodio);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
}));

http.createServer({}, app).listen(3000, () => {
    console.log('Servidor iniciado');
});
