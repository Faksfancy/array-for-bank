'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const formDisappear = document.querySelector(`.form`);
//displaying movement

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = ``;
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>    
        <div class="movements__value">${mov}₤</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}₤`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes}₤ `;
  const outcomes = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, cur) => acc + cur, 0)
  );
  labelSumOut.textContent = `${outcomes}₤`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest}₤`;
};

//updating UI
const updateUI = function (acc) {
  //displaying users movement
  displayMovement(acc.movements);
  //displaying users balance
  calcDisplayBalance(acc);
  //displaying users summary
  calcDisplaySummary(acc);
};

//generating username

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(` `)
      .map(val => val.at(0))
      .join(``);
  });

  //console.log(accs);
};
createUsernames(accounts);

//implementing login
let currentAccount;
btnLogin.addEventListener(`click`, function (e) {
  //preventing form from logining
  e.preventDefault();

  //findinng account
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //console.log(currentAccount);
  //checking if pin alligns with current account
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //console.log(`login`);
    //displaying the ui and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(` `)[0]
    }`;
    containerApp.style.opacity = 100;
    //clear input field
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur();

    //updating UI
    updateUI(currentAccount);
  }
});

//implementing transfer
btnTransfer.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = ``;
  if (
    amount > 0 &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username &&
    currentAccount.balance >= amount
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //update UI
    updateUI(currentAccount);
  }
});

//implementing loan amount
btnLoan.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    //add movement
    currentAccount.movements.push(amount);
    //update ui
    updateUI(currentAccount);
  }
  inputLoanAmount.value = ``;
});

//implement close account
btnClose.addEventListener(`click`, function (e) {
  e.preventDefault();
  const deleteAcc = accounts.find(
    acc => acc.username === inputCloseUsername.value
  );
  if (
    deleteAcc &&
    deleteAcc?.username === currentAccount.username &&
    deleteAcc?.pin === Number(inputClosePin.value)
  ) {
    //finding the index 0f the account to be deleted
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    //const index = accounts.indexOf(deleteAcc);

    //deleting the account
    accounts.splice(index, 1);
    //hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = ``;
});

let sorted = false;
btnSort.addEventListener(`click`, function (e) {
  e.preventDefault();

  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const dogs = [
  { weight: 22, curFood: 250, owners: [`Alice`, `Bob`] },
  { weight: 8, curFood: 200, owners: [`Matilda`] },
  { weight: 13, curFood: 275, owners: [`Sarah`, `John`] },
  { weight: 32, curFood: 340, owners: [`Micheal`] },
];

const calcRecommended = function (dogs) {
  dogs.forEach(
    dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
  );
  //console.log(dogs);
};
calcRecommended(dogs);

const sarahDog = dogs.find(dog => dog.owners.includes(`Sarah`));
//console.log(sarahDog);

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();
//console.log(ownersEatTooMuch);
const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();
//console.log(ownersEatTooLittle);

const statement = function (arr1, arr2) {
  const statementMuch = `${ownersEatTooMuch.join(
    ` and `
  )}'s dogs eat too much!`;
  const statementLittle = `${ownersEatTooLittle.join(
    ` and `
  )}'s dogs eat too little! `;

  // console.log(statementMuch);
  // console.log(statementLittle);
};
statement(ownersEatTooMuch, ownersEatTooLittle);
//console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
const eatOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

//console.log(dogs.some(eatOkay));
//console.log(dogs.filter(eatOkay));

const dogsSorted = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
//console.log(dogsSorted);
/*
          //chanllenges
//1)
const calcTotalDeposition = function (accounts) {
  const totalDeposit = accounts
    .flatMap(account => account.movements)
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  console.log(totalDeposit);
};
calcTotalDeposition(accounts);
//2)
const numbersDeposit = function (accounts) {
  const greater100 = accounts
    .flatMap(account => account.movements)
    .filter(mov => mov >= 1000).length;
  console.log(greater100);
};
numbersDeposit(accounts);
//or
const numbersDeposit2 = function (accounts) {
  const greater100 = accounts
    .flatMap(account => account.movements)
    .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
  console.log(greater100);
};
numbersDeposit2(accounts);

//3.
const { deposits, withdrawals } = accounts
  .flatMap(account => account.movements)
  .reduce(
    (sums, mov) => {
      sums[mov > 0 ? `deposits` : `withdrawals`] += mov;
      //mov > 0 ? (sums.deposits += mov) : (sums.withdrawals += mov);
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

//4
//this is a nice title => This Is a nice Title

const convertTitlecase = function (sentence) {
  const exception = [`a`, `an`, `and`, `the`, `but`, `or`, `on`, `in`, `with`];
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const titleCase = sentence
    .toLowerCase()
    .split(` `)
    .map(word => (exception.includes(word) ? word : capitalize(word)))
    .join(` `);
  console.log(capitalize(titleCase));
  //console.log(titleCase);
};
convertTitlecase(`this is a nice title`);
convertTitlecase(`this is a LONG title but not too long`);
convertTitlecase(`and here is another title with an EXAMPLE`);

/*
labelBalance.addEventListener(`click`, function () {
  const movementUI = Array.from(
    document.querySelectorAll(`.movements__value`),
    el => Number(el.textContent.replace(`₤`, ``))
  );
  console.log(movementUI);
});


const dice = Array.from(
  { length: 100 },
  () => Math.trunc(Math.random() * 6) + 1
);
console.log(dice);

/*
const owners = [`Jonas`, `Zach`, `Adam`, `Martha`];
console.log(owners.sort());

//sorting number
//return < 0 , A,B(keeping order)(like ascending order)
//return > 0 , B,A(switch order)(like descending order)

//Ascending
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//
movements.sort((a, b) => a - b);
console.log(movements);
/*
const arr = [[[2, 4, 4, 5, 6], 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const overallBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

/*
//chaining
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
//        SOME-METHOD
// equality => something singular
console.log(movements.includes(-130));

//condition => something plural, atleast one element must pass the test to return 'true'
console.log(movements.some(mov => mov === -130));
console.log(movements.some(mov => mov > 0));

//       EVERY-METHOD
//every element must pass the condition to return 'true'

console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//    separate  callback

const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.filter(deposit));
console.log(movements.every(deposit));


const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Jonas Schmedtmann');
console.log(account);

const balance = movements
  .filter(mov => mov > 0)
  .map(mov => mov * 1.1)
  .reduce((acc, cur) => acc + cur);
console.log(balance);

const balance = movements.reduce((arr, mov, i) => {
  if (arr > mov) {
    return arr;
  } else {
    return mov;
  }
}, movements[0]);
console.log(balance);

const deposit = movements.filter(mov => mov > 0);
console.log(deposit);

const withdrawal = movements.filter(mov => mov < 0);
console.log(withdrawal);
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
//array method

//slice
let arr = [`a`, `b`, `c`, `d`, `e`];

console.log(arr.slice(1, -2));

console.log(arr);

//splice
console.log(arr);

//reverse
let arr2 = [`j`, `i`, `h`, `g`, `f`];
arr2.reverse();
console.log(arr2);
//concat
let letter = arr.concat(arr2);
console.log(letter.join(`-`));
//join

//The NEW AT method

const arr3 = [23, 11, 64];
console.log(arr3[1]);
console.log(arr3.at());

//getting the last element of an array
console.log(arr3.at(-1));
console.log(arr3[arr3.length - 1]);
console.log(arr3.slice(-1)[0]);


const checkDogs = function (arr1, arr2) {
  const newArr1 = arr1.slice(1, -2);
  const ages = newArr1.concat(arr2);
  console.log(ages);
  ages.forEach(function (age, i) {
    if (age >= 3) {
      console.log(
        `Dog number ${i + 1} is an adult 🐺 and it is ${age}years old`
      );
    } else {
      console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    }
  });
};
//checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
//checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

const calcAverageHumanAge = function (ages) {
  const humanAges = ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age18 => age18 >= 18)
    .reduce((acc, cur, i, humanAges) => {
      return acc + cur / humanAges.length;
    }, 0);

  return humanAges;
};
console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));



const euroToUsd = 1.1;
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const movementsUSD = movements.map(value => Math.trunc(value * euroToUsd));
console.log(movementsUSD, movements);

const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? `deposit` : `withdrew`} ${Math.abs(
      mov
    )}`
);

console.log(movementsDescription);
*/
// movements.forEach(function (arr, i, mov) {
//   if (arr > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${arr}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(arr)}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, curr) {
//   console.log(`${key}: ${value}`);
// });

// const note = new Set([`USD`, `EUR`, `GBP`, `EUR`, `USD`, `USD`, `NAIRA`]);
// note.forEach(function (value, key, curr) {
//   console.log(`${key}: ${value}`);
// });
