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
        timestamp integer not null,
        duration integer not null
    );
    
        `).run();
}
let insertStmt = sql.prepare(`INSERT INTO windowUsage (appName, timestamp, duration) VALUES (?, ?, ?)`);
insertStmt.run('Google Chrome',1010, 2020);
insertStmt.run('Visual Studio Code', 2020, 3030);
let dbInfo = sql.prepare(`SELECT * FROM windowUsage`).all();
console.log(dbInfo);

// console.log("Hello World");

// setInterval(async () => {
//     console.log(await activeWindow());
//     const trackWindow = (await activeWindow());
//     console.log(trackWindow.owner.name);
//     console.log()
// }, INTERVAL);



