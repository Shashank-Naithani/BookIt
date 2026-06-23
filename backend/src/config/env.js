import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
    // Server Config
    "PORT",
    "NODE_ENV",

    // Client Config
    "CLIENT_URL",

    // DB Config
    "DATABASE_URL",

    // Jwt Config
    "JWT_SECRET",
];

requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(
            `Missing required environment variable: ${variable}`
        );
    }
});

export const env = {
    // Server Config
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,

    // Client Config
    CLIENT_URL: process.env.CLIENT_URL,

    // Database Config
    DATABASE_URL: process.env.DATABASE_URL,

    // JWT Config
    JWT_SECRET: process.env.JWT_SECRET,
};