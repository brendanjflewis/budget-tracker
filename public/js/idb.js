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
        // uploadBudget();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

// function if there is no internet connection and attempt to submit a new transaction
function saveRecord(record) {

    // opens a new transaction with db with permission to read and write
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    // access object store
    const budgetObjectScore = transaction.objectScore('new_transaction');

    // add record to your store with add method
    budgetObjectScore.add(record);
};

function uploadTransaction() {

    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const budgetObjectScore = transaction.objectScore('new_transaction');

    // get records from store and set to variable
    const getAll = budgetObjectScore.getAll();

    // upon succcess .get() function
    getAll.onsuccess = function () {
        if (getAll.result.legth > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    //open another transaction
                    const transaction = db.transaction(['new_transaction'], 'readwrite');
                    
                    // access the new_transaction object store
                    const budgetObjectScore = transaction.objectScore('new_transaction');

                    // clear all items in store
                   budgetObjectScore.clear();

                   alert('All saved transactions have been saved.');
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
}

// listen for app coming back online
window.addEventListener('online', uploadTransaction);