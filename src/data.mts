// Hardcode the route type, stop id, and route id.
// Fetch departures.

import apiHandler from './lib/apihandler.mts';
import { type ApiDepartureData } from './lib/apitypes.mts';

export type WatchedRoute = {
    routeId: string;
    routeNumber: string;
    routeType: string;
    directionOfInterest: string;
    stopId: string;
};

type ProcessedDepartureData = {
    scheduledDeparture: Date;
    atPlatform: boolean;
};

export async function getNextDepartures(watchedRoutes: WatchedRoute[]) {
    const nextThreeDepartures = await collateDepartures(watchedRoutes);
}

async function collateDepartures(watchedRoutes: WatchedRoute[]) {
    const departureList: ApiDepartureData[] = [];

    for await (const element of watchedRoutes) {
        if (element == null) {
            continue;
        }
        const res = await fetchDepartures(element);
        if (res == null) {
            continue;
        }
        const routeDepartures = res?.departures;
        if (routeDepartures == null) {
            continue;
        }

        departureList.push(...routeDepartures);
    }

    const removeFinishedTrips = departureList.filter((departure) => {
        const departureDate = new Date(departure.scheduled_departure_utc);
        const now = new Date();
        return departureDate.getTime() > now.getTime();
    });

    const departurePerRoute: Record<string, ProcessedDepartureData[]> = {};

    for (const departure of removeFinishedTrips) {
        const routeId = departure.route_id.toString();
        if (departurePerRoute[routeId] == null) {
            departurePerRoute[routeId] = [];
        }

        const departureData: ProcessedDepartureData = {
            scheduledDeparture: new Date(departure.scheduled_departure_utc),
            atPlatform: departure.at_platform,
        };
        departurePerRoute[routeId]?.push(departureData);
    }

    const nextThreeDepartures: Record<string, ProcessedDepartureData[]> = {};

    for (const route in departurePerRoute) {
        if (Object.prototype.hasOwnProperty.call(departurePerRoute, route)) {
            const departureArray = departurePerRoute[route];

            if (departureArray == null) {
                continue;
            }

            if (nextThreeDepartures[route] == null) {
                nextThreeDepartures[route] = [];
            }
            nextThreeDepartures[route] = departureArray?.slice(0, 3);
        }
    }

    return nextThreeDepartures;
}

async function fetchDepartures(watchedRoute: WatchedRoute) {
    return await apiHandler.getDeparturesForSpecificRoute(
        watchedRoute.routeType,
        watchedRoute.stopId,
        watchedRoute.routeId,
        watchedRoute.directionOfInterest
    );
}
