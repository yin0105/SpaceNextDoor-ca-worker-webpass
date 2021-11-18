/* Libraries */
const express   = require("express");
const https     = require("https");
const http      = require("http")
const helmet    = require("helmet");
const fs        = require('fs');
const cors      = require('cors')
const winston   = require('winston');
const expressWinston = require('express-winston');
const bodyParser = require("body-parser"); 

const logger = require('./includes/logging/main');
const config = require('./config');
const populateDoors = require('./includes/functions/populate-doors');
const api = require('./includes/connectors/masterApi');
const refreshToken = require('./includes/functions/refresh-token');
const cache = require('./includes/cache/main')

/* Create server */
const app = express();

/* Helmet security policies */
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

/* CORS */
if(config.server.cors.enabled){
    const corsOptions = {
        origin: config.server.cors.origin,
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions))
}

/* Add body parser */
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/* Logger */
app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true,
    msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}", 
    colorize: true, 
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

let usedPort = 0;

/* HTTP Server */
if(config.server.http.enabled){
    const httpServer = http.createServer(app)
    httpServer.listen(config.server.http.port, () => {
        logger.info('HTTP server started on port '+config.server.http.port)
    })
    usedPort = config.server.http.port;

    /* Error processing */
    httpServer.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            logger.error('Port ('+config.server.http.port+') is already in use - please pick a new HTTP port');
            process.exit(1)
        }
        if (e.code === 'EACCES') {
            logger.error('Please run script as root');
            process.exit(1)
        }
    });
}

/* HTTPS server */
if(config.server.https.enabled){

    const credentials = {key: fs.readFileSync(config.server.https.key), cert: fs.readFileSync(config.server.https.cert)}

    app.use(helmet.hsts());
    const httpsServer = https.createServer(credentials, app)
    httpsServer.listen(config.server.https.port, () => {
        logger.error('HTTP server started on port '+config.server.https.port)
    })

    usedPort = config.server.http.port;

    /* Error processing */
    httpsServer.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            logger.error('Port ('+config.server.https.port+') is already in use - please pick a new HTTPS port');
            process.exit(1)
        }
        if (e.code === 'EACCES') {
            logger.error('Please run script as root');
            process.exit(1)
        }
    });
}

/* Create routes */
const routes = require('./routes/routes')
app.use('/', routes);


/* Startup sequence */
const startup = () => {
    if(config.providerId.length > 0){
        if(config.doors.length >0){
            config.doors.forEach((door)=>{
                cache.doors[door] = {
                    status: 'closed',
                    provider: config.providerId,
                    doorId: door,
                    internalId: door,
                }
                logger.info("Added door: ", cache.doors[door]);
            });
            cache.doorlist = config.doors
            registerDoors();
        }else{
            logger.info("No doors found, registering doors");
            populateDoors(registerDoors);
        }
    }else{
        logger.error('Error: No provider ID set - Please set provider id in config')
    }
}

/* register doors on pain servers */
const registerDoors = () =>{
    let arr = Object.keys(cache.doors).map((k) => cache.doors[k])
    api.post('/api/worker/register',{
        doors: arr,
        provider: config.providerId,
        port: usedPort,
        ssl: config.server.https.enabled
    }).then((success)=>{
        if(success.data.status == 'success'){
            cache.registerKey = success.data.registerKey;
            cache.initialized = true;
            cache.providerId = config.providerId;
            logger.info("Doors successfully registered on server - registerKey: "+cache.registerKey);
            logger.info("Initialization complete");
        }else{
            console.log(success.data)
            logger.error('Error: Error on main server side while registering')
        }
    }).catch((error)=>{
        console.log(error)
        logger.error('Error: Failed to register doors at main server')
    })
}

/* Before anything, generate authentication token */
if(config.token.fetch){
    logger.info("Fetching token to work with");
    refreshToken().then(()=>{
        setInterval(()=>{
            refreshToken()
        }, config.token.refresh)
        startup()
    })
}else{
    refreshToken() // to set the token
    startup()
}
