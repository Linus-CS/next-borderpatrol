
const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const cert = fs.readFileSync('./https_cert/cert.crt');
const ca = fs.readFileSync('./https_cert/ca.ca-bundle');
const key = fs.readFileSync('./https_cert/private.key');

const httpsOptions = {
    key: key,
    cert: cert,
    ca: ca
};

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, (err) => {
        if (err) throw err;
        console.log("ready - started server on url: https://localhost:" + port);
    });
});

