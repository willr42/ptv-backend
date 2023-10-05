/**
 * Status that appears on every API response
 */
type PtvApiStatus = {
    version: string;
    health: number;
};

/**
 * Type that represents all possible resources we can fetch from API
 */
type PtvApiResources = 'routes' | 'stops' | 'route_types' | 'departures';

/**
 * Dynamic type for all API responses
 */
type PtvApiResponse<T> = {
    status: PtvApiStatus;
} & Record<PtvApiResources, T>;

const possibleRouteTypes = {
    train: '0',
    tram: '1',
    bus: '2',
    vline: '3',
    nightBus: '4',
};

type ApiRouteTypeData = {
    route_type_name: string;
    route_type: number;
};

/**
 * Type for responses returned by `/v3/routes`
 */
type ApiRouteData = {
    route_service_status: {
        description: string;
        timestamp: string;
    };
    route_type: number;
    route_id: number;
    route_name: string;
    route_number: string;
    route_gtfs_id: string;
    geopath: any[]; // You can replace 'any' with the specific type if you know the structure
};

/**
 * Type for responses returned by `/v3/stops`
 */
type ApiStopData = {
    disruption_ids: number[];
    stop_suburb: string;
    route_type: number;
    stop_latitude: number;
    stop_longitude: number;
    stop_sequence: number;
    stop_ticket: {
        ticket_type: string;
        zone: string;
        is_free_fare_zone: boolean;
        ticket_machine: boolean;
        ticket_checks: boolean;
        vline_reservation: boolean;
        ticket_zones: number[];
    };
};

type ApiDepartureData = {
    stop_id: number;
    route_id: number;
    run_id: number;
    run_ref: string;
    direction_id: number;
    disruption_ids: number[];
    scheduled_departure_utc: string;
    estimated_departure_utc: string;
    at_platform: boolean;
    platform_number: string;
    flags: string;
    departure_sequence: number;
};

type ApiDirectionData = {
    route_direction_description: string;
    direction_id: number;
    direction_name: string;
    route_id: number;
    route_type: number;
};

export type {
    PtvApiResponse,
    ApiRouteData,
    ApiRouteTypeData,
    ApiStopData,
    ApiDepartureData,
    ApiDirectionData,
};

export { possibleRouteTypes };
