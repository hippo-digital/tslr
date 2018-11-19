const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
// Using regex matching, routes should ideally work even for snapshots

// All Service Models
// ------------------

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

// Service Model B only
// --------------------
// Careful! Actually, there's nothing in this rule which is '/b/' specific!!

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

// Service Model C only
// --------------------
// Careful! Actually, there's nothing in this rule which is '/c/' specific!!
// req.params[0] = a, b, c or d
// req.params[1] = Optional archive sub-directory with trailing slash e.g. YYMMDD/
// req.params[2] = page-name

router.post(/([abcd])\/([a-z0-9]*\/*)(teacher-enter-location-confirm)/, function (req, res) {

  // Error: No school name provided
  if (req.session.data['teacher-school-name'] == "") {
    req.session.data['teacher-error-no-school'] = true;
    req.session.data['error-message'] = "Enter the name or reference number of your school";
    res.redirect('teacher-enter-location-eligibility');
    next
  } else {
    req.session.data['teacher-error-no-school'] = false;
  }

  req.session.data['temp-params'] = req.params;

  // From teacher-enter-location-eligibility
  var setup = req.session.data['teacher-schools-setup'];

  if (setup) {
    var schools = [];
    num_schools = 0;
  } else {
    var option = req.session.data['teacher-school-confirm'];
    var schools = req.session.data['teacher-schools'];
    num_schools = schools.length;
  }

  if (option == 'school-confirm-ya') {
    var school_name = req.session.data['teacher-another-school-name'];
  } else {
    var school_name = req.session.data['teacher-school-name'];
  }

  schools.push(school_name);
  num_schools++;

  req.session.data['teacher-schools'] = schools;
  req.session.data['teacher-num-schools'] = num_schools;
  req.session.data['teacher-schools-setup'] = false;

  // Need to branch differently depending whether answer was yes, yes more or no
  if (option == 'school-confirm-y' || option == 'school-confirm-n') {
    if (req.params[0] == "d") {
      res.redirect('http://govuk-verify-loa1.herokuapp.com/intro?requestId=dfe-tslr-option-d&userLOA=0');
      next
    } else {
      res.redirect('teacher-consent');
    }
  } else {
    res.redirect('teacher-enter-location-confirm');
  }

})

router.post(/([abcd])\/([a-z0-9]*\/*)(teacher-enter-trn)/, function (req, res) {

  // Error: No NI Number provided
  if (req.session.data['teacher-ni'] == "") {
    req.session.data['teacher-error-no-ni'] = true;
    req.session.data['error-message'] = "Enter your NI Number";
    res.redirect('teacher-enter-ni-number');
    next
  } else {
    req.session.data['teacher-error-no-ni'] = false;
    res.redirect('teacher-enter-trn');
  }

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

// Service Model D only
// --------------------

// router.get(/admin-claim-received-email/, function (req, res) {
//
//   if (not req.session.data['admin-reset-applicant']) {
//     req.session.data['admin-reset-applicant'] = true;
//     res.redirect('admin-claim-received-email');
//   }
//
// })

// router.get(/admin-applications/, function (req, res) {
//
//   if (req.session.data['admin-check-send']) {
//     req.session.data['admin-check-send'] = false;
//     delete req.session.data['admin-eligibility-period'] = "";
//     delete req.session.data['admin-eligibility-teaching'] = "";
//     delete req.session.data['admin-end-day'] = "";
//     delete req.session.data['admin-end-month'] = "";
//     delete req.session.data['admin-end-year'] = "";
//     delete req.session.data['admin-loan-amount'] = "";
//     delete req.session.data['admin-start-day'] = "";
//     delete req.session.data['admin-start-month'] = "";
//     delete req.session.data['admin-start-year'] = "";
//     delete req.session['user'];
//     res.redirect('admin-applications');
//   }
//
// })

router.post(/admin-confirm-location-eligibility/, function (req, res) {

  if (req.session.data['admin-check-send'] == "true") {
    req.session.data['admin-check-send'] = false;
    req.session.data['admin-check-send'] = true;
  }

  res.redirect('admin-confirm-location-eligibility');

})

router.post(/admin-confirm-teaching-eligibility/, function (req, res) {

  if (req.session.data['admin-check-send'] == "true") {
    req.session.data['admin-check-send'] = false;
    req.session.data['admin-check-send'] = true;
  }

  res.redirect('admin-confirm-teaching-eligibility');

})

router.post(/admin-enter-repayment-amount/, function (req, res) {

  if (req.session.data['admin-check-send'] == "true") {
    req.session.data['admin-check-send'] = false;
    req.session.data['admin-check-send'] = true;
  }

  res.redirect('admin-enter-repayment-amount');

})

module.exports = router
