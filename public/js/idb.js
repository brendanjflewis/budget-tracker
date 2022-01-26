// variable for db connection
let db;

// connect to database called budget_tracker and set to version 1
const request = indexedDB.open('budget_tracker', 1);

// Event occurs if there a version change for the database
request.onupgradeneeded = function(event) {
    
    const db = event.target.result;

    db.createObjectStore('new_transaction', { autoIncrement: true });
};

// upon success
request.onsuccess = function(event) {

    // save reference to db when db is successfully created when connection is established
    db = event.target.result;

    // if app is online, send local db data to api
    if(navigator.onLine) {
        uploadBudget();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};