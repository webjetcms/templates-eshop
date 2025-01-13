import $ from 'jquery';
window.jQuery = $;
window.$ = $;
require("jquery.cookie");

import Ninja from './global-functions';
window.Ninja = Ninja;

const bootstrap = (window.bootstrap = require('bootstrap'));

$(function () {

    //console.log("Ninja is ready, mam jquery=", $, "mam bootstrap=", bootstrap);

    Ninja.init({
        debug:false
    });

});
