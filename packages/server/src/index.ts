import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";

dotenv.config();

async function startServer() {
    const app = express();
    const PORT = process.env.PORT || 3001;

    app.use(cors({ origin: ["http://localhost:5173"] }));

    const server = new ApolloServer({ 
        typeDefs, 
        resolvers 
    });
    
    await server.start();
    
    server.applyMiddleware({ app, path: "/graphql" });

    app.listen(PORT, () => {
        const blue = '\x1b[36m';
        const reset = '\x1b[0m';
        console.log(`Server at ${blue}http://localhost:${PORT}${server.graphqlPath}${reset} is running`);
    });
}

startServer();