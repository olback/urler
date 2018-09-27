import { Client } from 'pg';
import { dbConf } from './config';
import { api } from './api';
import * as express from 'express';
import { env } from 'process';
import * as path from 'path';

const app: express.Express = express();
app.listen(env.PORT, () => {
    console.log(`Listening on port ${env.PORT}`);
});

// Logging
if (env.NODE_ENV === 'dev') {
    app.use(express.json());
    app.use((req, _res, next) => {
        console.log(`${req.ip.replace('::ffff:', '')} ${req.url} ${JSON.stringify(req.body, null, 2)}`);
        next();
    });
}

// Api
app.use('/api', api);

// Static Files
app.use(express.static(path.join(process.cwd(), '..', 'public')));

// Catch em' all
app.get('/:id', (req, res) => {

    const db = new Client(dbConf);
    db.connect();
    db.query('SELECT * FROM links WHERE id=$1 AND (expires >= $2 OR expires = 0)', [req.params.id, Number((+new Date()).toString().substring(0, 10))], async (error, result) => {

        if (error) {

            res.status(500);
            res.json({
                message: 'Internal Server Error'
            });

        } else if (result.rows.length === 1) {

            // res.redirect(301, result.rows[0].url);
            res.redirect(result.rows[0].url);
            await db.query('UPDATE links SET clicks = clicks + 1 WHERE id = $1;', [req.params.id])
            console.log(`${req.params.id} -> ${result.rows[0].url}`);

        } else {

            res.status(404);
            res.json({
                message: 'Not Found'
            });

        }

        db.end();

    });

});

// Landing page
app.get('/', (_req, res) => {
    res.sendFile(path.join(process.cwd(), '..', 'public', 'index.html'));
});

app.use('**', (_req, res) => {

    res.status(404);
    res.json({
        message: 'Not Found'
    });

});
