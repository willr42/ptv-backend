import 'dotenv/config';
import apiHandler from './lib/apihandler.mjs';

console.log(await apiHandler.getRoutes());
