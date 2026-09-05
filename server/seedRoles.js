const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const writeJSON = (file, data) => {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
};

async function seed() {
  const hash = await bcrypt.hash('password', 10);
  
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', password: hash, role: 'administrator' },
    { id: 2, name: 'Business Owner', email: 'owner@example.com', password: hash, role: 'business owner' },
    { id: 3, name: 'Accountant', email: 'accountant@example.com', password: hash, role: 'accountant' },
    { id: 4, name: 'Customer User', email: 'customer@example.com', password: hash, role: 'customer' }
  ];
  writeJSON('users.json', users);

  console.log('Roles seeded correctly.');
}

seed();
