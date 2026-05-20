// prisma.config.ts
import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env para o process.env
dotenv.config();

export default defineConfig({
    // local do schema
    schema: './src/infrastructure/database/prisma/schema.prisma',
    datasource: {
        // Aqui vai a URL para o Prisma Migrate funcionar
        url: process.env.DATABASE_URL,
    },
    migrations: {
        seed: 'npx tsx ./src/infrastructure/database/prisma/seed.ts',
    }
});