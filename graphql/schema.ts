import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Plataforma {
        id: Int!
        nome: String!
    }

    type Serie {
        id: Int!
        titulo: String!
        temporadas: Int!
        id_plataforma: Int
    }

    type Episodio {
        id: Int!
        titulo: String!
        numero: Int!
        id_serie: Int
    }

    type MensagemPlataforma {
        mensagem: String!
        plataforma: Plataforma!
    }

    type AuthResponse {
        mensagem: String!
    }

    type Query {
        plataformas: [Plataforma!]!
        plataforma(id: Int!): Plataforma
        series(idPlataforma: Int): [Serie!]!
        serie(id: Int!): Serie
        episodios(idSerie: Int): [Episodio!]!
        episodio(id: Int!): Episodio
    }

    type Mutation {
        registrar(email: String!, senha: String!): AuthResponse!
        login(email: String!, senha: String!): AuthResponse!
        logout(sessionId: String!): AuthResponse!

        criarPlataforma(nome: String!): Plataforma!
        atualizarPlataforma(id: Int!, nome: String!): Plataforma
        deletarPlataforma(id: Int!): MensagemPlataforma

        criarSerie(titulo: String!, temporadas: Int, idPlataforma: Int): Serie!
        atualizarSerie(id: Int!, titulo: String!, temporadas: Int!, idPlataforma: Int): Serie
        atualizarParcialSerie(id: Int!, titulo: String, temporadas: Int, idPlataforma: Int): Serie
        deletarSerie(id: Int!): Serie

        criarEpisodio(titulo: String!, numero: Int!, idSerie: Int): Episodio!
        atualizarEpisodio(id: Int!, titulo: String!, numero: Int!, idSerie: Int): Episodio
        atualizarParcialEpisodio(id: Int!, titulo: String, numero: Int, idSerie: Int): Episodio
        deletarEpisodio(id: Int!): Episodio
    }
`);

export default schema;
