const loop = (arrayParam, body, deepLoop = false, returnObject) => new Promise(async (resolveMain) => {
    const loopWork = (arrayParam, deepLoop = false, returnObject) => new Promise((resolve) => {
        const resultArray = [];
        let resultObject = {};
        let returnObjectFinal = false;
        const loopFunction = (async (indexParam, type) => {
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
                if (!deepLoop) {
                    tempItem = await tempFunction(itemTemp, indexTemp);
                } else {

                    tempItem = await loopWork(itemTemp, true, indexTemp);
                }
                if (tempItem) {
                    if (!returnObjectFinal) resultArray.push(tempItem);
                    else resultObject = { ...resultObject, ...tempItem };
                }
                if (indexParam < arrayLength) {
                    const newIndex = indexParam + 1;
                    loopFunction(newIndex, type);
                } else if (!returnObjectFinal) resolve(resultArray);
                else resolve(resultObject);
            } catch (err) {
                console.error(err);
            }
        });
        if (Array.isArray(arrayParam)) {
            returnObjectFinal = (typeof returnObject === "undefined") ? false : returnObject;
            if (arrayParam.length > 0) loopFunction(1, "array");
        } else {
            returnObjectFinal = (typeof returnObject === "undefined") ? true : returnObject;
            loopFunction(1, "object");
        }
    });

    const result = await loopWork(arrayParam, deepLoop, returnObject);
    resolveMain(result);
});

module.exports = loop