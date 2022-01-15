const fs = require('fs/promises');
const path = require('path');
// console.log(path);

const { nanoid } = require('nanoid');

// const filePath = `${__dirname}/products.json`;
// the line above has a wrong slash but changing it to the correct one lead to productsproducts.json
const filePath = path.join(__dirname, 'products.json');

// console.log(filePath);
const getAll = async () => {
  const data = await fs.readFile(filePath);
  // toString or utf-8 are irrelevant since typeof = string
  const products = JSON.parse(data);
  return products;
};

const getById = async id => {
  const products = await getAll();
  const result = products.find(item => item.id === id);
  if (!result) {
    return null;
  }
  return result;
};

const add = async (name, price) => {
  const data = { name, price, id: nanoid() };
  const products = await getAll();
  products.push(data);
  await fs.writeFile(filePath, JSON.stringify(products, null, 2));
  return data;
};

const updateById = async (id, name, price) => {
  const products = await getAll();
  const idx = products.findIndex(item => item.id === id);
  if (idx === -1) {
    return null;
  }
  products[idx] = { id, name, price };
  await fs.writeFile(filePath, JSON.stringify(products, null, 2));
  return products[idx];
};

const removeById = async id => {
  const products = await getAll();

  // one way
  const idx = products.findIndex(item => item.id === id);
  if (idx === -1) {
    return null;
  }
  const deletedProduct = products[idx];
  products.splice(idx, 1);
  await fs.writeFile(filePath, JSON.stringify(products, null, 2));
  return deletedProduct;

  // or another
  // const newProducts = products.filter((_, index) => idx !== id);
  // await fs.writeFile(filePath, JSON.stringify(newProducts, null, 2));
  // return newProducts
};

module.exports = { getAll, getById, add, updateById, removeById };
