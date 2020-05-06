const loop = (arrayParam, body, returnObject = false) => new Promise((resolve) => {
	const resultArray = [];
	let resultObject = {};
	const loopFunction = (async (indexParam, type) => {
		try {
			const object = (!returnObject) ? resultArray : resultObject;
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
            const tempItem = await tempFunction(itemTemp, indexTemp);
			if (tempItem) {
				if (!returnObject) resultArray.push(tempItem);
				else resultObject = { ...resultObject, ...tempItem };
			}
			if (indexParam < arrayLength) {
				const newIndex = indexParam + 1;
				loopFunction(newIndex, type);
			} else if (!returnObject) resolve(resultArray);
			else resolve(resultObject);
		} catch (err) {
			console.error(err);
		}
    });
    if (Array.isArray(arrayParam)) { 
        if (arrayParam.length > 0) loopFunction(1, "array");
    }
    else loopFunction(1, "object");
});

module.exports = loop