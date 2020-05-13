# Loop Go

Basic asynchronous loop for an Array [] or Object {} that can return an accumulated object and modify it.

### Async/Await Style

```javascript
const loop = require('loop-go');

const result = await loop(["1", "3"], ({ item }, next) => {
    next({ number: item });
});

console.log(result);
// Output: [{number: "1"},{number: "3"}]
```

### Promise Style

```javascript
const loop = require('loop-go');

loop(["1", "3"], ({ item }, next) => {
    next({ number: item });
}).then((result) => {
    console.log(result);
    // Output: [{number: "1"},{number: "3"}]
});
```

## Installation

To install locally in a project, use;

```shell
$ npm install loop-go --save
```

### Parameters:
```javascript
loop(array, handleFun, true, true);
```
1. The first is an Array [] or Json {} object.
2. The second is a function that is called each iteration.
3. The third is optional. This is for if you want a deep loop. By default is "false".
4. The fourth is optional too. This indicates the return will be an Array [] or Object {}. By default is "false" = It will return an Array [];

### Iteration function parameters:
```javascript
loop(array, ({ item, key, object }, next, reject) => next(item), true);
```
1. The first is a Json object with three variables: "item", "key", "object". "object" will be the accumulated object that is building in each iteration.
2. The second is the function next to continue with the next iteration. This should be called alway into handleFun.
3. The third can be used to finish the process by some controlled error or someone else error.

## Usage

```javascript
const loop = require('loop-go');

// Iteration without return
await loop(["1", "3"], ({ item }, next) => {
    // Do something like make a external request or another promise process.
    console.log(item);
    next();
});
console.log("Finish");
// Do something at final of the all process.




// Return Array
const result = await loop(["1", "3"], ({ item }, next) => {
    next({ number: item });
});
console.log(result);
// output: [{number: "1"},{number: "3"}]




// Return Array
const result = await loop({ number1: "1", number2: "3" }, ({ item }, next) => {
    next(item);
},false,false);
console.log(result);
// output: ["1", "3"]




// Return Array with filter
const result = await loop({ number1: "1", number2: "3" }, ({ item }, next) => {
    next((item === "3") ? item : false);
},false,false);
console.log(result);
// output: ["3"]





// Return Object
const result = await loop(["1", "3"], ({ item, key }, next) => {
    next({ ["number"+(key + 1)]: item });
},false, true);
console.log(result);
// output: { number1: "1", number2: "3" }





// Return Object and modify result
const result = await loop(["1", "3"], ({ item, key }, next) => {
        if (key === 1) next({ number2: "2", number3: item });
        next({ ["number"+(key + 1)]: item });
    }, , false, true);
console.log(result);
// output: { number1: "1", number2: "2", number3: "3" }





// Return Object and modify a item from result
const result = await loop({ number1: "1", number2: "2", number3: "3" }, ({ item, key, object }, next) => {
        if (key === "number3") next({...object, number1: "Modified", [key]: item });
        next({ [key]: item });
    }, false, true);
console.log(result);
// output: { number1: "Modified", number2: "2", number3: "3" }





// using multiple promise 
const result = await loop(["1", "3"], ({ item: item1 }, next, reject) => {
	Promise.all([downloadImage(item1), downloadVideo(item1)])
		.then((downloaded) => {
			next({ image: downloaded[0], video: downloaded[1] });
		}, (reason) => {
			reject({ error: reason });
		});
    });
console.log(result);
// output: [{ image: "/image1.jpg", video: "/video1.mp4"}, { image: "/image3.jpg", video: "/video3.mp4"}]





// return same object using deep loop
const result = await loop({ number1: [{},[],{ deep: 1 }], 
    number2: { deep: [1,2,3, { deep: "1"}]}, number3: [{}] }, ({ item, key }, next) => {
        //All iteration should include this validation to hold the Object Format. Check if Key is a number or not. !key is for object empty.
        if (typeof key === "number" || !key) next(item); 
        next({ [key]: item });
    }, true);
console.log(result);
// output: { number1: [{},[],{ deep: 1 }], number2: { deep: [1,2,3, { deep: "1"}]}, number3: [{}] }
```

## Test

```shell
$ npm test
```

## Github
https://github.com/dat185
