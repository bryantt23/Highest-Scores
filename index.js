const http = require('http');
const readline = require("readline");
// https://nodejs.org/api/readline.html
const lineReader = require('line-reader');
// https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
const jsv = require('json-validator');

let scoresMap = new Map();
let numberOfRecords;

// https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try/3710226
const getJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        console.log("Invalid Input: Invalid JSON format detected");
        return process.exit(1);
    }
    return JSON.parse(str);
}

const displayResults = () => {
    let sortedScoresMap = new Map([...scoresMap.entries()].sort((a, b) => b[0] - a[0]));
    let sortedScoresArr = Array.from(sortedScoresMap);

    let length = Math.min(numberOfRecords, sortedScoresArr.length);
    let jsonArr = [];

    // https://stackoverflow.com/questions/29658961/how-to-create-a-json-object-in-javascript-for-loop
    for (let i = 0; i < length; i++) {
        let obj = {};
        obj["score"] = parseInt(sortedScoresArr[i][0]);
        obj["id"] = sortedScoresArr[i][1];
        jsonArr.push(obj);
    }

    console.log(JSON.stringify(jsonArr))
}

const runThroughFile = (filePath) => {

    lineReader.eachLine(filePath, function (line) {
        // https://stackoverflow.com/questions/4607745/split-string-only-on-first-instance-of-specified-character
        let score = line.substring(0, line.indexOf(":"));
        let tryJson = line.substring(line.indexOf(":") + 1);

        let jsonObject = getJsonString(tryJson);

        if (jsonObject.id === undefined) {
            console.log("Invalid Input: ID is undefined");
            return process.exit(1);
        }
        if (jsonObject.id === "") {
            console.log("Invalid Input: Missing ID");
            return process.exit(1);
        }

        scoresMap.set(score, jsonObject.id);
    }, displayResults);
}

const getInput = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the file path and the number of scores to return\n', (userInput) => {

        let inputArr = userInput.split(" ");
        let filePath = inputArr[0];
        numberOfRecords = parseInt(inputArr[1])

        runThroughFile(filePath, numberOfRecords);

        //for testing
        // numberOfRecords = 3;
        // runThroughFile('./valid_json.txt');
        // runThroughFile('./invalid_json.txt', 3);
        // runThroughFile('./missing_id.txt', 3);
        // runThroughFile('./undefined_id.txt', 1);
        // runThroughFile('./duplicate_ids.txt', 3);

        rl.close();
    });

}

getInput();

// https://stackabuse.com/how-to-exit-in-node-js/
process.on('exit', function (code) {
    return console.log(`About to exit with code ${code}`);
});

