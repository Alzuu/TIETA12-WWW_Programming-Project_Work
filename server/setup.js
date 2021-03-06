const bcrypt = require('bcryptjs');
const BankAccount = require('./models/BankAccount');
const CreditCard = require('./models/CreditCard');
const Item = require('./models/Item');
const User = require('./models/User');
const UserRole = require('./models/UserRole');

// salt rounds for password hashing
const saltRounds = 12;

// Counter for ids
let counter = 0;

// Item names for random name generator
const itemNames = [
  'Toilet paper',
  'Beer',
  'Hand disinfection gel',
  'Respirator mask',
  'Surgical gloves',
  'Canned meat',
  'Pasta',
  'Corona virus test',
];

/* Adds new user to database
 */
function addNewUser(name, password, role) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      const newUser = new User({
        name,
        role,
        password: hash,
        items: [],
        creditCardId: 'undefined',
        bankAccountId: 'undefined',
      });
      newUser.save((error, doc) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(doc);
        }
      });
    });
  });
}
/* Adds new credit card with random number to user
 */
function addCreditCard(userid) {
  return new Promise((resolve, reject) => {
    const newCreditCard = new CreditCard({
      number: `kortti${counter}`,
      CVC: '123',
      ownerName: 'Kortin omistaja',
    });
    counter += 1;
    newCreditCard.save((error, doc) => {
      if (error) {
        reject(new Error(error));
      } else {
        User.findByIdAndUpdate(
          userid,
          { creditCardId: doc._id },
          { omitUndefined: true, new: true },
          (err, res) => {
            if (err) {
              reject(new Error(err));
            } else {
              resolve(res);
            }
          }
        );
      }
    });
  });
}
/* Adds new bank account with random number to user
 */
function addBankAccount(userid) {
  return new Promise((resolve, reject) => {
    const newBankAccount = new BankAccount({
      number: `pankki${counter}`,
      balance: Math.floor(Math.random() * 1000),
    });
    counter += 1;
    newBankAccount.save((error, doc) => {
      if (error) {
        reject(new Error(error));
      } else {
        User.findByIdAndUpdate(
          userid,
          { bankAccountId: doc._id },
          { omitUndefined: true, new: true },
          (err, res) => {
            if (err) {
              reject(new Error(err));
            } else {
              resolve(res);
            }
          }
        );
      }
    });
  });
}
/* Adds user with credit card and bank account
 */
function addFullUser(name, password, role) {
  return new Promise((resolve, reject) => {
    addNewUser(name, password, role)
      .then((doc) => {
        addCreditCard(doc._id)
          .then((usr) => {
            addBankAccount(usr._id)
              .then((user) => {
                resolve(user);
              })
              .catch((bankerror) => {
                reject(new Error(bankerror));
              });
          })
          .catch((error) => {
            reject(new Error(error));
          });
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });
}
function randomItemName() {
  return itemNames[Math.floor(Math.random() * itemNames.length)];
}
/* Adds random item to user
 */
function addItem(userid, customer) {
  return new Promise((resolve, reject) => {
    const newItem = new Item({
      name: randomItemName(),
      price: Math.floor(1 + Math.random() * 1000),
      ownerId: userid,
      ownerIsCustomer: customer,
      onSale: true,
    });
    newItem.save((err, item) => {
      if (err) {
        reject(new Error(err));
      } else {
        User.findByIdAndUpdate(
          userid,
          { $push: { items: item._id } },
          (error, user) => {
            if (error) {
              reject(new Error(error));
            } else {
              resolve(user);
            }
          }
        );
      }
    });
  });
}

User.find({}, (err, res) => {
  if (err) {
    console.log('Setup failed!');
  } else if (!res.length) {
    // If no users are found, begin setup
    // Add admin

    addNewUser('admin', 'admin', UserRole.ADMIN).then(() => {});
    addFullUser('shopkeeper', 'shopkeeper', UserRole.SHOPKEEPER)
      .then((user) => {
        // Add item for user
        addItem(user._id, false)
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    addFullUser('customer', 'customer', UserRole.CUSTOMER)
      .then((user) => {
        // Add item for user
        addItem(user._id, true)
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});
