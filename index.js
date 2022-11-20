const config = require('./config');
const express = require('express');
const crypto = require('crypto');
const webserver = express();
const { exec } = require("child_process");
// ======== For github ======== //
const sigHeaderName = 'X-Hub-Signature-256'
const sigHashAlg = 'sha256'

// ======== For accessing unparsed Request body ======== //
webserver.use(express.json({
    verify: (req, res, buf, encoding) => {
        if (buf && buf.length) {
            req.rawBody = buf.toString(encoding || 'utf8');
        }
    },
}));

// Credits to https://gist.github.com/stigok/57d075c1cf2a609cb758898c0b202428#file-githook-js-L25
// ======== For validating signature of webhook call ======== //
function verifyWebhookCaller(req, res, next) {
    if (!req.rawBody) {
        return next('Request body empty')
    }
    const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8')
    const hmac = crypto.createHmac(sigHashAlg, config.WEBHOOK_SECRET);
    const digest = Buffer.from(sigHashAlg + '=' + hmac.update(req.rawBody).digest('hex'), 'utf8')
    if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
        return next(`Request body digest (${digest}) did not match ${sigHeaderName} (${sig})`)
    }
    return next();
}

webserver.post("/", verifyWebhookCaller, async (request, response) => {
    const repoName = request.body.repository.name;
    const repoToUpdate = config.REPOSITORIES_FULL_PATH.find(repoPath => repoPath.includes(repoName));
    if (repoToUpdate) {
        exec('cd ' + repoToUpdate + ' && git pull');
    }
    response.json({
        status: "SUCCESS"
    });
});

// ======== Error Handler ======== //
webserver.use((err, req, res, next) => {
    if (err) console.error(err)
    res.status(403).send('Request body was not signed or verification failed')
})

webserver.listen(config.PORT, () => {
    console.log("Listening on port " + config.PORT);
});
