import 'dotenv/config';
import express from 'express';
import config from './config.mts';
import apiHandler from './lib/apihandler.mjs';
import * as url from 'url';

// const watchedRoutes = [];

// for (let index = 0; index < config.watchedRouteNumbers.length; index++) {
//     const routeNumber = config.watchedRouteNumbers[index];

//     if (routeNumber != null) {
//         const routeObj = await apiHandler.getRouteByNumber(routeNumber);
//         watchedRoutes.push(routeObj);
//     }
// }

// console.log(watchedRoutes);

const app = express();
app.set('view engine', 'pug');
app.set('views', 'src/views');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', {
        tramData: [
            {
                routeNumber: '70',
                minutes: ['5', '10'],
            },
            {
                routeNumber: '75',
                minutes: ['5', '10'],
            },
        ],
    });
});

app.listen(config.serverPort, () => {
    console.log(`✅ listening on port ${config.serverPort}`);
});
