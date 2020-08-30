'use strict';
/**
 * the functions in this file talk to the database so it takes employee info and returns to their callers
 */

const Debtor = require('./debtor-model.js');

const getAll = async() => {
  try {
    const debtors = await Debtor
      .find();

    console.log("debtors", debtors);
    return ({
      debtors,
      counter: debtors.length
    });
  } catch(error){
    console.log("Error:", error.message);
    return false;
  }
}


module.exports = {
  getAll
};
