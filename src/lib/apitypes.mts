/**
 * Status that appears on every API response
 */
type PtvApiStatus = {
    version: string;
    health: number;
};

/**
 * Dynamic type for all API responses
 */
type PtvApiResponse<T> = {
    status: PtvApiStatus;
} & Record<'routes' | 'stops', T>;

/**
 * Type for responses returned by `/v3/routes`
 */
type RouteInfo = {
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
type StopInfo = {
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

export type { PtvApiResponse, RouteInfo, StopInfo };
