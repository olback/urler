import { ClientConfig } from 'pg';
import { env } from 'process';

const dbConf: ClientConfig = {
    host: '127.0.0.1',
    port: 5432,
    user: 'urler',
    password: 'Cz597QJ30rm63yUor09Z',
    database: 'urler'
}

const baseUrl = env.NODE_ENV === 'dev' ? `http://localhost:${env.PORT}/` : 'https://urler.xyz';

export {
    dbConf,
    baseUrl
}
