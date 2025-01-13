
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
    "port": 3000,
    "browser": "google chrome",
    middleware: function(req,res,next) {
        //presmerovanie plnych ciest, typicky na fonty a obrazky v CSS subore
        if (req.url.indexOf('/templates/bare/bootstrap-bare/dist/')!=-1) {
            let url = req.url.replace('/templates/bare/bootstrap-bare/dist/', '/');
            //console.log("Replacing URL to:", url);
            res.writeHead(301, {Location: url});
            res.end();
        }
        return next();
    }
};