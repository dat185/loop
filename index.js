const loop = (array, body, deepLoop = false, returnObject) => new Promise(async (resolveMain) => {
    let stepWork = 0;
    const loopWork = (keyMain, arrayParam, deepLoop = false, returnObject) => new Promise((resolve) => {
        const resultArray = [];
        let resultObject = {};
        let returnObjectFinal = false;

        stepWork += 1;
        let stepFunction = 0;
        
        const loopFunction = (async (indexParam, type) => {
            stepFunction += 1;
            try {
                const object = (!returnObjectFinal) ? resultArray : resultObject;
                const tempFunction = (item, key) => new Promise((next, reject) => {
                    body({ item, object, key }, next, reject);
                });
                let indexTemp = indexParam - 1;
                let itemTemp = arrayParam[indexTemp];
                let arrayLength = arrayParam.length;
                if (type === "object") {
                    indexTemp = Object.keys(arrayParam)[indexParam - 1];
                    itemTemp = arrayParam[indexTemp];
                    arrayLength = Object.keys(arrayParam).length;
                }
                let tempItem = null;
                if (arrayLength > 0 && typeof itemTemp === "object") {
                    if (!deepLoop) tempItem = await tempFunction(itemTemp, indexTemp);
                    else {
                        tempItem = await loopWork(indexTemp, itemTemp, deepLoop);
                        if (returnObjectFinal) tempItem = { [indexTemp]: tempItem };
                    }
                } else if (typeof itemTemp === "number" || typeof itemTemp === "string") {
                    tempItem = await tempFunction(itemTemp, indexTemp);
                } else {
                    tempItem = await tempFunction(arrayParam, keyMain);
                    if (typeof itemTemp === "undefined") resolve(tempItem);
                }
                if (typeof tempItem !== "undefined") {
                    if (!returnObjectFinal) {
                        if(tempItem !== false) resultArray.push(tempItem);
                    } else resultObject = { ...resultObject, ...tempItem };
                }
                if (indexParam < arrayLength) {
                    const newIndex = indexParam + 1;
                    loopFunction(newIndex, type);
                } else if (!returnObjectFinal) resolve(resultArray);
                else resolve(resultObject);
            } catch (err) {
                resolve(err);
            }
        });
        if (Array.isArray(arrayParam)) {
            returnObjectFinal = (typeof returnObject === "undefined") ? false : returnObject;
            loopFunction(1, "array");
        } else {
            returnObjectFinal = (typeof returnObject === "undefined") ? true : returnObject;
            loopFunction(1, "object");
        }
    });

    const init = async () => {
        const result = await loopWork(false, array, deepLoop, returnObject);
        resolveMain(result);
    }

    if (Array.isArray(array)) {
        if (array.length === 0) resolveMain([]);
        else init();
    } else if (Object.keys(array).length === 0) resolveMain({});
    else init();
});

module.exports = loop