const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, 'src/templates');
const destinationDir = path.join(__dirname, 'dist/templates');

fs.copy(sourceDir, destinationDir, err => {
  if (err) return console.error(err);
  console.log('Templates copied successfully!');
});
