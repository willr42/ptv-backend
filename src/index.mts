import 'dotenv/config';
import apiHandler from './lib/apihandler.mjs';
import config from './config.mts';

const watchedRoutes = [];

for (let index = 0; index < config.watchedRouteNumbers.length; index++) {
    const routeNumber = config.watchedRouteNumbers[index];

    if (routeNumber != null) {
        const routeObj = await apiHandler.getRouteByNumber(routeNumber);
        watchedRoutes.push(routeObj);
    }
}
