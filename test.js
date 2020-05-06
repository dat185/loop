const tap = require('tap');
const loop = require('./');

tap.test('["1", "3"]', async t => {
    const result = await loop(["1", "3"], ({ item }, next) => {
        next({ number: item });
    });
    t.match(result, [{number: "1"},{number: "3"}], 'result is Ok')
});

tap.test('{ number1: "1", number2: "3" }', async t => {
    const result = await loop({ number1: "1", number2: "3" }, ({ item }, next) => {
        next(item);
    });
    t.match(result, ["1", "3"], 'result is Ok')
});

tap.test('{ number1: "1", number2: "3" } with filter', async t => {
    const result = await loop({ number1: "1", number2: "3" }, ({ item }, next) => {
        next((item === "3") ? item : false);
    });
    t.match(result, ["3"], 'result is Ok')
});

tap.test('["1", "3"] return Object', async t => {
    const result = await loop(["1", "3"], ({ item, key }, next) => {
        next({ ["number"+(key + 1)]: item });
    }, true);
    t.match(result, { number1: "1", number2: "3" }, 'result is Ok')
});

tap.test('["1", "3"] return Object and modify result', async t => {
    const result = await loop(["1", "3"], ({ item, key }, next) => {
        if (key === 1) next({ number2: "2", number3: item });
        next({ ["number"+(key + 1)]: item });
    }, true);
    t.match(result, { number1: "1", number2: "2", number3: "3" }, 'result is Ok')
});

tap.test('{ number1: "1", number2: "2", number3: "3" } return Object and modify a item from result', async t => {
    const result = await loop({ number1: "1", number2: "2", number3: "3" }, ({ item, key, object }, next) => {
        if (key === "number3") next({...object, number1: "Modified", [key]: item });
        next({ [key]: item });
    }, true);
    t.match(result, { number1: "Modified", number2: "2", number3: "3" }, 'result is Ok')
});

tap.test('Just iteration', async t => {
    loop(["1", "3"], ({ item }, next) => {
        console.log(item)
        next();
    });
    t.end();
});