import 'dotenv/config';
import express from 'express';
import config from './config.mts';
import { getDepartureData } from './data.mts';

const app = express();
app.set('view engine', 'pug');
app.set('views', 'src/views');

app.use(express.static('public'));

// Async route handler - void return doesn't matter
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/', async (req, res) => {
    const departureViewData = await getDepartureData(config.watchedRoutes);
    console.log(departureViewData);

    res.render('index', {
        tramData: departureViewData,
    });
});

app.listen(config.serverPort, () => {
    console.log(`✅ listening on port ${config.serverPort}`);
});
