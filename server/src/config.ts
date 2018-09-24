import { ClientConfig } from 'pg';
import { env } from 'process';

const dbConf: ClientConfig = {
    host: '127.0.0.1',
    port: 5432,
    user: 'urler',
    password: env.PASSWORD,
    database: 'urler'
}

const baseUrl = env.NODE_ENV === 'dev' ? `http://localhost:${env.PORT}/` : 'https://urler.xyz';

export {
    dbConf,
    baseUrl
}
