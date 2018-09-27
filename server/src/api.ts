import { Router, json as bodyParser } from 'express';
// @ts-ignore
import * as isUrl from 'is-url';
import { Client } from 'pg';
import { dbConf, baseUrl } from './config';
import * as url from 'url';

interface ApiRoute {
    method: 'GET' | 'POST';
    path: string;
}

const api: Router = Router();

api.use(bodyParser());

api.get('/', (_req, res) => {

    const apiRoutes: ApiRoute[] = [
        {
            method: 'GET',
            path: '/'
        },
        {
            method: 'GET',
            path: '/:id'
        },
        {
            method: 'POST',
            path: '/new'
        }
    ];

    res.json(apiRoutes);

});

api.get('/:id', (req, res) => {

    const db = new Client(dbConf);
    db.connect();
    db.query('SELECT * FROM links WHERE id=$1', [req.params.id], async (error, result) => {

        if (error) {

            res.status(500);
            res.json({
                message: 'Internal Server Error'
            });

        } else if (result.rows.length === 1) {

            res.send({
                id: result.rows[0].id,
                url: result.rows[0].url,
                clicks: Number(result.rows[0].clicks),
                expires: Number(result.rows[0].expires)
            });

        } else {

            res.status(404);
            res.json({
                message: 'Not Found'
            });

        }

        db.end();

    });

});

api.post('/new', (req, res) => {

    const data = {
        id: (Math.random() * 1E10).toString(36).replace('.', ''),
        url: '',
        expires: 0
    }

    if (isUrl(req.body.url) && typeof req.body.expires === 'number') {

        data.url = req.body.url;
        data.expires = Number(req.body.expires.toString().substring(0, 10));

    } else if (isUrl(req.body.url)) {

        data.url = req.body.url;

    } else {

        res.status(400);
        res.json({
            message: 'Bad Request'
        });

        return;

    }

    const db = new Client(dbConf);
    db.connect();
    db.query('INSERT INTO links (id, url, clicks, expires) VALUES ($1, $2, 0, $3)', [data.id, data.url, data.expires], (error, _r) => {

        if (error) {

            res.status(500);
            res.json({
                message: 'Internal Server Error',
                data: data,
                body: req.body
            });

            console.log(error);

        } else {

            res.status(200);
            res.json({
                message: 'OK',
                url: url.resolve(baseUrl, data.id),
                expires: data.expires
            });

        }

        db.end();

    });

});

api.use('**', (_req, res) => {
    res.status(501);
    res.json({
        message: 'Not Implemented'
    });
});


export {
    api
}
