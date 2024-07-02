const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const winston = require("winston");
const morgan = require('morgan');
const ErrorMiddleware = require("./http/middleware/error");
const api = require("./routes/api");
const config = require("config");
const csp = require("helmet-csp");
const noCache = require("./http/middleware/cache");
require("express-async-errors");
require("winston-mongodb");

class Application {
    constructor() {
        this.setup_express();
        this.setup_database();
        this.setup_routesAndMidleware();
        this.setup_error_handling();
    }
    setup_error_handling() {
        winston.add(new winston.transports.File({
            filename: "error_logs.log",
            level: "error"
        }),
        );
        process.on('uncaughtException', (err) => {
            console.log(err);
            winston.error(err.message);
        });
        process.on('unhandledRejection', (err) => {
            console.log(err);
            winston.error(err.message);
        });
    }
    setup_routesAndMidleware() {
        //body parsing 
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        //log production requests
        if (app.get('env') === 'production') app.use(morgan('tiny'));
        //enable cors
        app.use(cors());
        //setup middleware
        app.use(ErrorMiddleware);
        app.use(noCache);
        //setup routs
        app.use("/api", api);
        //defend from XSS attack
        app.use(csp({
            defaultSrc: ["self", config.get("domain")],
            reportOnly: false,
            setAllHeader: false,
        }))
        //front part
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');
        app.set('views', __dirname + '/views');
        app.set('view cache', false); 
        app.use(express.static("public"));
    }
    setup_database() {
        mongoose.connect(config.get("databaseAddress"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("db connected");
        }).catch((err) => {
            console.log("db not connected", err);
        })
    }
    setup_express() {
        const port = process.env.myPort || 3000;
        app.listen(port, () => {
            console.log(`app listening on port ${port}`)
        })
    }
}

module.exports = Application;