var sqlite3 = require('sqlite3');
let db = new sqlite3.Database('./data/aw.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
        } else if (err) {
            console.log("Getting error " + err);
            exit(1);
    }
    dbReady(db);
    // runQueries(db);
});

function createDatabase() {
    db = new sqlite3.Database('data/aw.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(db);
    });
}

function createTables(db) {
    db.exec(`
    create table windowUsage (
        appName text not null,
        timestamp integer not null,
        duration integer not null
    );
    
        `
    );
    dbReady(db);
}

function dbReady(db){
    db.all(`SELECT * FROM windowUsage`,(err,rows) => {
        console.log(rows);
        console.log(`Printing rows from windowUsage table`);
    });

}
