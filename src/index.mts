import 'dotenv/config';
import express from 'express';
import config from './config.mts';
import apiHandler from './lib/apihandler.mjs';
import * as url from 'url';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));

const watchedRoutes = [];

for (let index = 0; index < config.watchedRouteNumbers.length; index++) {
    const routeNumber = config.watchedRouteNumbers[index];

    if (routeNumber != null) {
        const routeObj = await apiHandler.getRouteByNumber(routeNumber);
        watchedRoutes.push(routeObj);
    }
}

console.log(watchedRoutes);

const app = express();

const tramDiv = '<div>75</div>';

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`
                <!doctype html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Tram Tracker</title>
                    <script
                        src="https://unpkg.com/htmx.org@1.9.6"
                        integrity="sha384-FhXw7b6AlE/jyjlZH5iHa/tTe9EpJ1Y55RjcgPbjeWMskSxZt1v9qkxLJWNJaGni"
                        crossorigin="anonymous"
                    ></script>
                    <link rel="stylesheet" href="style.css" />
                    <link
                        rel="icon"
                        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🚋</text></svg>"
                    />
                </head>
                <body>
                    <main>
                        <div class="card-grid">
                            <div class="card">
                                ${tramDiv}
                                <hr />
                            </div>
                        </div>
                    </main>
                </body>
            </html>`);
    // res.sendFile(dirname + 'frontend/index.html');
});

app.listen(config.serverPort, () => {
    console.log(`✅ listening on port ${config.serverPort}`);
});
