import 'dotenv/config';
import express from 'express';
import config from './config.mjs';
import { WatchedRoute, getDepartureData } from './data.mjs';

const app = express();
app.set('view engine', 'pug');
app.set('views', 'src/views');

app.use(express.static('public'));

// Async route handler - void return doesn't matter
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/', async (_, res) => {
    const departureViewData = await getDepartureData(
        config.watchedRoutes['home'] as WatchedRoute[]
    );

    res.render('index', {
        updatePath: '',
        tramData: departureViewData,
    });
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/view/update', async (_, res) => {
    const newViewData = await getDepartureData(
        config.watchedRoutes['home'] as WatchedRoute[]
    );
    res.render('cardgrid', {
        updatePath: '',
        tramData: newViewData,
    });
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/phoebe', async (_, res) => {
    const departureViewData = await getDepartureData(
        config.watchedRoutes['phoebe'] as WatchedRoute[]
    );

    res.render('index', {
        updatePath: '/phoebe',
        tramData: departureViewData,
    });
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/phoebe/view/update', async (_, res) => {
    const newViewData = await getDepartureData(
        config.watchedRoutes['phoebe'] as WatchedRoute[]
    );
    res.render('cardgrid', {
        updatePath: '/phoebe',
        tramData: newViewData,
    });
});

app.listen(config.serverPort, () => {
    console.log(`✅ listening on port ${config.serverPort}`);
});
