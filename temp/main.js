import { nanoid } from "nanoid"
console.log(nanoid(10));

let a = [1, 2, 4];

let scenarioModule = {
    params: {
        name: "",
    }
}

let scenario = scenarioModule.params;

let newParams = {
    name: "111",
}

// scenarioModule.params = newParams; // scenario的name是""
Object.assign(scenarioModule.params, newParams); // scenario的name是"111"

console.log(scenarioModule);
console.log(scenario);