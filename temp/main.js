import { nanoid } from "nanoid"
<<<<<<< HEAD
console.log(nanoid(10));
=======
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
>>>>>>> 7d21568e8fe0cba264b9d83cd7591ed5b0f5333b
