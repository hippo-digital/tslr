const express = require('express')
const router = express.Router()

// Utilities
// ---------

// Check if a string contains only numbers
// Handy for phone numbers, account number, sort code, teacher reference number, etc
function isStringSpecificLength(input, chars) {

  if (input.trim().length === chars) {
    return true;
  } else {
    return false;
  }

}

// Check if a string contains only numbers
// Handy for phone numbers, account number, sort code, teacher reference number, etc
function isStringNumbers(input) {

  return /^\d+$/.test(input);

}

// Check if NI Nimber is correct format
function isValidNINO(input) {

  return /^\s*[a-zA-Z]{2}(?:\s*\d\s*){6}[a-zA-Z]?\s*$/.test(input);

}

// Check if is a number formatted as a currency
// £ optional; commas optional; decimal optional.
function isValidCurrency(input) {

  return /(?=.*?\d)^\£?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/.test(input);

}

// Add your routes here - above the module.exports line
// Using regex matching, routes should ideally work even for snapshots

// All Service Models
// ------------------

router.get("/", function (req, res) {

  // Unset everything
  req.session.data = {}
  res.redirect("launch");

})

router.post(/eligibility-schools/, function (req, res) {

  // From eligibility-qts
  let eligible = req.session.data['qts']
  if (eligible === 'no') {
    res.redirect('ineligible')
  } else {
    res.redirect('eligibility-schools')
  }

})

router.post(/eligibility-authority/, function (req, res) {

  // From eligibility-schools
  let eligible = req.session.data['school']
  if (eligible === 'no') {
    res.redirect('ineligible')
  } else {
    res.redirect('eligibility-authority')
  }

})

router.post(/eligibility-proof-loan/, function (req, res) {

  // From eligibility-proof
  let eligible = req.session.data['proof']
  if (eligible === 'no') {
    res.redirect('ineligible')
  } else {
    res.redirect('eligibility-proof-loan')
  }

})

router.post(/eligibility-proof/, function (req, res) {

  // From eligibility-authority
  let eligible = req.session.data['authority']
  if (eligible === 'no') {
    res.redirect('ineligible')
  } else {
    res.redirect('eligibility-proof')
  }

})

router.post(/eligibility-teaching/, function (req, res) {

  // From eligibility-proof-loan
  let eligible = req.session.data['proof-loan']
  if (eligible === 'no') {
    res.redirect('ineligible')
  } else {
    res.redirect('eligibility-teaching')
  }

})

router.post(/about-you-trn/, function (req, res) {

  // From eligibility-teaching
  let eligible = req.session.data['teaching']
  if (eligible === 'no') {
    res.redirect('ineligible')
  } else {
    res.redirect('about-you-trn')
  }

})

router.get(/admin-confirm-eligibility_(name)_([a-z-]+)/, function (req, res) {

  // From admin-applications
  var full_name = req.params[1];
  var name = full_name.split("-");
  var applicant = {
    'full_name': name[0] + ' ' + name[1],
    'first_name': name[0],
    'last_name': name[1]
  };
  req.session.data['applicant'] = applicant;
  res.redirect('admin-confirm-eligibility');

})

router.get(/admin-tslr_(name)_([a-z-]+)/, function (req, res) {

  // From admin-applications
  var full_name = req.params[1];
  var name = full_name.split("-");
  var applicant = {
    'full_name': name[0] + ' ' + name[1],
    'first_name': name[0],
    'last_name': name[1]
  };
  req.session.data['applicant'] = applicant;
  res.redirect('admin-tslr');

})

router.get(/admin-dfe-signin_(name)_([a-z-]+)/, function (req, res) {

  // Delete previous applicant data
  req.session.data['admin-check-send'] = false;
  req.session.data['admin-task-list'] = false;
  req.session.data['admin-eligibility-period'] = false;
  req.session.data['admin-end-day'] = false;
  req.session.data['admin-end-month'] = false;
  req.session.data['admin-end-year'] = false;
  req.session.data['admin-loan-amount'] = false;
  req.session.data['admin-start-day'] = false;
  req.session.data['admin-start-month'] = false;
  req.session.data['admin-start-year'] = false;
  req.session.data['admin-eligibility-teaching'] = false;
  req.session.data['admin-loan-details'] = false;
  req.session.data['admin-loan-amount'] = false;

  // Set-up applicant
  var full_name = req.params[1];
  var name = full_name.split("-");
  var applicant = {
    'full_name': name[0] + ' ' + name[1],
    'first_name': name[0],
    'last_name': name[1]
  };
  req.session.data['applicant'] = applicant;

  res.redirect('admin-dfe-signin');

})

router.get(/admin-confirm-location-eligibility_(name)_([a-z-]+)/, function (req, res) {

  // Delete previous applicant data
  req.session.data['admin-check-send'] = false;
  req.session.data['admin-task-list'] = false;
  req.session.data['admin-eligibility-period'] = false;
  req.session.data['admin-end-day'] = false;
  req.session.data['admin-end-month'] = false;
  req.session.data['admin-end-year'] = false;
  req.session.data['admin-loan-amount'] = false;
  req.session.data['admin-start-day'] = false;
  req.session.data['admin-start-month'] = false;
  req.session.data['admin-start-year'] = false;
  req.session.data['admin-eligibility-teaching'] = false;
  req.session.data['admin-loan-details'] = false;
  req.session.data['admin-loan-amount'] = false;

  // Set-up applicant
  var full_name = req.params[1];
  var name = full_name.split("-");
  var applicant = {
    'full_name': name[0] + ' ' + name[1],
    'first_name': name[0],
    'last_name': name[1]
  };
  req.session.data['applicant'] = applicant;

  res.redirect('admin-confirm-location-eligibility');

})

// !!! Service Model specific handling !!!
// ---------------------------------------
// req.params[0] = a, b, c, d or e
// req.params[1] = Optional archive sub-directory with trailing slash e.g. YYMMDD/
// req.params[2] = page-name

// Deprecated - used up until earlier versions of e
router.post(/([abcde])\/([0-9]*\/?)(teacher-enter-location-confirm)/, function (req, res) {

  if (req.params[0] == "d" || req.params[0] == "e") {
    // Error: No school name provided
    if (req.session.data['teacher-school-name'] == "") {
      req.session.data['teacher-error-no-school'] = true;
      req.session.data['error-message'] = "Enter a school name";
      res.redirect('teacher-enter-location-eligibility');
      next
    } else {
      req.session.data['teacher-error-no-school'] = false;
    }
  }

  req.session.data['temp-params'] = req.params;

  var check_send = req.session.data['teacher-check-send'];

  var setup = req.session.data['teacher-schools-setup'];

  var single_school_claim = req.session.data['single-school-claim'];

  if (setup) {
    var schools = [];
    num_schools = 0;
    if (single_school_claim) {
      var option = 'single-school-claim';
    }
  } else {
    var option = req.session.data['teacher-school-confirm'];
    var schools = req.session.data['teacher-schools'];
    num_schools = schools.length;
  }

  if (option == 'n' || option == 'school-confirm-ya') {
    var school_name = req.session.data['teacher-another-school-name'];
  } else {
    var school_name = req.session.data['teacher-school-name'];
  }

  var eligibility_calc = Math.floor((Math.random() * 2) + 1);
  var school_eligible = eligibility_calc > 1 ? true : false;

  var school = {
    name: school_name,
    eligible: school_eligible
  }

  if (!check_send || (check_send && option == 'n')) {
    schools.push(school);
    num_schools++;
  }

  req.session.data['teacher-schools'] = schools;
  req.session.data['teacher-num-schools'] = num_schools;
  req.session.data['teacher-schools-setup'] = false;

  // Need to branch differently depending whether answer was yes, yes more or no
  if (req.session.data['skip-verify'] == "yes") {
    res.redirect('teacher-enter-trn');
  } else if (!check_send && (option == 'y' || option == 'school-confirm-y' || option == 'school-confirm-n' || option == 'single-school-claim')) {
    if (req.params[0] == "d" && req.params[1] == "181121/") {
      res.redirect('https://govuk-verify.herokuapp.com/intro?requestId=dfe-tslr-option-d&userLOA=0');
      next
    } else if (req.params[0] == "d") {
      res.redirect('https://govuk-verify.herokuapp.com/intro?requestId=dfe-tslr-option-d-alt&userLOA=0');
      next
    } else if (req.params[0] == "e") {
      res.redirect('https://govuk-verify.herokuapp.com/intro?requestId=dfe-tslr-option-e&userLOA=0');
      next
    } else {
      res.redirect('teacher-consent');
    }
  } else if (check_send && option == 'y') {
    res.redirect('teacher-check-send');
  } else {
    res.redirect('teacher-enter-location-confirm');
  }

})

// Deprecated - used up until earlier versions of e
router.post(/([e])\/([0-9]*\/?)(teacher-enter-location-eligibility)/, function (req, res) {

  var fs = require("fs");
  // GIAS data test (10 eligible schools only)
  // var gias_file = fs.readFileSync("app/data/gias_eligible_subset.min.json");
  // GIAS data (eligible schools e.g. 25 LAs)
  // var gias_file = fs.readFileSync("app/data/gias_eligible.min.json");
  // GIAS data (all schools)
  var gias_file = fs.readFileSync("app/data/gias_all.min.json");
  var gias_data = JSON.parse(gias_file);
  // Output JSON as session variable for easier debug
  req.session.data['check-gias-data'] = gias_data;

  var school_names = gias_data.map(function(gias_school){
    return gias_school.est_name;
  });
  req.session.data['school-names'] = school_names;

  req.session.data['single-school-claim'] = true;
  req.session.data['check-error-no-qts'] = false;
  res.redirect('teacher-enter-location-eligibility');

})

// Final - for latest version of e
router.post(/([e])\/([0-9]*\/?)(teacher-enter-location)/, function (req, res) {

  var gias_dataset = 'full'; // min | eligible | full

  var fs = require("fs");

  if (gias_dataset == 'min') {

    // GIAS data test (10 eligible schools only)
    var gias_file = fs.readFileSync("app/data/gias_eligible_subset.min.json");

  } else if (gias_dataset == 'eligibile') {

    // GIAS data (eligible schools e.g. 25 LAs)
    var gias_file = fs.readFileSync("app/data/gias_eligible.min.json");

  } else {

    // GIAS data (all schools)
    var gias_file = fs.readFileSync("app/data/gias_all.min.json");
  }

  var gias_data = JSON.parse(gias_file);

  // Output JSON as session variable for easier debug
  // req.session.data['check-gias-data'] = gias_data;

  var school_names = gias_data.map(function(gias_school){
    return gias_school.est_name;
  });
  req.session.data['school-names'] = school_names;

  if (req.session.data['teacher-schools-setup'] == 'true') {
    var setup = true;
  } else {
    var setup = false;
  }

  if (req.session.data['teacher-check-send'] == "true" || req.session.data['teacher-check-send'] === true) {
    var check_send = true;
  } else {
    var check_send = false;
  }

  if (check_send && req.session.data['teacher-check-send-edit'] == "location") {
    setup = true;
    //delete req.session.data['teacher-school-name'];
    req.session.data['teacher-school'] = null;
    delete req.session.data['teacher-school'];
  }

  // Error: No school name provided
  if (!setup && req.session.data['teacher-school-name'] == "") {
    req.session.data['teacher-error-no-school'] = true;
    req.session.data['error-message'] = "Enter the school name";
    res.redirect('teacher-enter-location');
    next
  } else {
    req.session.data['teacher-error-no-school'] = false;
  }

  if (!setup) {

    var school_name = req.session.data['teacher-school-name'];

    var Fuse = require('fuse.js')
    var fuse_options = {
      shouldSort: true,
      includeScore: true,
      threshold: 0.2,
      location: 0,
      distance: 50,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "est_name"
      ]
    };
    var gias_search = new Fuse(gias_data, fuse_options); // "list" is the item array
    var gias_result = gias_search.search(school_name);

    req.session.data['fuse-search-result'] = gias_result;

    var school = {
      name: gias_result[0].item.est_name,
      la_code: gias_result[0].item.la_code,
      phase_code: gias_result[0].item.phase_code,
      est_type_code: gias_result[0].item.est_type_code,
      eligible: false,
      location: false,
      phase: false,
      type: false
    }

    if (gias_dataset == 'min' || gias_dataset == 'eligible') {

      var eligibility_calc = Math.floor((Math.random() * 2) + 1);
      var school_eligible = eligibility_calc > 1 ? true : false;

    } else {

      // @todo: Move this to some JSON data?
      var local_auths = [873, 380, 806, 928, 340, 935, 371, 867, 353, 830, 370, 929, 926, 831, 890, 355, 815, 821, 874, 812, 876, 851, 861, 343, 342];
      var secondary_phases = [4, 5];
      var sen_school_types = [7, 8, 12, 14, 32, 33, 36, 43, 44];

      if (local_auths.includes(school.la_code)) {

        school.location = true;
        school.eligible = true;

        if (secondary_phases.includes(school.phase_code)) {
          school.phase = true;
          school.eligible = true;
        } else {
          school.eligible = false;
        }

        if (sen_school_types.includes(school.est_type_code)) {
          school.type = true;
          school.eligible = true;
        }

      } else {

        school.eligible = false;

      }

    }

    req.session.data['teacher-school'] = school;

    if (!school.eligible) {
      var eligibility = false;
      req.session.data['teacher-ineligible-reason'] = "school-location";
      if (check_send) {
        req.session.data['teacher-ineligible-continue-url'] = "teacher-check-send";
      } else {
        req.session.data['teacher-ineligible-continue-url'] = "teacher-enter-subject";
      }
    } else {
      var eligibility = true;
      delete req.session.data['teacher-ineligible-reason'];
    }
    req.session.data['teacher-eligible'] = eligibility;

  }

  if (setup) {

    req.session.data['teacher-schools-setup'] = false;
    delete req.session.data['teacher-check-send-edit'];
    res.redirect('teacher-enter-location');

  } else {

    if (!eligibility) {

      res.redirect('teacher-claim-ineligible');

    } else {

      if (check_send) {
        res.redirect('teacher-check-send');
      } else {
        res.redirect('teacher-still-teaching');
      }

    }

  }

})

router.post(/([e])\/([0-9]*\/?)(teacher-still-teaching)/, function (req, res) {

  // Error: No still teaching provided
  if (!req.session.data['teacher-still-teaching']) {
    req.session.data['teacher-error-no-still-teaching'] = true;
    req.session.data['error-message'] = "Select whether you are still employed to teach";
    res.redirect('teacher-still-teaching');
    next
  } else {
    delete req.session.data['teacher-error-no-still-teaching'];
    delete req.session.data['error-message'];
  }

  if (req.session.data['teacher-check-send'] == "true" || req.session.data['teacher-check-send'] === true) {
    var check_send = true;
  } else {
    var check_send = false;
  }

  if (req.session.data['teacher-still-teaching'] == "no") {

    var eligibility = false;
    req.session.data['teacher-ineligible-reason'] = "still-teaching";
    if (check_send) {
      req.session.data['teacher-ineligible-continue-url'] = "teacher-check-send";
    } else {
      req.session.data['teacher-ineligible-continue-url'] = "teacher-enter-subject";
    }

  } else {

    var eligibility = true;
    delete req.session.data['teacher-ineligible-reason'];

  }
  req.session.data['teacher-eligible'] = eligibility;

  if (req.session.data['teacher-check-send-edit']) {

    delete req.session.data['teacher-check-send-edit'];
    res.redirect('teacher-still-teaching');

  } else if (!eligibility) {

    res.redirect('teacher-claim-ineligible');

  } else {

    if (check_send) {
      res.redirect('teacher-check-send');
    } else {
      res.redirect('teacher-enter-subject');
    }

  }

})

router.post(/([e])\/([0-9]*\/?)(teacher-enter-subject)/, function (req, res) {

  // Error: No employed subject provided
  if (!req.session.data['teacher-subject-employed']) {
    req.session.data['teacher-error-no-subject-employed'] = true;
    req.session.data['error-message-employed'] = "Select the subject you were employed to teach";
    res.redirect('teacher-enter-subject');
    next
  } else {
    req.session.data['teacher-error-no-subject-employed'] = false;
  }

  // Error: No actual subject provided
  if (req.session.data['teacher-subject-employed'] == "other" && !req.session.data['teacher-subject-actual']) {
    req.session.data['teacher-error-no-subject-actual'] = true;
    req.session.data['error-message-actual'] = "Select the subject that you actually spent most of your time teaching";
    res.redirect('teacher-enter-subject');
    next
  } else {
    req.session.data['teacher-error-no-subject-actual'] = false;
  }

  if (req.session.data['teacher-check-send'] == "true" || req.session.data['teacher-check-send'] === true) {
    var check_send = true;
  } else {
    var check_send = false;
  }

  if (req.session.data['teacher-subject-employed'] == "other" && req.session.data['teacher-subject-actual'] == "other") {
    var eligibility = false;
    req.session.data['teacher-eligible'] = eligibility;
    req.session.data['teacher-ineligible-reason'] = "teacher-subject";
    if (check_send) {
      req.session.data['teacher-ineligible-continue-url'] = "teacher-check-send";
    } else {
      req.session.data['teacher-ineligible-continue-url'] = "teacher-enter-trn";
    }
  } else {
    var eligibility = true;
    delete req.session.data['teacher-ineligible-reason'];
    req.session.data['teacher-eligible'] = eligibility;
  }

  if (!eligibility) {

    res.redirect('teacher-claim-ineligible');

  } else {

    if (check_send) {
      res.redirect('teacher-enter-subject');
    } else if (req.session.data['skip-verify'] == "yes") {
      res.redirect('teacher-enter-trn');
    } else {
      res.redirect('https://govuk-verify.herokuapp.com/intro?requestId=dfe-tslr-option-e&userLOA=0');
    }

  }

})

router.post(/([e])\/([0-9]*\/?)(teacher-enter-trn)/, function (req, res) {

  // Error handling
  if (req.session.data['teacher-trn'] == "") {
    req.session.data['teacher-error-no-trn'] = true;
    req.session.data['error-message'] = "Enter your teacher reference number";
    res.redirect('teacher-enter-trn');
  } else if (!isStringNumbers(req.session.data['teacher-trn'])) {
    req.session.data['teacher-error-trn-format'] = true;
    req.session.data['error-message'] = "Teacher reference number must only be numbers";
    res.redirect('teacher-enter-trn');
  } else if (!isStringSpecificLength(req.session.data['teacher-trn'], 7)) {
    req.session.data['teacher-error-trn-length'] = true;
    req.session.data['error-message'] = "Teacher reference number must be 7 numbers long";
    res.redirect('teacher-enter-trn');
  } else {
    delete req.session.data['teacher-error-no-trn'];
    delete req.session.data['teacher-error-trn-format'];
    res.redirect('teacher-enter-ni-number');
  }

})

router.post(/([abcd])\/([0-9]*\/?)(teacher-enter-ni-number)/, function (req, res) {

  if (req.params[0] == "d") {

    // Error: No TRN provided
    if (req.session.data['teacher-trn'] == "") {
      req.session.data['teacher-error-no-trn'] = true;
      req.session.data['error-message'] = "Enter your teacher reference number";
      res.redirect('teacher-enter-trn');
      next
    } else {
      req.session.data['teacher-error-no-trn'] = false;
      res.redirect('teacher-enter-ni-number');
    }

  }

})

router.post(/([e])\/([0-9]*\/?)(teacher-enter-ni-number)/, function (req, res) {

  // Error handling
  if (req.session.data['teacher-ni'] == "") {
    req.session.data['teacher-error-no-ni'] = true;
    req.session.data['error-message'] = "Enter your National Insurance number";
    res.redirect('teacher-enter-ni-number');
  } else if (!isValidNINO(req.session.data['teacher-ni'])) {
    req.session.data['teacher-error-ni-format'] = true;
    req.session.data['error-message'] = "Enter a National Insurance number that is 2 letters, 6 numbers, then A, B, C or D, like QQ123456C";
    res.redirect('teacher-enter-ni-number');
  } else {
    delete req.session.data['teacher-error-no-ni'];
    delete req.session.data['teacher-error-ni-format'];
    res.redirect('teacher-enter-repayment-amount');
  }

})

router.post(/([abcde])\/([0-9]*\/?)(teacher-enter-repayment-amount)/, function (req, res) {

  // Error handling
  if (req.params[0] == "d") {

    if (req.session.data['teacher-ni'] == "") {
      req.session.data['teacher-error-no-ni'] = true;
      req.session.data['error-message'] = "Enter your National Insurance number";
      res.redirect('teacher-enter-ni-number');
      next
    } else {
      req.session.data['teacher-error-no-ni'] = false;
      res.redirect('teacher-enter-repayment-amount');
    }

  } else if (req.params[0] == "e") {

    if (!req.session.data['teacher-loan-amount']) {
      req.session.data['teacher-error-no-loan-amount'] = true;
      req.session.data['error-message'] = "Enter the amount of loan you repaid";
      res.redirect('teacher-enter-repayment-amount');
    } else if (!isValidCurrency(req.session.data['teacher-loan-amount'])) {
      req.session.data['teacher-error-loan-amount-format'] = true;
      req.session.data['error-message'] = "Enter the loan amount as a currency, like £100.00 or 100";
      res.redirect('teacher-enter-repayment-amount');
    } else {
      delete req.session.data['teacher-error-no-loan-amount'];
      delete req.session.data['teacher-error-loan-amount-format'];
      res.redirect('teacher-payment-method');
    }

  }


})

router.post(/([abcd])\/([0-9]*\/?)(teacher-consent)/, function (req, res) {

  if (req.params[0] == "d") {

    // Error: No loan amount provided
    if (!req.session.data['teacher-loan-amount']) {
      req.session.data['teacher-error-no-loan-amount'] = true;
      req.session.data['error-message'] = "Enter the amount of loan you repaid";
      res.redirect('teacher-enter-repayment-amount');
      next
    } else {
      req.session.data['teacher-error-no-loan-amount'] = false;
      res.redirect('teacher-consent');
    }

  } else if (req.params[0] == "a") {

    // Error: No teaching provided
    if (!req.session.data['teaching']) {
      req.session.data['teacher-error-no-teaching'] = true;
      req.session.data['error-message'] = "Select what proprtion of time you taught a priority subject";
      res.redirect('teacher-proportion');
      next
    } else {
      delete req.session.data['teacher-error-no-teaching'];
      res.redirect('teacher-consent');
    }

  } else {

    // Error: No NINO provided
    if (!req.session.data['teacher-nino']) {
      req.session.data['teacher-error-no-nino'] = true;
      req.session.data['error-message'] = "Enter your National Insurance number";
      res.redirect('teacher-enter-ni-number');
      next
    } else {
      delete req.session.data['teacher-error-no-nino'];
      res.redirect('teacher-consent');
    }

  }

})

// router.post(/([e])\/([0-9]*\/?)(teacher-consent)/, function (req, res) {
// })

router.post(/([e])\/([0-9]*\/?)(teacher-payment-method)/, function (req, res) {

  // Error handling

  // Validate account name
  var name = req.session.data['teacher-bank-account-name'];
  var validation_errors_name = false;

  if (!name) {
    req.session.data['teacher-error-account-name-missing'] = true;
    req.session.data['error-message-account-name'] = "Enter the name of the account holder";
    validation_errors_name = true;
  } else {
    delete req.session.data['teacher-error-account-name-missing'];
    delete req.session.data['error-message-account-name'];
    validation_errors_name = false;
  }

  // Validate account number
  var number = req.session.data['teacher-bank-account-number'];
  var validation_errors_number = false;

  if (!number || !isStringNumbers(number) || !isStringSpecificLength(number, 8)) {

    if (!number) {
      req.session.data['teacher-error-account-number-missing'] = true;
      req.session.data['error-message-account-number'] = "Enter the account number";
      validation_errors_number = true;
    } else if (!isStringNumbers(number) || !isStringSpecificLength(number, 8)) {
      if (!isStringNumbers(number)) {
        req.session.data['teacher-error-account-number-format'] = true;
        req.session.data['error-message-account-number-format'] = "Account number must only be numbers";
        validation_errors_number = true;
      }
      if (!isStringSpecificLength(number, 8)) {
        req.session.data['teacher-error-account-number-length'] = true;
        req.session.data['error-message-account-number-length'] = "Account number must be 8 numbers long";
        validation_errors_number = true;
      }
      delete req.session.data['teacher-error-account-number-missing'];
      delete req.session.data['error-message-account-number'];
    } else {
      delete req.session.data['teacher-error-account-number-missing'];
      delete req.session.data['teacher-error-account-number-format'];
      delete req.session.data['teacher-error-account-number-length'];
      delete req.session.data['error-message-account-number'];
      delete req.session.data['error-message-account-number-format'];
      delete req.session.data['error-message-account-number-length'];
      validation_errors_number = false;
    }

  } else {
    delete req.session.data['teacher-error-account-number-missing'];
    delete req.session.data['teacher-error-account-number-format'];
    delete req.session.data['teacher-error-account-number-length'];
    delete req.session.data['error-message-account-number'];
    delete req.session.data['error-message-account-number-format'];
    delete req.session.data['error-message-account-number-length'];
    validation_errors_number = false;
  }

  // Validate account sortcode
  var sort1 = req.session.data['teacher-bank-sortcode-1'];
  var sort2 = req.session.data['teacher-bank-sortcode-2'];
  var sort3 = req.session.data['teacher-bank-sortcode-3'];
  var validation_errors_sortcode = false;

  if (!sort1 || !sort2 || !sort3 || !isStringNumbers(sort1) || !isStringNumbers(sort2) || !isStringNumbers(sort3) || !isStringSpecificLength(sort1, 2) || !isStringSpecificLength(sort2, 2) || !isStringSpecificLength(sort3, 2)) {

    if (!sort1 || !sort2 || !sort3) {

      if (!sort1) {
        req.session.data['teacher-error-sortcode1-missing'] = true;
        validation_errors_sortcode = true;
      }
      if (!sort2) {
        req.session.data['teacher-error-sortcode2-missing'] = true;
        validation_errors_sortcode = true;
      }
      if (!sort3) {
        req.session.data['teacher-error-sortcode3-missing'] = true;
        validation_errors_sortcode = true;
      }
      req.session.data['error-message-sortcode-missing'] = "Complete the account sortcode";

    } else if (!isStringNumbers(sort1) || !isStringNumbers(sort2) || !isStringNumbers(sort3) || !isStringSpecificLength(sort1, 2) || !isStringSpecificLength(sort2, 2) || !isStringSpecificLength(sort3, 2)) {

      if (!isStringNumbers(sort1)) {
        req.session.data['teacher-error-sortcode1-format'] = true;
        validation_errors_sortcode = true;
      }
      if (!isStringNumbers(sort2)) {
        req.session.data['teacher-error-sortcode2-format'] = true;
        validation_errors_sortcode = true;
      }
      if (!isStringNumbers(sort3)) {
        req.session.data['teacher-error-sortcode3-format'] = true;
        validation_errors_sortcode = true;
      }
      req.session.data['error-message-sortcode-format'] = "Sortcode must only be numbers, like 12 34 56";

      if (!isStringSpecificLength(sort1, 2)) {
        req.session.data['teacher-error-sortcode1-length'] = true;
        validation_errors_sortcode = true;
      }
      if (!isStringSpecificLength(sort2, 2)) {
        req.session.data['teacher-error-sortcode2-length'] = true;
        validation_errors_sortcode = true;
      }
      if (!isStringSpecificLength(sort3, 2)) {
        req.session.data['teacher-error-sortcode3-length'] = true;
        validation_errors_sortcode = true;
      }
      req.session.data['error-message-sortcode-length'] = "Sortcode must be 3 sets of 2 numbers, like 12 34 56";

      delete req.session.data['error-message-sortcode-missing'];
      delete req.session.data['teacher-error-sortcode1-missing'];
      delete req.session.data['teacher-error-sortcode2-missing'];
      delete req.session.data['teacher-error-sortcode3-missing'];

    } else {

      delete req.session.data['error-message-sortcode-missing'];
      delete req.session.data['error-message-sortcode-format'];
      delete req.session.data['error-message-sortcode-length'];
      delete req.session.data['teacher-error-sortcode1-missing'];
      delete req.session.data['teacher-error-sortcode2-missing'];
      delete req.session.data['teacher-error-sortcode3-missing'];
      delete req.session.data['teacher-error-sortcode1-format'];
      delete req.session.data['teacher-error-sortcode2-format'];
      delete req.session.data['teacher-error-sortcode3-format'];
      delete req.session.data['teacher-error-sortcode1-length'];
      delete req.session.data['teacher-error-sortcode2-length'];
      delete req.session.data['teacher-error-sortcode3-length'];
      validation_errors_sortcode = false;

    }

  } else {

    delete req.session.data['error-message-sortcode-missing'];
    delete req.session.data['error-message-sortcode-format'];
    delete req.session.data['error-message-sortcode-length'];
    delete req.session.data['teacher-error-sortcode1-missing'];
    delete req.session.data['teacher-error-sortcode2-missing'];
    delete req.session.data['teacher-error-sortcode3-missing'];
    delete req.session.data['teacher-error-sortcode1-format'];
    delete req.session.data['teacher-error-sortcode2-format'];
    delete req.session.data['teacher-error-sortcode3-format'];
    delete req.session.data['teacher-error-sortcode1-length'];
    delete req.session.data['teacher-error-sortcode2-length'];
    delete req.session.data['teacher-error-sortcode3-length'];
    validation_errors_sortcode = false;

  }

  if (validation_errors_name || validation_errors_number || validation_errors_sortcode) {
    req.session.data['teacher-validation-errors-name'] = validation_errors_name;
    req.session.data['teacher-validation-errors-number'] = validation_errors_number;
    req.session.data['teacher-validation-errors-sortcode'] = validation_errors_sortcode;
    res.redirect('teacher-payment-method');
  } else {
    delete req.session.data['teacher-validation-errors-name'];
    delete req.session.data['teacher-validation-errors-number'];
    delete req.session.data['teacher-validation-errors-sortcode'];
    res.redirect('teacher-contact-method');
  }

  /*
  if (!req.session.data['teacher-loan-amount']) {

    req.session.data['teacher-error-no-loan-amount'] = true;
    req.session.data['error-message'] = "Enter the amount you repaid";
    res.redirect('teacher-enter-repayment-amount');
    next

  } else if (req.session.data['teacher-loan-amount'] === "0" || req.session.data['teacher-loan-amount'] === "0.00") {

    var eligibility = false;
    req.session.data['teacher-eligible'] = eligibility;
    req.session.data['teacher-ineligible-reason'] = "teacher-loan";
    req.session.data['teacher-ineligible-continue-url'] = "teacher-payment-method";

    res.redirect('teacher-claim-ineligible');

  } else {

    var eligibility = true;
    delete req.session.data['teacher-ineligible-reason'];
    req.session.data['teacher-eligible'] = eligibility;

    delete req.session.data['teacher-error-no-loan-amount'];
    res.redirect('teacher-payment-method');

  }
  */

})

router.post(/([abcde])\/([0-9]*\/?)(teacher-contact-method)/, function (req, res) {

  if (req.params[0] == "d" || req.params[0] == "e") {

    // Error: No payment method provided
    if (!req.session.data['teacher-bank-account-name'] || !req.session.data['teacher-bank-account-number'] || !req.session.data['teacher-bank-sortcode-1'] || !req.session.data['teacher-bank-sortcode-2'] || !req.session.data['teacher-bank-sortcode-3']) {
      req.session.data['teacher-error-payment-details'] = true;
      req.session.data['error-message'] = "Enter your bank details";
      if (!req.session.data['teacher-bank-account-name']) {
        req.session.data['teacher-error-payment-details-name'] = true;
        req.session.data['error-message-account-name'] = "Enter the name of the account holder";
      } else {
        delete req.session.data['teacher-error-payment-details-name'];
      }
      if (!req.session.data['teacher-bank-account-number']) {
        req.session.data['teacher-error-payment-details-number'] = true;
        req.session.data['error-message-account-number'] = "Enter the account number";
      } else {
        delete req.session.data['teacher-error-payment-details-number'];
      }
      if (!req.session.data['teacher-bank-sortcode-1']) {
        req.session.data['teacher-error-payment-details-sort1'] = true;
        req.session.data['error-message-account-sortcode'] = "Enter the account sort code";
      } else {
        delete req.session.data['teacher-error-payment-details-sort1'];
      }
      if (!req.session.data['teacher-bank-sortcode-2']) {
        req.session.data['teacher-error-payment-details-sort2'] = true;
        req.session.data['error-message-account-sortcode'] = "Enter the account sort code";
      } else {
        delete req.session.data['teacher-error-payment-details-sort2'];
      }
      if (!req.session.data['teacher-bank-sortcode-3']) {
        req.session.data['teacher-error-payment-details-sort3'] = true;
        req.session.data['error-message-account-sortcode'] = "Enter the account sort code";
      } else {
        delete req.session.data['teacher-error-payment-details-sort3'];
      }
      res.redirect('teacher-payment-method');
      next
    } else {
      delete req.session.data['teacher-error-payment-details'];
      delete req.session.data['teacher-error-payment-details-name'];
      delete req.session.data['teacher-error-payment-details-number'];
      delete req.session.data['teacher-error-payment-details-sort1'];
      delete req.session.data['teacher-error-payment-details-sort2'];
      delete req.session.data['teacher-error-payment-details-sort3'];
      res.redirect('teacher-contact-method');
    }

  } else {

    res.redirect('teacher-contact-method');

  }

})

router.post(/([abcde])\/([0-9]*\/?)(teacher-check-send)/, function (req, res) {

  if (req.params[0] == "d" || req.params[0] == "e") {

    // Error: No payment method provided
    if (!req.session.data['teacher-contact-method']) {
      req.session.data['teacher-error-no-contact'] = true;
      req.session.data['error-message'] = "Select how you want to be contacted";
      delete req.session.data['teacher-error-no-email'];
      delete req.session.data['teacher-error-no-mobile'];
      res.redirect('teacher-contact-method');
      next
    } else if (req.session.data['teacher-contact-method'] == "email" && !req.session.data['teacher-email-address']) {
      req.session.data['teacher-error-no-email'] = true;
      req.session.data['error-message-email'] = "Enter your email address";
      delete req.session.data['teacher-error-no-contact'];
      delete req.session.data['teacher-error-no-mobile'];
      res.redirect('teacher-contact-method');
      next
    } else if (req.session.data['teacher-contact-method'] == "mobile" && !req.session.data['teacher-mobile-number']) {
      req.session.data['teacher-error-no-mobile'] = true;
      req.session.data['error-message-mobile'] = "Enter your mobile number";
      delete req.session.data['teacher-error-no-contact'];
      delete req.session.data['teacher-error-no-email'];
      res.redirect('teacher-contact-method');
      next
    } else {

      // Prep the data
      var subject_employed = req.session.data['teacher-subject-employed'] || null;
      var subject_actual = req.session.data['teacher-subject-actual'] || null;

      if (subject_employed == "compscience") {
        subject_employed_nice = "Computer Science";
      } else if (subject_employed == "languages") {
        subject_employed_nice = "Languages (not English)";
      } else {
        subject_employed_nice = subject_employed;
      }
      req.session.data['teacher-subject-employed-nice'] = subject_employed_nice;

      if (subject_actual == "compscience") {
        subject_actual_nice = "Computer Science";
      } else if (subject_actual == "languages") {
        subject_actual_nice = "Languages (not English)";
      } else {
        subject_actual_nice = subject_actual;
      }
      req.session.data['teacher-subject-actual-nice'] = subject_actual_nice;

      delete req.session.data['teacher-error-no-contact'];
      delete req.session.data['teacher-error-no-email'];
      delete req.session.data['teacher-error-no-mobile'];
      res.redirect('teacher-check-send');
    }

  }

})

router.post(/([e])\/([0-9]*\/?)(teacher-confirmation)/, function (req, res) {

  var trn  = req.session.data['teacher-trn'];
  var rand_num = Math.ceil((new Date().getTime())/1000000000);

  var code = trn + "-" + rand_num;

  req.session.data['claim-code'] = code;

  res.redirect('teacher-confirmation');
  next

})

router.post(/([abcde])\/([0-9]*\/?)(admin-task-list)/, function (req, res) {

  req.session.data['admin-task-list'] = true;
  res.redirect('admin-task-list');
  next

})

router.post(/([abcd])\/([0-9]*\/?)(admin-confirm-location-eligibility)/, function (req, res) {

  if (req.session.data['admin-check-send'] == "true") {
    req.session.data['admin-check-send'] = false;
    req.session.data['admin-check-send'] = true;
  }

  res.redirect('admin-confirm-location-eligibility');

})

router.post(/([abcd])\/([0-9]*\/?)(admin-confirm-teaching-eligibility)/, function (req, res) {

  if (req.session.data['admin-check-send'] == "true") {
    req.session.data['admin-check-send'] = false;
    req.session.data['admin-check-send'] = true;
  }

  // Error: No location eligibility
  if (!req.session.data['admin-eligibility-period']) {
    req.session.data['admin-error-no-eligibility-location'] = true;
    req.session.data['error-message'] = "Select one of the options";
    res.redirect('admin-confirm-location-eligibility');
    next
  } else {
    req.session.data['admin-error-no-eligibility-location'] = false;
    res.redirect('admin-confirm-teaching-eligibility');
  }

})

router.post(/([abcd])\/([0-9]*\/?)(admin-enter-repayment-amount)/, function (req, res) {

  if (req.session.data['admin-check-send'] == "true") {
    req.session.data['admin-check-send'] = false;
    req.session.data['admin-check-send'] = true;
  }

  if (req.params[0] == "c") {

    res.redirect('admin-enter-repayment-amount');

  } else {

    // Error: No teaching eligibility
    if (!req.session.data['admin-eligibility-teaching']) {
      req.session.data['admin-error-no-eligibility-teaching'] = true;
      req.session.data['error-message'] = "Select one of the options";
      res.redirect('admin-confirm-teaching-eligibility');
      next
    } else {
      delete req.session.data['admin-error-no-eligibility-teaching'];
      res.redirect('admin-enter-repayment-amount');
    }

  }


})

router.post(/([abcde])\/([0-9]*\/?)(admin-check-send)/, function (req, res) {

  // Error: No loan repayment amount
  if (!req.session.data['admin-loan-details']) {
    req.session.data['admin-error-no-loan-details'] = true;
    req.session.data['error-message'] = "Select one of the options";
    res.redirect('admin-enter-repayment-amount');
    next
  } else {
    delete req.session.data['admin-error-no-loan-details'];
    res.redirect('admin-check-send');
  }

})

// router.all(/([e])\/([0-9]*\/?)(admin-claim-received-email)/, function (req, res) {
//
//   if (!req.session.data['admin-claims-data']) {
//     var fs = require("fs");
//     var claims_file = fs.readFileSync("app/data/claims.json");
//     var claims_data = JSON.parse(claims_file);
//     // Output JSON as session variable for easier debug
//     req.session.data['admin-claims-data'] = claims_data;
//   }
//
//   res.redirect('admin-claim-received-email');
//   next
//
// })

router.post(/([e])\/([0-9]*\/?)(admin-claims)/, function (req, res) {

  if (!req.session.data['admin-claims-data']) {
    var fs = require("fs");
    var claims_file = fs.readFileSync("app/data/claims.json");
    var claims_data = JSON.parse(claims_file);
    // Save JSON in session for use/manipulation
    req.session.data['admin-claims-data'] = claims_data;
  }

  if (!req.session.data['admin-claims-data']['num_claims']) {

    var num_claims = {};

    num_claims.total = req.session.data['admin-claims-data']['claims'].length;

    var claims_open = req.session.data['admin-claims-data']['claims'].filter(function (claim) {
      return claim.status == "open";
    });
    num_claims.open = claims_open.length || 0;

    var claims_closed = claims_data.claims.filter(function (claim) {
      return claim.status == "closed";
    });
    num_claims.closed = claims_closed.length || 0;

    req.session.data['admin-claims-data']['num_claims'] = num_claims;

  }

  if (!req.session.data['now']) {

    var ts = require('moment');
    req.session.data['time-now'] = ts().format("DD MMM YYYY");

  }

  res.redirect('admin-claims');
  next

})

router.post(/([e])\/([0-9]*\/?)(admin-claim)/, function (req, res) {

  var claim_id = req.session.data['claim-id'];
  var array_ref = req.session.data['admin-claims-data']['claims'].findIndex(function(claim) {
    return claim.id == claim_id
  })
  req.session.data['array-ref'] = array_ref;

  if (!req.session.data['admin-claims-data']) {

    res.redirect('admin-dfe-signin');

  } else {

    if (req.session.data['update-location'] == "update" && !req.session.data['admin-eligibility-location']) {

      // Error: Meant to update location
      req.session.data['admin-error-no-location'] = true;
      req.session.data['error-message'] = "Select one of the options";
      res.redirect('admin-confirm-location-eligibility');
      next

    } else if (req.session.data['update-location'] == "update" && req.session.data['admin-eligibility-location'] == "yes-part" && (!req.session.data['admin-start-day'] || !req.session.data['admin-start-month'] || !req.session.data['admin-start-year'] || !req.session.data['admin-end-day'] || !req.session.data['admin-end-month'] || !req.session.data['admin-end-year'])) {

      // Update the location value incase it's changed
      req.session.data['admin-claims-data']['claims'][array_ref]['location']['verified'] = "yes-part";

      req.session.data['admin-error-no-location-period'] = true;
      if (!req.session.data['admin-start-day'] || !req.session.data['admin-start-month'] || !req.session.data['admin-start-year']) {
        // Error: Meant to update location with start date
        req.session.data['admin-error-no-location-start-date'] = true;
        req.session.data['error-message'] = "Enter the start date";
      } else {
        delete req.session.data['admin-error-no-location-start-date'];
      }
      if (!req.session.data['admin-end-day'] || !req.session.data['admin-end-month'] || !req.session.data['admin-end-year']) {
        // Error: Meant to update location with end date
        req.session.data['admin-error-no-location-end-date'] = true;
        req.session.data['error-message-b'] = "Enter the end date";
      } else {
        delete req.session.data['admin-error-no-location-end-date'];
      }
      res.redirect('admin-confirm-location-eligibility');
      next

    } else if (req.session.data['update-teaching'] == "update" && !req.session.data['admin-employed-teaching'] && !req.session.data['admin-actual-teaching']) {

      // Error: Meant to update teaching employed
      req.session.data['admin-error-no-teaching-employed'] = true;
      req.session.data['error-message-employed'] = "Select whether they were employed to teach the subject";
      req.session.data['admin-error-no-teaching-actual'] = true;
      req.session.data['error-message-actual'] = "Select whether they actually spent most of their time teaching another subject";
      res.redirect('admin-confirm-teaching-eligibility');
      next

    } else if (req.session.data['update-teaching'] == "update" && !req.session.data['admin-employed-teaching']) {

      // Error: Meant to update teaching employed
      req.session.data['admin-error-no-teaching-employed'] = true;
      req.session.data['error-message-employed'] = "Select whether they were employed to teach the subject";
      res.redirect('admin-confirm-teaching-eligibility');
      next

    } else if (req.session.data['update-teaching'] == "update" && req.session.data['admin-employed-teaching'] == "no" && !req.session.data['admin-actual-teaching'] && req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['declared']['actual']) {

      req.session.data['admin-error-no-teaching-employed'] = false;

      // Update the teaching value incase it's changed
      req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['verified']['employed'] = "no";

      // Error: Meant to update teaching actual
      req.session.data['admin-error-no-teaching-actual'] = true;
      req.session.data['error-message-actual'] = "Select whether they spent most of their time teaching the subject";
      res.redirect('admin-confirm-teaching-eligibility');
      next

    } else if (req.session.data['update-phase'] == "update" && !req.session.data['admin-eligibility-phase']) {

      // Error: Meant to update phase
      req.session.data['admin-error-no-phase'] = true;
      req.session.data['error-message'] = "Select whether they taught 11-16 year olds";
      res.redirect('admin-confirm-phase-eligibility');
      next

    } else if (req.session.data['update-loan'] == "update" && !req.session.data['admin-loan-amount']) {

      // Error: Meant to update loan
      req.session.data['admin-error-no-loan'] = true;
      req.session.data['error-message'] = "Enter the loan repayment amount";
      res.redirect('admin-confirm-repayment-amount');
      next

    } else if (req.session.data['update-location'] == "cancel" || req.session.data['update-teaching'] == "cancel" || req.session.data['update-phase'] == "cancel" || req.session.data['update-loan'] == "cancel") {

      // Skipped/cancelled updating, so reset...
      delete req.session.data['admin-eligibility-location'];
      delete req.session.data['admin-eligibility-teaching'];
      delete req.session.data['admin-loan-amount'];
      // ..and then reset all the error variables
      delete req.session.data['admin-error-no-location'];
      delete req.session.data['admin-error-no-location-period'];
      delete req.session.data['admin-error-no-location-start-date'];
      delete req.session.data['admin-error-no-location-end-date'];
      delete req.session.data['admin-error-no-teaching-employed'];
      delete req.session.data['admin-error-no-teaching-employed-other'];
      delete req.session.data['admin-error-no-teaching-actual'];
      delete req.session.data['admin-error-no-teaching-actual-other'];
      delete req.session.data['admin-error-no-phase'];
      delete req.session.data['admin-error-no-loan'];

      res.redirect('admin-claim');
      next

    } else {

      // Everything looks good so process and sync the latest data to JSON

      if (req.session.data['update-location'] == "update") {

        if (req.session.data['admin-eligibility-location'] == "yes") {

          req.session.data['admin-claims-data']['claims'][array_ref]['location']['eligibility'] = true;
          req.session.data['admin-claims-data']['claims'][array_ref]['location']['verified'] = "yes";
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['status'] = true;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['inel_reason'] = "";

        } else if (req.session.data['admin-eligibility-location'] == "yes-part") {

          var eligiblity_period = {};
          eligiblity_period.start_day = req.session.data['admin-start-day'];
          eligiblity_period.start_month = req.session.data['admin-start-month'];
          eligiblity_period.start_year = req.session.data['admin-start-year'];
          eligiblity_period.end_day = req.session.data['admin-end-day'];
          eligiblity_period.end_month = req.session.data['admin-end-month'];
          eligiblity_period.end_year = req.session.data['admin-end-year'];
          req.session.data['admin-claims-data']['claims'][array_ref]['location']['eligibility-period'] = eligiblity_period;
          delete req.session.data['admin-start-day'];
          delete req.session.data['admin-start-month'];
          delete req.session.data['admin-start-year'];
          delete req.session.data['admin-end-day'];
          delete req.session.data['admin-end-month'];
          delete req.session.data['admin-end-year'];

          req.session.data['admin-claims-data']['claims'][array_ref]['location']['eligibility'] = true;
          req.session.data['admin-claims-data']['claims'][array_ref]['location']['verified'] = "yes-part";
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['status'] = true;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['inel_reason'] = "";

        } else if (req.session.data['admin-eligibility-location'] == "no") {

          req.session.data['admin-claims-data']['claims'][array_ref]['location']['eligibility'] = false;
          req.session.data['admin-claims-data']['claims'][array_ref]['location']['verified'] = "no";
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['status'] = false;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['inel_reason'] = "location";

        }

        delete req.session.data['admin-eligibility-location'];
        delete req.session.data['update-location'];

      }

      if (req.session.data['update-teaching'] == "update") {

        // Store verified text fields if provided
        if (req.session.data['teaching-subject-employed-other']) {
          req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['verified']['employed-other'] = req.session.data['teaching-subject-employed-other'];
          delete req.session.data['teaching-subject-employed-other'];
        }
        if (req.session.data['teaching-subject-actual-other']) {
          req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['verified']['actual-other'] = req.session.data['teaching-subject-actual-other'];
          delete req.session.data['teaching-subject-actual-other'];
        }

        // Store verified teaching confirmation
        if (req.session.data['admin-employed-teaching'] == "no" && req.session.data['admin-actual-teaching'] == "yes") {

          req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['verified']['employed'] = "no";
          req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['verified']['actual'] = "yes";
          req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['eligibility'] = true;

          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['status'] = true;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['inel_reason'] = "";

        } else if (req.session.data['admin-employed-teaching'] == "no" && req.session.data['admin-actual-teaching'] == "no") {

          req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['verified']['employed'] = "no";
          req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['verified']['actual'] = "no";
          req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['eligibility'] = false;

          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['status'] = false;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['inel_reason'] = "teaching";

        } else if (req.session.data['admin-employed-teaching'] == "yes") {

          req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['verified']['employed'] = "yes";
          req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['eligibility'] = true;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['status'] = true;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['inel_reason'] = "";

        } else if (req.session.data['admin-employed-teaching'] == "no") {

          req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['verified']['employed'] = "no";
          req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['eligibility'] = false;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['status'] = false;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['inel_reason'] = "teaching";

        }

        delete req.session.data['admin-employed-teaching'];
        delete req.session.data['admin-actual-teaching'];
        delete req.session.data['admin-eligibility-teaching'];
        delete req.session.data['teaching-subject-employed-other'];
        delete req.session.data['teaching-subject-actual-other'];
        delete req.session.data['update-teaching'];

      }

      if (req.session.data['update-phase'] == "update") {

        if (req.session.data['admin-eligibility-phase'] == "yes") {

          req.session.data['admin-claims-data']['claims'][array_ref]['phase']['eligibility'] = true;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['status'] = true;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['inel_reason'] = "";

        } else if (req.session.data['admin-eligibility-phase'] == "no") {

          req.session.data['admin-claims-data']['claims'][array_ref]['phase']['eligibility'] = false;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['status'] = false;
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['inel_reason'] = "phase";

        }

        delete req.session.data['admin-eligibility-phase'];
        delete req.session.data['update-phase'];

      }

      if (req.session.data['update-loan'] == "update") {

        req.session.data['admin-claims-data']['claims'][array_ref]['loan']['verified'] = req.session.data['admin-loan-amount'];
        req.session.data['admin-claims-data']['claims'][array_ref]['loan']['eligibility'] = true;
        delete req.session.data['admin-loan-amount'];
        delete req.session.data['update-loan'];

      }

      // ..and then reset all the error variables
      delete req.session.data['admin-error-no-location'];
      delete req.session.data['admin-error-no-location-period'];
      delete req.session.data['admin-error-no-location-start-date'];
      delete req.session.data['admin-error-no-location-end-date'];
      delete req.session.data['admin-error-no-teaching-employed'];
      delete req.session.data['admin-error-no-teaching-employed-other'];
      delete req.session.data['admin-error-no-teaching-actual'];
      delete req.session.data['admin-error-no-teaching-actual-other'];
      delete req.session.data['admin-error-no-phase'];
      delete req.session.data['admin-error-no-loan'];
      delete req.session.data['admin-error-no-complete'];
      delete req.session.data['error-message'];
      delete req.session.data['error-message-employed'];
      delete req.session.data['error-message-actual'];

    }

    res.redirect('admin-claim');
    next

  }

})

// router.post(/([abcde])\/([0-9]*\/?)(admin-confirm-location-eligibility)/, function (req, res) {
// })

// router.post(/([abcde])\/([0-9]*\/?)(admin-confirm-teaching-eligibility)/, function (req, res) {
// })

// router.post(/([abcde])\/([0-9]*\/?)(admin-confirm-repayment-eligibility)/, function (req, res) {
// })

router.post(/([e])\/([0-9]*\/?)(admin-confirmation)/, function (req, res) {

  // Check which claim is being handled
  var claim_id = req.session.data['claim-id'];
  var array_ref = req.session.data['array-ref'];

  var eligibility_status = req.session.data['admin-claims-data']['claims'][array_ref]['eligibility']['status'];
  var location_eligibility = req.session.data['admin-claims-data']['claims'][array_ref]['location']['eligibility'];
  var teaching_eligibility = req.session.data['admin-claims-data']['claims'][array_ref]['teaching']['eligibility'];
  var phase_eligibility = req.session.data['admin-claims-data']['claims'][array_ref]['phase']['eligibility'];
  var loan_eligibility = req.session.data['admin-claims-data']['claims'][array_ref]['loan']['eligibility'];

  if (eligibility_status && (!location_eligibility || !teaching_eligibility || !phase_eligibility || !loan_eligibility)) {

    // Incomplete: If eligibility status is true but not all the eligibilities are yes
    req.session.data['admin-error-no-complete'] = true;
    req.session.data['error-message'] = "Complete the missing information";
    res.redirect('admin-claim');
    next

  } else {

    // Complete: If the eligibility is false
    // Complete: Else if eligibility status is true and all the eligibilities are yes

    // Set the claim to processed
    req.session.data['admin-claims-data']['claims'][array_ref]['status'] = "closed";

    // Updated muber of claims
    var num_claims = req.session.data['admin-claims-data']['num_claims'];
    num_claims.open--;
    num_claims.closed++;
    req.session.data['admin-claims-data']['num_claims'] = num_claims;

    res.redirect('admin-confirmation');
    next

  }

})

// Eligibility checker
// -------------------

// router.get(/([z])\/([0-9]*\/?)(check-intro)/, function (req, res) {
// })

router.post(/([z])\/([0-9]*\/?)(check-qts)/, function (req, res) {

  // Debug stuff
  var debug = req.session.data['debug'] || [];
  var route = { "name": "check-qts", "visited": true };
  debug.push(route);
  req.session.data['debug'] = debug;

  res.redirect('check-qts');
  next

})

router.post(/([z])\/([0-9]*\/?)(check-location-search)/, function (req, res) {

  // Debug stuff
  var debug = req.session.data['debug'] || [];
  var route = { "name": "check-location-search", "visited": true };
  debug.push(route);
  req.session.data['debug'] = debug;

  // Error: No qts year provided
  if (!req.session.data['check-qts']) {
    req.session.data['check-error-no-qts'] = true;
    req.session.data['error-message'] = "Select one of the options";
    res.redirect('check-qts');
    next
  } else if(req.session.data['check-qts'] == "none") {
    req.session.data['check-eligible'] = false;
    req.session.data['check-ineligible-reason'] = "qts";
    res.redirect('check-ineligible');
  } else {

    var fs = require("fs");
    // GIAS data test (10 eligible schools only)
    // var gias_file = fs.readFileSync("app/data/gias_eligible_subset.min.json");
    // GIAS data (eligible schools e.g. 25 LAs)
    var gias_file = fs.readFileSync("app/data/gias_eligible.min.json");
    // GIAS data (all schools)
    // var gias_file = fs.readFileSync("app/data/gias_all.min.json");
    var gias_data = JSON.parse(gias_file);
    // Output JSON as session variable for easier debug
    req.session.data['check-gias-data'] = gias_data;

    var school_names = gias_data.map(function(gias_school){
      return gias_school.est_name;
    });
    req.session.data['school-names'] = school_names;
    // res.locals.school_names = school_names;

    delete req.session.data['check-error-no-qts'];
    res.redirect('check-location-search');
  }

})

router.post(/([z])\/([0-9]*\/?)(check-loan)/, function (req, res) {

  // Debug stuff
  var debug = req.session.data['debug'] || [];
  var route = { "name": "check-loan", "visited": true };
  debug.push(route);
  req.session.data['debug'] = debug;

  // Error: No school name provided
  if (req.session.data['check-school-name'] == "") {
    req.session.data['check-error-no-school'] = true;
    req.session.data['error-message'] = "Enter the school name";
    res.redirect('check-location-search');
    next
  } else {
    delete req.session.data['check-error-no-school'];
  }

  var check_send = false;

  var schools = [];
  num_schools = 0;

  var school_search = req.session.data['check-school-name'];

  var gias_data = req.session.data['check-gias-data'];

  var Fuse = require('fuse.js')
  var fuse_options = {
    shouldSort: true,
    includeScore: true,
    threshold: 0.2,
    location: 0,
    distance: 50,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      "est_name"
    ]
  };
  var gias_search = new Fuse(gias_data, fuse_options); // "list" is the item array
  var gias_result = gias_search.search(school_search);

  req.session.data['fuse-search-result'] = gias_result;

  // Results are sorted by match accuracy so just use first school for prototype
  if (Array.isArray(gias_result) && gias_result.length > 0) {
    // There are match[es]

    var school = {
      name: gias_result[0].item.est_name,
      la_code: gias_result[0].item.la_code,
      est_type_code: gias_result[0].item.est_type_code,
      phase_code: gias_result[0].item.phase_code
    }

    if (gias_result[0].score < 0.2) {
      school.matched = true;
      school.location = false;
      school.phase = false;
      school.type = false;
    }

    var local_auths = [873, 380, 806, 928, 340, 935, 371, 867, 353, 830, 370, 929, 926, 831, 890, 355, 815, 821, 874, 812, 876, 851, 861, 343, 342];
    var secondary_phases = [4, 5];
    var school_types = [7, 8, 12, 14, 32, 33, 36, 43, 44];

    if (local_auths.includes(school.la_code)) {
      school.location = true;
    }

    if (secondary_phases.includes(school.phase_code)) {
      school.phase = true;
    }

    if (school_types.includes(school.est_type_code)) {
      school.type = true;
    }

  } else {
    // No match

    var school = {
      name: school_search,
      search_term: school_search,
      matched: false,
      location: false,
      phase: false,
      type: false
    }
  }

  schools.push(school);
  num_schools++;

  req.session.data['check-schools'] = schools;
  req.session.data['check-num-schools'] = num_schools;

  if ((school.location && school.phase) || (school.location && school.type)) {
    delete req.session.data['check-error-no-school'];
    res.redirect('check-loan');
  } else if (!school.location) {
    // Not in eligible LA
    req.session.data['check-eligible'] = false;
    req.session.data['check-ineligible-reason'] = "school-location";
    res.redirect('check-ineligible');
  } else if (school.location && !school.phase) {
    // Not a secondary
    req.session.data['check-eligible'] = false;
    req.session.data['check-ineligible-reason'] = "school-phase";
    res.redirect('check-ineligible');
  } else if (school.location && !school.type) {
    // Not a SEN
    req.session.data['check-eligible'] = false;
    req.session.data['check-ineligible-reason'] = "school-type";
    res.redirect('check-ineligible');
  } else {
    delete req.session.data['check-error-no-school'];
    res.redirect('check-loan');
  }

})

router.post(/([z])\/([0-9]*\/?)(check-teaching)/, function (req, res) {

  // Debug stuff
  var debug = req.session.data['debug'] || [];
  var route = { "name": "check-teaching", "visited": true };
  debug.push(route);
  req.session.data['debug'] = debug;

  // Error: No loan provided
  if (!req.session.data['check-loan']) {
    req.session.data['check-error-no-loan'] = true;
    req.session.data['error-message'] = "Select one of the options";
    res.redirect('check-loan');
    next
  } else if(req.session.data['check-loan'] == "no") {
    req.session.data['check-eligible'] = false;
    req.session.data['check-ineligible-reason'] = "loan";
    req.session.data['check-ineligible-school-name'] = req.session.data['check-schools'][0]['name'];
    res.redirect('check-ineligible');
  } else {
    delete req.session.data['check-error-no-loan'];
    if (req.session.data['check-schools'][0]['type']) {
      res.redirect('check-still-teaching');
    } else {
      res.redirect('check-teaching');
    }
  }

})

router.post(/([z])\/([0-9]*\/?)(check-still-teaching)/, function (req, res) {

  // Debug stuff
  var debug = req.session.data['debug'] || [];
  var route = { "name": "check-still-teaching", "visited": true };
  debug.push(route);
  req.session.data['debug'] = debug;

  // Error: No teaching info supplied
  if (!req.session.data['check-teaching']) {
    req.session.data['check-error-no-teaching'] = true;
    req.session.data['error-message'] = "Select one of the options";
    res.redirect('check-teaching');
    next
  } else if (req.session.data['check-teaching'] == "ineligible") {
    req.session.data['check-eligible'] = false;
    req.session.data['check-ineligible-reason'] = "teaching";
    res.redirect('check-ineligible');
  } else if (req.session.data['check-teaching'] == "ineligible-less") {
    req.session.data['check-eligible'] = false;
    req.session.data['check-ineligible-reason'] = "teaching-less";
    res.redirect('check-ineligible');
  } else if (req.session.data['check-teaching'] == "other" && (!req.session.data['teaching-subject-other'] || !req.session.data['check-teaching-time'])) {
    if (!req.session.data['teaching-subject-other']) {
      req.session.data['check-error-no-teaching-other'] = true;
      req.session.data['error-message-other'] = "Enter the subject you taught";
    } else {
      delete req.session.data['check-error-no-teaching-other'];
    }
    if (!req.session.data['check-teaching-time']) {
      req.session.data['check-error-no-teaching-time'] = true;
      req.session.data['error-message-time'] = "Select one of the options";
    } else {
      delete req.session.data['check-error-no-teaching-time'];
    }
    delete req.session.data['check-error-no-teaching'];
    res.redirect('check-teaching');
    next
  } else if (req.session.data['check-teaching'] == "other" && req.session.data['check-teaching-time'] == "other") {
    req.session.data['check-eligible'] = false;
    req.session.data['check-ineligible-reason'] = "teaching-other";
    res.redirect('check-ineligible');
  } else {
    delete req.session.data['check-error-no-teaching'];
    delete req.session.data['check-error-no-teaching-other'];
    delete req.session.data['check-error-no-teaching-time'];
    res.redirect('check-still-teaching');
  }

})

router.post(/([z])\/([0-9]*\/?)(check-phase)/, function (req, res) {

  // Debug stuff
  var debug = req.session.data['debug'] || [];
  var route = { "name": "check-phase", "visited": true };
  debug.push(route);
  req.session.data['debug'] = debug;

  // Error: No still teaching provided
  if (!req.session.data['check-still-teaching']) {
    req.session.data['check-error-no-still-teaching'] = true;
    req.session.data['error-message'] = "Select one of the options";
    res.redirect('check-still-teaching');
    next
  } else if (req.session.data['check-still-teaching'] == "no") {
    req.session.data['check-eligible'] = false;
    req.session.data['check-ineligible-reason'] = "still-teaching";
    res.redirect('check-ineligible');
  } else {
    delete req.session.data['check-error-no-still-teaching'];
    res.redirect('check-phase');
  }

})

router.post(/([z])\/([0-9]*\/?)(check-eligible)/, function (req, res) {

  // Debug stuff
  var debug = req.session.data['debug'] || [];
  var route = { "name": "check-eligible", "visited": true };
  debug.push(route);
  req.session.data['debug'] = debug;

  // Error: No teaching phase provided
  if (!req.session.data['check-teaching-phase']) {
    req.session.data['check-error-no-teaching-phase'] = true;
    req.session.data['error-message'] = "Select one of the options";
    res.redirect('check-phase');
    next
  } else if (req.session.data['check-teaching-phase'] == "no") {
    req.session.data['check-eligible'] = false;
    req.session.data['check-ineligible-reason'] = "teaching-phase";
    res.redirect('check-ineligible');
  } else {
    delete req.session.data['check-error-no-teaching-phase'];
    res.redirect('check-eligible');
  }

})

module.exports = router
