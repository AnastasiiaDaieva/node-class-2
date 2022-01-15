// WORK WITH FILES

// fs, path, os, http, https - packages installed by default, not needed in package.json

// old version with repeating callbacks
// const fs = require(fs);
// fs.readFile('files/file.txt', (error, data) => {});

// modern version with promises
const fs = require('fs/promises');

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const { program } = require('commander');

// vol. 2
// const fs = require('fs').promises;

// read the file

// relative path, async

// fs.readFile('files/file.txt')
//   .then(data => console.log(data))
//     .catch(error => console.log(error.message));

//   better to have a callback or async/await, but the then/catch syntax is also possible

// not possible!
// const data = await fs.readFile('files/file.txt');

const fileOperation = async (filePath, action, data) => {
  switch (action) {
    case 'read':
      // if await is written before a function that returns a promise, the variable will store the result of the promise
      const result = await fs.readFile(filePath, 'utf-8');
      //   readFile returns encoded text, toString is needed to decode it back or we can add utf-8 to "(filePath, "utf-8")"
      const text = result.toString();
      console.log(result);
      console.log(text);
      break;
    case 'add':
      await fs.appendFile(filePath, data);
      break;
    case 'replace':
      await fs.writeFile(filePath, data);
      break;
    case 'remove':
      await fs.unlink(filePath);
    default:
      console.log('Unknown command');
  }
};

// 1st arg - path to file, 2nd - action
// fileOperation('files/file.txt', 'read');
fileOperation('files/file.txt', 'add', '\nBlah');
fileOperation('files/file.txt', 'replace', 'Так сказал Заратустра');
fileOperation('files/file.txt', 'add', '\nwhy');

// new file was automatically created, the same works for writeFile
// fileOperation('files/file3.txt', 'add', '\nwhy');

// fileOperation('files/file3.txt', 'remove');

// there are two types of files: text and non-text

// fileOperation('files/file2.txt', 'remove');

fileOperation('files/file.txt', 'add', '\nhi');
// console.log(fs);

// ---------------------------
// WORK WITH JSON FILES
// console.log(__dirname);

// productsOperations is not a file, it's an object, it has the getAll method to read the content from the file
const productsOperations = require('./products');
// console.log(productsOperations); // { getAll: [AsyncFunction: getAll] }

// console.log(productsOperations.getAll());

// 1. get all products
// 2. get a specific product by id
// 3. add a product
// 4. update a product by id
// 5. delete product by id

const invokeAction = async ({ action, name, price, id }) => {
  switch (action) {
    case 'getAll':
      const products = await productsOperations.getAll();
      console.log(products);
      break;
    case 'getById':
      const product = await productsOperations.getById(id);
      console.log(product);
      break;
    case 'add':
      const newProduct = await productsOperations.add(name, price);
      console.log(newProduct);
      break;
    case 'updateById':
      const updatedProduct = await productsOperations.updateById(
        id,
        name,
        price,
      );
      console.log(updatedProduct);
      break;
    case 'removeById':
      const removedProduct = await productsOperations.removeById(id);
      console.log(removedProduct);
      break;
    default:
      console.log('Unknown command');
      break;
  }
};

// GET ALL-----------------
// invokeAction({ action: 'getAll' });

// GET BY ID---------------
// invokeAction({ action: 'getById', id: '48bd1cd8-72ca-42cc-8457-156bb8c30873' });

// wrong id, returns null, not undefined by default, correct version
// invokeAction({
//   action: 'getById',
//   id: '48bd1cd8-72ca-42cc-8457-156bb8c3083',
// });

// ADD----------------------
// invokeAction({ action: 'add', name: 'Sony XPeria 10 III', price: 33333 });

// UPDATE-------------------
// invokeAction({
//   action: 'updateById',
//   id: 'AQPLyXQT3AN9F9BDm8ecs',
//   name: 'Sony XPeria 10 III',
//   price: 22222,
// });

// DELETE BY ID
// invokeAction({
//   action: 'removeById',
//   id: '2ilbJgkgPTiniyk1UxTFD',
// });

// console.log(process.argv);

// MANUAL----------------
// const arr = hideBin(process.argv);
// console.log(arr); // command: node app --action *name of action*, e.g. getAll
// const { argv } = yargs(arr);
// console.log(argv); // command: node app --action *name of action*, e.g. getAll

// // command: node app --action add --name iPhone --price 33000
// // =>
// // { _: [], action: 'add', name: 'iPhone', price: 33000, '$0': 'app' }

// invokeAction(argv);

// VIA PACKAGE------------

program
  .option('-a, --action <type>', 'products action')
  .option('--id <type>', 'product id')
  .option('-n, --name <type>', 'product name')
  .option('-p, --price <type>', 'product price');

program.parse(process.argv);

const options = program.opts();
console.log(options);
invokeAction(options);

// node app -a getById --id 61c0169c-e693-4a20-af3e-2e55fdc34f79
// =>
// { action: 'getById', id: '61c0169c-e693-4a20-af3e-2e55fdc34f79' }
// {
//   id: '61c0169c-e693-4a20-af3e-2e55fdc34f79',
//   name: 'Crisps',
//   price: 4
// }
