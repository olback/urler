import { Client } from 'pg';
import { dbConf } from './config';
import { api } from './api';
import * as express from 'express';
import { env } from 'process';
import * as path from 'path';

const app: express.Express = express();
app.listen(env.PORT, () => {
    console.log(`Listening on ${env.PORT}`);
});

// Logging
app.use(express.json());
app.use((req, _res, next) => {
    console.log(`${req.ip.replace('::ffff:', '')} ${req.url} ${JSON.stringify(req.body, null, 2)}`);
    next();
});

// Api
app.use('/api', api);

// Static Files
app.use(express.static(path.join(process.cwd(), '..', 'public')));

// Catch em' all
app.use('/:id', (req, res) => {

    if (req.params.id.length > 5 && req.params.id.length < 20) {

        const db = new Client(dbConf);
        db.connect();
        db.query('SELECT * FROM links WHERE id=$1 AND (expires >= $2 OR expires = 0)', [req.params.id, +new Date()], async (error, result) => {

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

    } else {

        res.status(400);
        res.json({
            message: 'Bad Request'
        });

    }

});

// Landing page
app.use('/', (_req, res) => {
    res.sendFile(path.join(process.cwd(), '..', 'public', 'index.html'));
});
