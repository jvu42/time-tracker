const INTERVAL = 1000 *10;
const activeWindow = require('active-win');

setInterval(async () => {
    console.log("Hello World");
    console.log(await activeWindow());
}, INTERVAL);