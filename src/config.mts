import { type WatchedRoute } from './data.mjs';
import { possibleRouteTypes } from './lib/apitypes.mjs';

const watchedRoutes: Record<string, WatchedRoute[]> = {
    home: [
        {
            routeNumber: '70',
            routeId: '940',
            routeType: possibleRouteTypes.tram,
            directionOfInterest: '28',
            stopId: '2158',
        },
        {
            routeNumber: '75',
            routeId: '958',
            routeType: possibleRouteTypes.tram,
            directionOfInterest: '15',
            stopId: '2158',
        },
    ],
    // Josh
    // {
    //     routeNumber: '11',
    //     routeId: '3343',
    //     routeType: possibleRouteTypes.tram,
    //     directionOfInterest: '5',
    //     stopId: 'xx',
    // },
    // {
    //     routeNumber: '86',
    //     routeId: '1881',
    //     routeType: possibleRouteTypes.tram,
    //     directionOfInterest: '28',
    //     stopId: 'xx',
    // },
    // Phoebe
    phoebe: [
        {
            routeNumber: '109',
            routeId: '722',
            routeType: possibleRouteTypes.tram,
            directionOfInterest: '3',
            stopId: '2509',
        },
    ],
};

const config = {
    serverPort: process.env.PORT | 3000,
    watchedRoutes,
};

export default config;
