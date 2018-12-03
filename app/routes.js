const express = require('express')
const router = express.Router()

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

router.post(/([abcde])\/([0-9]*\/?)(teacher-enter-location-confirm)/, function (req, res) {

  if (req.params[0] == "d" || req.params[0] == "e") {
    // Error: No school name provided
    if (req.session.data['teacher-school-name'] == "") {
      req.session.data['teacher-error-no-school'] = true;
      req.session.data['error-message'] = "Enter the school name or reference number";
      res.redirect('teacher-enter-location-eligibility');
      next
    } else {
      req.session.data['teacher-error-no-school'] = false;
    }
  }

  req.session.data['temp-params'] = req.params;

  var check_send = req.session.data['teacher-check-send'];

  var setup = req.session.data['teacher-schools-setup'];

  if (setup) {
    var schools = [];
    num_schools = 0;
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
  if (!check_send && (option == 'y' || option == 'school-confirm-y' || option == 'school-confirm-n')) {
    if (req.params[0] == "d" && req.params[1] == "181121/") {
      res.redirect('http://govuk-verify-loa1.herokuapp.com/intro?requestId=dfe-tslr-option-d&userLOA=0');
      next
    } else if (req.params[0] == "d") {
      res.redirect('http://govuk-verify-loa1.herokuapp.com/intro?requestId=dfe-tslr-option-d-alt&userLOA=0');
      next
    } else if (req.params[0] == "e") {
      res.redirect('http://govuk-verify-loa1.herokuapp.com/intro?requestId=dfe-tslr-option-e&userLOA=0');
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

router.post(/([abcde])\/([0-9]*\/?)(teacher-enter-ni-number)/, function (req, res) {

  if (req.params[0] == "d" || req.params[0] == "e") {

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

router.post(/([abcde])\/([0-9]*\/?)(teacher-enter-repayment-amount)/, function (req, res) {

  if (req.params[0] == "d" || req.params[0] == "e") {

    // Error: No NI Number provided
    if (req.session.data['teacher-ni'] == "") {
      req.session.data['teacher-error-no-ni'] = true;
      req.session.data['error-message'] = "Enter your NI Number";
      res.redirect('teacher-enter-ni-number');
      next
    } else {
      req.session.data['teacher-error-no-ni'] = false;
      res.redirect('teacher-enter-repayment-amount');
    }

  }

})

router.post(/([abcde])\/([0-9]*\/?)(teacher-consent)/, function (req, res) {

  if (req.params[0] == "d" || req.params[0] == "e") {

    // Error: No NI Number provided
    if (!req.session.data['teacher-loan-amount']) {
      req.session.data['teacher-error-no-loan-amount'] = true;
      req.session.data['error-message'] = "Enter your loan repayment amount";
      res.redirect('teacher-enter-repayment-amount');
      next
    } else {
      req.session.data['teacher-error-no-loan-amount'] = false;
      res.redirect('teacher-consent');
    }

  }

})

router.post(/([abcde])\/([0-9]*\/?)(teacher-contact-method)/, function (req, res) {

  if (req.params[0] == "d" || req.params[0] == "e") {

    // Error: No payment method provided
    if (!req.session.data['teacher-bank-account-name'] || !req.session.data['teacher-bank-account-number'] || !req.session.data['teacher-bank-sortcode-1'] || !req.session.data['teacher-bank-sortcode-2'] || !req.session.data['teacher-bank-sortcode-3']) {
      req.session.data['teacher-error-payment-details'] = true;
      req.session.data['error-message'] = "Check you have entered all your bank details";
      if (!req.session.data['teacher-bank-account-name']) {
        req.session.data['teacher-error-payment-details-name'] = true;
        req.session.data['error-message-account-name'] = "Enter your account name";
      } else {
        req.session.data['teacher-error-payment-details-name'] = false;
      }
      if (!req.session.data['teacher-bank-account-number']) {
        req.session.data['teacher-error-payment-details-number'] = true;
        req.session.data['error-message-account-number'] = "Enter your account number";
      } else {
        req.session.data['teacher-error-payment-details-number'] = false;
      }
      if (!req.session.data['teacher-bank-sortcode-1']) {
        req.session.data['teacher-error-payment-details-sort1'] = true;
        req.session.data['error-message-account-sortcode'] = "Enter your account sortcode";
      } else {
        req.session.data['teacher-error-payment-details-sort1'] = false;
      }
      if (!req.session.data['teacher-bank-sortcode-2']) {
        req.session.data['teacher-error-payment-details-sort2'] = true;
        req.session.data['error-message-account-sortcode'] = "Enter your account sortcode";
      } else {
        req.session.data['teacher-error-payment-details-sort2'] = false;
      }
      if (!req.session.data['teacher-bank-sortcode-3']) {
        req.session.data['teacher-error-payment-details-sort3'] = true;
        req.session.data['error-message-account-sortcode'] = "Enter your account sortcode";
      } else {
        req.session.data['teacher-error-payment-details-sort3'] = false;
      }
      res.redirect('teacher-payment-method');
      next
    } else {
      req.session.data['teacher-error-payment-details'] = false;
      req.session.data['teacher-error-payment-details-name'] = false;
      req.session.data['teacher-error-payment-details-number'] = false;
      req.session.data['teacher-error-payment-details-sort1'] = false;
      req.session.data['teacher-error-payment-details-sort2'] = false;
      req.session.data['teacher-error-payment-details-sort3'] = false;
      res.redirect('teacher-contact-method');
    }

  }

})

router.post(/([abcde])\/([0-9]*\/?)(teacher-check-send)/, function (req, res) {

  if (req.params[0] == "d" || req.params[0] == "e") {

    // Error: No payment method provided
    if (!req.session.data['teacher-contact-method']) {
      req.session.data['teacher-error-no-contact'] = true;
      req.session.data['error-message'] = "Select how you would like us to contact you";
      req.session.data['teacher-error-no-email'] = false;
      req.session.data['teacher-error-no-mobile'] = false;
      res.redirect('teacher-contact-method');
      next
    } else if (req.session.data['teacher-contact-method'] == "email" && !req.session.data['teacher-email-address']) {
      req.session.data['teacher-error-no-email'] = true;
      req.session.data['error-message-email'] = "Enter your email address";
      req.session.data['teacher-error-no-contact'] = false;
      req.session.data['teacher-error-no-mobile'] = false;
      res.redirect('teacher-contact-method');
      next
    } else if (req.session.data['teacher-contact-method'] == "mobile" && !req.session.data['teacher-mobile-number']) {
      req.session.data['teacher-error-no-mobile'] = true;
      req.session.data['error-message-mobile'] = "Enter your mobile number";
      req.session.data['teacher-error-no-contact'] = false;
      req.session.data['teacher-error-no-email'] = false;
      res.redirect('teacher-contact-method');
      next
    } else {
      req.session.data['teacher-error-no-contact'] = false;
      req.session.data['teacher-error-no-email'] = false;
      req.session.data['teacher-error-no-mobile'] = false;
      res.redirect('teacher-check-send');
    }

  }

})

router.post(/([abcde])\/([0-9]*\/?)(admin-task-list)/, function (req, res) {

  req.session.data['admin-task-list'] = true;
  res.redirect('admin-task-list');
  next

})

router.post(/([abcde])\/([0-9]*\/?)(admin-confirm-location-eligibility)/, function (req, res) {

  if (req.session.data['admin-check-send'] == "true") {
    req.session.data['admin-check-send'] = false;
    req.session.data['admin-check-send'] = true;
  }

  res.redirect('admin-confirm-location-eligibility');

})

router.post(/([abcde])\/([0-9]*\/?)(admin-confirm-teaching-eligibility)/, function (req, res) {

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

router.post(/([abcde])\/([0-9]*\/?)(admin-enter-repayment-amount)/, function (req, res) {

  if (req.session.data['admin-check-send'] == "true") {
    req.session.data['admin-check-send'] = false;
    req.session.data['admin-check-send'] = true;
  }

  // Error: No teaching eligibility
  if (!req.session.data['admin-eligibility-teaching']) {
    req.session.data['admin-error-no-eligibility-teaching'] = true;
    req.session.data['error-message'] = "Select one of the options";
    res.redirect('admin-confirm-teaching-eligibility');
    next
  } else {
    req.session.data['admin-error-no-eligibility-teaching'] = false;
    res.redirect('admin-enter-repayment-amount');
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
    req.session.data['admin-error-no-loan-details'] = false;
    res.redirect('admin-check-send');
  }

})

// Eligibility checker
// -------------------

// router.get(/([z])\/([0-9]*\/?)(check-intro)/, function (req, res) {
// })

// router.post(/([z])\/([0-9]*\/?)(check-qts)/, function (req, res) {
// })

router.post(/([z])\/([0-9]*\/?)(check-location-search)/, function (req, res) {

  // Error: No qts year provided
  if (!req.session.data['check-qts']) {
    req.session.data['check-error-no-qts'] = true;
    req.session.data['error-message'] = "Select one of the options";
    res.redirect('check-qts');
    next
  } else if(req.session.data['check-qts'] == "none") {
    req.session.data['check-eligible'] = false;
    res.redirect('check-ineligible');
  } else {
    req.session.data['check-error-no-qts'] = false;
    res.redirect('check-location-search');
  }

})

router.post(/([z])\/([0-9]*\/?)(check-location)/, function (req, res) {

  // Error: No school name provided
  if (req.session.data['check-school-name'] == "") {
    req.session.data['check-error-no-school'] = true;
    req.session.data['error-message'] = "Enter the school name or reference number";
    res.redirect('check-location-search');
    next
  } else {
    req.session.data['check-error-no-school'] = false;
  }

  // var check_send = req.session.data['teacher-check-send'];
  var check_send = false;

  var setup = req.session.data['check-schools-setup'];

  if (setup) {
    var schools = [];
    num_schools = 0;
  } else {
    var option = req.session.data['check-school-confirm'];
    var schools = req.session.data['check-schools'];
    num_schools = schools.length;
  }

  if (option == 'n') {
    var school_name = req.session.data['check-another-school-name'];
  } else {
    var school_name = req.session.data['check-school-name'];
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

  req.session.data['check-schools'] = schools;
  req.session.data['check-num-schools'] = num_schools;
  req.session.data['check-schools-setup'] = false;

  // Need to branch differently depending whether answer was yes, yes more or no
  if (option == 'y') {
    res.redirect('check-teaching');
  } else {
    res.redirect('check-location');
  }

})

//router.post(/([z])\/([0-9]*\/?)(check-teaching)/, function (req, res) {

  // Need some logic here to catch single/all schools being ineligible

//})

router.post(/([z])\/([0-9]*\/?)(check-eligible)/, function (req, res) {

  // Error: No teaching info supplied
  if (!req.session.data['check-teaching']) {
    req.session.data['check-error-no-teaching'] = true;
    req.session.data['error-message'] = "Select one of the options";
    res.redirect('check-teaching');
    next
  } else if(req.session.data['check-teaching'] == "none") {
    req.session.data['check-eligible'] = false;
    res.redirect('check-ineligible');
  } else {
    req.session.data['check-error-no-teaching'] = false;
    res.redirect('check-eligible');
  }

})

module.exports = router
