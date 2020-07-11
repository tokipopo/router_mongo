let p = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve('success');
    },500);
});

let pp = Promise.resolve(p);

pp.then(result => {
    console.log(result);
});
console.log(p);
console.log(pp);

console.log(pp == p);