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

export async function getDepartureData(watchedRoutes: WatchedRoute[]) {
    const nextThreeDepartures = await getNextThreeDepartures(watchedRoutes);
    const departureViewData = [];
    for (const route in nextThreeDepartures) {
        if (Object.prototype.hasOwnProperty.call(nextThreeDepartures, route)) {
            const departureArray = nextThreeDepartures[route];
            const departure: {
                routeNumber: string;
                minutes: number[] | undefined;
            } = {
                routeNumber: '',
                minutes: undefined,
            };
            departure.routeNumber = route;
            departure.minutes = departureArray?.map((departure) => {
                const now = new Date();
                const timeDiffInMs =
                    departure.scheduledDeparture.getTime() - now.getTime();
                const timeDiffInMinutes = Math.floor(
                    timeDiffInMs / (1000 * 60)
                );
                return timeDiffInMinutes;
            });

            departureViewData.push(departure);
        }
    }
    return departureViewData;
}

async function getNextThreeDepartures(watchedRoutes: WatchedRoute[]) {
    const departures = await collateDepartures(watchedRoutes);

    for (const departure in departures) {
        if (Object.prototype.hasOwnProperty.call(departures, departure)) {
            const depArray = departures[departure];

            if (depArray == null) {
                continue;
            }

            departures[departure] = depArray.slice(0, 3);
        }
    }

    return departures;
}

async function collateDepartures(watchedRoutes: WatchedRoute[]) {
    const departurePerRoute: Record<string, ProcessedDepartureData[]> = {};

    for await (const route of watchedRoutes) {
        if (route == null) {
            continue;
        }

        const res = await fetchDepartures(route);
        if (res == null) {
            continue;
        }

        const routeDepartures = res?.departures;
        if (routeDepartures == null) {
            continue;
        }

        if (departurePerRoute[route.routeNumber] == null) {
            departurePerRoute[route.routeNumber] = [];
        }

        // Remove departures that have happened today and create final data object
        const departureData: ProcessedDepartureData[] = routeDepartures
            .filter((departure) => {
                const departureDate = new Date(
                    departure.scheduled_departure_utc
                );
                const now = new Date();
                return departureDate.getTime() > now.getTime();
            })
            .map((apiDeparture) => {
                return {
                    scheduledDeparture: new Date(
                        apiDeparture.scheduled_departure_utc
                    ),
                    atPlatform: apiDeparture.at_platform,
                };
            });

        departurePerRoute[route.routeNumber] = departureData;
    }

    return departurePerRoute;
}

async function fetchDepartures(watchedRoute: WatchedRoute) {
    return await apiHandler.getDeparturesForSpecificRoute(
        watchedRoute.routeType,
        watchedRoute.stopId,
        watchedRoute.routeId,
        watchedRoute.directionOfInterest
    );
}
