    import * as readline from 'readline';

    const inputreader = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    function getAdjacentCountries(countryCode: string) {
        let countryName: string;
        let neighbors: string[];
    
        if (countryCode === "IN") {
            countryName = "India";
            neighbors = ["Pakistan", "China", "Nepal", "Bangladesh"];
        } else if (countryCode === "US") {
            countryName = "United States";
            neighbors = ["Canada", "Mexico"];
        } else if (countryCode === "NZ") {
            countryName = "New Zealand";
            neighbors = ["Australia"];
        } else {
            console.log("Country code not found.");
            return;
        }
    
        console.log(`Country: ${countryName}`);
        if (neighbors.length > 0) {
            console.log(`Adjacent Countries: ${neighbors.join(", ")}`);
        } else {
            console.log("no adjacent countries.");
        }
    }
    
    inputreader.question('Enter country code (e.g., IN, US, NZ): ', (input) => {
        getAdjacentCountries(input.toUpperCase());
        inputreader.close();
    });
