// utils/generateProductId.js
const { customAlphabet } = require('nanoid');

// A-Z và 0-9, độ dài = 6
const generateId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

module.exports = generateId;
