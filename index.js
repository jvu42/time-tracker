const INTERVAL = 1000 *5;
const activeWindow = require('active-win');
const SQLite = require("better-sqlite3");
const sql = new SQLite("./data/aw.db");

// Check if the table "points" exists.
const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'windowUsage';").get();
console.log(table);
if (!table['count(*)']) {
// If the table isn't there, create it and setup the database correctly.
    sql.prepare(`
    create table windowUsage (
        appName text not null,
        timestamp text not null,
        duration integer not null
    );
    
        `).run();
}
let insertStmt = sql.prepare(`INSERT INTO windowUsage (appName, timestamp, duration) VALUES (?, ?, ?)`);
let updateStmt = sql.prepare(`UPDATE windowUsage SET timestamp = ?, duration = ? WHERE appName = ?`);
// insertStmt.run('Testing',getTimestamp(), 2020);
// insertStmt.run('Visual Studio Code', 2020, 3030);
let dbInfo = sql.prepare(`SELECT * FROM windowUsage`).all();
console.log(dbInfo);

// console.log("Hello World");

setInterval(async () => {
    //console.log(await activeWindow());
    const trackWindow = (await activeWindow());
    let currentApp = trackWindow.owner.name;
    addData(currentApp);
    console.log(trackWindow.owner.name);
    dbInfo = sql.prepare(`SELECT * FROM windowUsage`).all();
    console.log(dbInfo);
}, INTERVAL);



function addData(currentApp) {
    //Get timestamp and current duration here
    let timestamp = getTimestamp();
    let duration = getDuration(currentApp);
    if (duration == INTERVAL){
        insertStmt.run(currentApp,timestamp,duration);
    }
    else{
        updateStmt.run(timestamp,duration,currentApp);
    }
}

function getTimestamp(){
    let today = new Date();
    let todayDate = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`;
    let todayTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
    return `${todayDate} --- ${todayTime}`;
}

function getDuration(currentApp) {
    const durationStmt = sql.prepare('SELECT * FROM windowUsage WHERE appName = ?').iterate(currentApp);
    let counter = INTERVAL
    for (const record of durationStmt){
        counter = record.duration + INTERVAL;
    }
    return counter;
}