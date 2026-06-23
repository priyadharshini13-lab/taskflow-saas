const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is missing');
  process.exit(1);
}
console.log('MONGODB_URI detected');

try {
  const u = new URL(uri);
  const dbName = u.pathname && u.pathname.length > 1 ? u.pathname.slice(1) : '<missing>';
  console.log('Parsed database name:', dbName);
} catch (e) {
  console.error('Failed to parse MONGODB_URI:', e.message);
  process.exit(1);
}

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Atlas connection test: SUCCESS');
    return mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Atlas connection test: FAILED');
    console.error(err.message);
    process.exit(1);
  });
