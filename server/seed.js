const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const writeJSON = (file, data) => {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
};

// Users data
const users = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@example.com',
    password: '$2b$10$m8Ijp4GWbY31Ji.I.bOm4eA3gW1qWXXvEt8HwXXZbOEwyE9TwSSFi', // 'password' hashed
    role: 'admin'
  }
];
writeJSON('users.json', users);

// Customers data
const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' }
];
writeJSON('customers.json', customers);

// Invoices data
const invoices = [
  {
    id: 1,
    invoiceNumber: 'INV-001',
    customerId: 1,
    date: '2026-09-01',
    dueDate: '2026-09-15',
    items: [{ description: 'Web Development', quantity: 1, unitPrice: 1000 }],
    tax: 100,
    discount: 0,
    total: 1100,
    status: 'Pending'
  }
];
writeJSON('invoices.json', invoices);

// Payments data
const payments = [];
writeJSON('payments.json', payments);

console.log('Seed data created.');
