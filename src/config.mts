import { type WatchedRoute } from './data.mjs';
import { possibleRouteTypes } from './lib/apitypes.mjs';

const watchedRoutes: WatchedRoute[] = [
    {
        routeId: '940',
        routeNumber: '70',
        routeType: possibleRouteTypes.tram,
        directionOfInterest: '28',
        stopId: '2158',
    },
    {
        routeId: '958',
        routeNumber: '75',
        routeType: possibleRouteTypes.tram,
        directionOfInterest: '15',
        stopId: '2158',
    },
];

const config = {
    serverPort: process.env.PORT | 3000,
    watchedRoutes,
};

export default config;
