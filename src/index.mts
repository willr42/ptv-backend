import 'dotenv/config';
import express from 'express';
import config from './config.mts';
import { collateDepartures } from './data.mts';

const app = express();
app.set('view engine', 'pug');
app.set('views', 'src/views');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', {
        tramData: [
            {
                routeNumber: '70',
                minutes: ['1', '10'],
                disruptions:
                    'Lorem loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem',
            },
            {
                routeNumber: '75',
                minutes: ['5', '10'],
                disruptions:
                    'Lorem loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem',
            },
        ],
    });
});

app.listen(config.serverPort, () => {
    console.log(`✅ listening on port ${config.serverPort}`);
});

const departures = await collateDepartures(config.watchedRoutes);
console.log(departures);
