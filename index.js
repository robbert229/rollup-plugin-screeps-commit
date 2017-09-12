const https = require('https');

module.exports = function({email, password, branch}) {
    return {
        name: 'rollup-plugin-screeps-commit',
        ongenerate: function(_, bundle) {
            return new Promise((resolve, reject) => {
                const req = https.request({
                    hostname: 'screeps.com',
                    port: 443,
                    path: '/api/user/code',
                    method: 'POST',
                    auth: email + ':' + password,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                }, (res) => {
                    if (res.statusCode !== 200) {
                        reject(res);
                    } else {
                        resolve(res);
                    }
                });

                req.on('error', (e) => {
                    reject(e);
                });

                req.write(JSON.stringify({
                    branch,
                    modules: {
                        main: bundle.code,
                    },
                }));
                req.end();
            }).catch(e => {
                console.error('*** failed to upload script to server')
            });
        },
    };
}