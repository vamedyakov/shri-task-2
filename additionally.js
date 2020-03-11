const p1 = new Promise((resolve, reject) => setTimeout(reject, 1000, 1));
const p2 = new Promise((resolve, reject) => setTimeout(resolve, 2000, 'err 2'));
const p3 = new Promise((resolve, reject) => setTimeout(reject, 1500, 3));

Promise._any = array => {
    const result = [];
    let counter = 0;

    return new Promise((resolve, reject) => {
        array.forEach((prom, i) => prom
        .then(
            value => resolve(value),
            reason => result[i] = ({ status: 'rejected', reason }))
        .then(() => {
            counter++;
            if (counter === array.length) {
            resolve(result);
            }
        }));
    });
}

Promise._allSettled = array => {
    const result = [];
    let counter = 0;

    return new Promise((resolve, reject) => {
        array.forEach((prom, i) => prom
        .then(
            value => result[i] = ({ status: 'fulfilled', value }),
            reason => result[i] = ({ status: 'rejected', reason }))
        .then(() => {
            counter++;
            if (counter === array.length) {
            resolve(result);
            }
        }));
    });
}

Promise.prototype._finally = async function (cb) {
    await this.then(
        value => cb(),
        reason => cb()
    );

    return this;
}

Promise._any([p1, p2, p3]).then(el => console.log(el));
Promise._allSettled([p1, p2, p3]).then(el => console.log(el));
p2._finally(() => { console.log(`_finally`) })