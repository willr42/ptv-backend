import 'dotenv/config';
import apiHandler from './lib/apihandler.mjs';
import { possibleRouteTypes as routeTypes } from './lib/apitypes.mts';

console.log(await apiHandler.getAllStops('1', routeTypes.train));
