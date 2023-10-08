import 'dotenv/config';
import express from 'express';
import config from './config.mjs';
import { getDepartureData } from './data.mjs';

const app = express();
app.set('view engine', 'pug');
app.set('views', 'src/views');

// app.use(express.static('public'));

// Async route handler - void return doesn't matter
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/', async (req, res) => {
    const departureViewData = await getDepartureData(config.watchedRoutes);

    console.log('Request: ', req.ip);

    res.render('index', {
        tramData: departureViewData,
    });
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/view/update', async (_, res) => {
    const newViewData = await getDepartureData(config.watchedRoutes);
    res.render('cardgrid', {
        tramData: newViewData,
    });
});

app.listen(config.serverPort, () => {
    console.log(`✅ listening on port ${config.serverPort}`);
});
