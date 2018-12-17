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

router.post(/([e])\/([0-9]*\/?)(teacher-enter-location-eligibility)/, function (req, res) {

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

  req.session.data['single-school-claim'] = true;
  req.session.data['check-error-no-qts'] = false;
  res.redirect('teacher-enter-location-eligibility');

})

router.post(/([abcde])\/([0-9]*\/?)(teacher-enter-location-confirm)/, function (req, res) {

  if (req.params[0] == "d" || req.params[0] == "e") {
    // Error: No school name provided
    if (req.session.data['teacher-school-name'] == "") {
      req.session.data['teacher-error-no-school'] = true;
      req.session.data['error-message'] = "Enter the school name or postcode";
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
  if (req.session.data['skip-verify'] == 'yes') {
    res.redirect('teacher-enter-trn');
  } else if (!check_send && (option == 'y' || option == 'school-confirm-y' || option == 'school-confirm-n' || option == 'single-school-claim')) {
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
      req.session.data['error-message'] = "Enter your national insurance number";
      res.redirect('teacher-enter-ni-number');
      next
    } else {
      req.session.data['teacher-error-no-ni'] = false;
      res.redirect('teacher-enter-repayment-amount');
    }

  }

})

router.post(/([abcd])\/([0-9]*\/?)(teacher-consent)/, function (req, res) {

  if (req.params[0] == "d") {

    // Error: No NI Number provided
    if (!req.session.data['teacher-loan-amount']) {
      req.session.data['teacher-error-no-loan-amount'] = true;
      req.session.data['error-message'] = "Enter the amount of loan you repaid";
      res.redirect('teacher-enter-repayment-amount');
      next
    } else {
      req.session.data['teacher-error-no-loan-amount'] = false;
      res.redirect('teacher-consent');
    }

  }

})

// router.post(/([e])\/([0-9]*\/?)(teacher-consent)/, function (req, res) {
//
//   req.session.data['teacher-error-no-loan-amount'] = false;
//   res.redirect('teacher-consent');
//
// })

router.post(/([e])\/([0-9]*\/?)(teacher-payment-method)/, function (req, res) {

  if (!req.session.data['teacher-loan-amount']) {
    req.session.data['teacher-error-no-loan-amount'] = true;
    req.session.data['error-message'] = "Enter your loan repayment amount";
    res.redirect('teacher-enter-repayment-amount');
    next
  } else {
    req.session.data['teacher-error-no-loan-amount'] = false;
    res.redirect('teacher-payment-method');
  }

})

router.post(/([abcde])\/([0-9]*\/?)(teacher-contact-method)/, function (req, res) {

  if (req.params[0] == "d" || req.params[0] == "e") {

    // Error: No payment method provided
    if (!req.session.data['teacher-bank-account-name'] || !req.session.data['teacher-bank-account-number'] || !req.session.data['teacher-bank-sortcode-1'] || !req.session.data['teacher-bank-sortcode-2'] || !req.session.data['teacher-bank-sortcode-3']) {
      req.session.data['teacher-error-payment-details'] = true;
      req.session.data['error-message'] = "Enter your bank details";
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
        req.session.data['error-message-account-sortcode'] = "Enter your account sort code";
      } else {
        req.session.data['teacher-error-payment-details-sort1'] = false;
      }
      if (!req.session.data['teacher-bank-sortcode-2']) {
        req.session.data['teacher-error-payment-details-sort2'] = true;
        req.session.data['error-message-account-sortcode'] = "Enter your account sort code";
      } else {
        req.session.data['teacher-error-payment-details-sort2'] = false;
      }
      if (!req.session.data['teacher-bank-sortcode-3']) {
        req.session.data['teacher-error-payment-details-sort3'] = true;
        req.session.data['error-message-account-sortcode'] = "Enter your account sort code";
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
      req.session.data['error-message'] = "Select how you want to be contacted";
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

      req.session.data['admin-error-no-location-period'] = true;
      if (!req.session.data['admin-start-day'] || !req.session.data['admin-start-month'] || !req.session.data['admin-start-year']) {
        // Error: Meant to update location with start date
        req.session.data['admin-error-no-location-start-date'] = true;
        req.session.data['error-message'] = "Enter the start date";
      } else {
        req.session.data['admin-error-no-location-start-date'] = false;
      }
      if (!req.session.data['admin-end-day'] || !req.session.data['admin-end-month'] || !req.session.data['admin-end-year']) {
        // Error: Meant to update location with start date
        req.session.data['admin-error-no-location-end-date'] = true;
        req.session.data['error-message-b'] = "Enter the end date";
      } else {
        req.session.data['admin-error-no-location-end-date'] = false;
      }
      res.redirect('admin-confirm-location-eligibility');
      next

    } else if (req.session.data['update-teaching'] == "update" && !req.session.data['admin-eligibility-teaching']) {

      // Error: Meant to update teaching
      req.session.data['admin-error-no-teaching'] = true;
      req.session.data['error-message'] = "Select one of the options";
      res.redirect('admin-confirm-teaching-eligibility');
      next

    } else if (req.session.data['update-teaching'] == "update" && req.session.data['admin-eligibility-teaching'] == "yes" && !req.session.data['teaching-proportion']) {

      // Error: Meant to update teaching with proportion
      req.session.data['admin-error-no-teaching-proportion'] = true;
      req.session.data['error-message'] = "Select how much they taught those subjects";
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
      req.session.data['error-message'] = "Enter the loan amount";
      res.redirect('admin-confirm-repayment-amount');
      next

    } else if (req.session.data['update-location'] == "cancel" || req.session.data['update-teaching'] == "cancel" || req.session.data['update-phase'] == "cancel" || req.session.data['update-loan'] == "cancel") {

      // Skipped/cancelled updating, so reset...
      req.session.data['admin-eligibility-location'] = "0";
      req.session.data['admin-eligibility-teaching'] = "0";
      req.session.data['admin-loan-amount'] = "0";
      // ..and then reset all the error variables
      req.session.data['admin-error-no-location'] = false;
      req.session.data['admin-error-no-location-period'] = false;
      req.session.data['admin-error-no-location-start-date'] = false;
      req.session.data['admin-error-no-location-end-date'] = false;
      req.session.data['admin-error-no-teaching'] = false;
      req.session.data['admin-error-no-teaching-proportion'] = false;
      req.session.data['admin-error-no-loan'] = false;

      res.redirect('admin-claim');
      next

    } else {

      // Everything looks good so sync the latest data to the relevant JSON
      var claim_id = req.session.data['claim-id'];
      var array_ref = req.session.data['admin-claims-data']['claims'].findIndex(function(claim) {
        return claim.id == claim_id
      })
      req.session.data['array-ref'] = array_ref;

      if (req.session.data['update-location'] == "update") {
        req.session.data['admin-claims-data']['claims'][array_ref]['eligibility-location'] = req.session.data['admin-eligibility-location'];
        if (req.session.data['admin-eligibility-location'] == "yes-part") {
          var eligiblity_period = {};
          eligiblity_period.start_day = req.session.data['admin-start-day'];
          eligiblity_period.start_month = req.session.data['admin-start-month'];
          eligiblity_period.start_year = req.session.data['admin-start-year'];
          eligiblity_period.end_day = req.session.data['admin-end-day'];
          eligiblity_period.end_month = req.session.data['admin-end-month'];
          eligiblity_period.end_year = req.session.data['admin-end-year'];
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility-location-period'] = eligiblity_period;
          req.session.data['admin-start-day'] = "0";
          req.session.data['admin-start-month'] = "0";
          req.session.data['admin-start-year'] = "0";
          req.session.data['admin-end-day'] = "0";
          req.session.data['admin-end-month'] = "0";
          req.session.data['admin-end-year'] = "0";
        }
        req.session.data['admin-eligibility-location'] = "0";
        req.session.data['update-location'] = "null";
      }

      if (req.session.data['update-teaching'] == "update") {
        req.session.data['admin-claims-data']['claims'][array_ref]['eligibility-teaching'] = req.session.data['admin-eligibility-teaching'];
        if (req.session.data['admin-eligibility-teaching'] == "no") {
          req.session.data['admin-claims-data']['claims'][array_ref]['eligibility-teaching-subject-other'] = req.session.data['teaching-subject-other'];
        }
        req.session.data['admin-eligibility-teaching'] = "0";
        req.session.data['update-teaching'] = "null";
      }

      if (req.session.data['update-phase'] == "update") {
        req.session.data['admin-claims-data']['claims'][array_ref]['eligibility-phase'] = req.session.data['admin-eligibility-phase'];
        req.session.data['admin-eligibility-phase'] = "0";
        req.session.data['update-phase'] = "null";
      }

      if (req.session.data['update-loan'] == "update") {
        req.session.data['admin-claims-data']['claims'][array_ref]['loan-amount'] = req.session.data['admin-loan-amount'];
        req.session.data['admin-loan-amount'] = "0";
        req.session.data['update-loan'] = "null";
      }

      // ..and then reset all the error variables
      req.session.data['admin-error-no-location'] = false;
      req.session.data['admin-error-no-location-period'] = false;
      req.session.data['admin-error-no-location-start-date'] = false;
      req.session.data['admin-error-no-location-end-date'] = false;
      req.session.data['admin-error-no-teaching'] = false;
      req.session.data['admin-error-no-teaching-proportion'] = false;
      req.session.data['admin-error-no-phase'] = false;
      req.session.data['admin-error-no-loan'] = false;

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

  // Set the claim to processed
  var claim_id = req.session.data['claim-id'];
  var array_ref = req.session.data['array-ref'];

  req.session.data['admin-claims-data']['claims'][array_ref]['status'] = "closed";

  // Updated muber of claims
  var num_claims = req.session.data['admin-claims-data']['num_claims'];
  num_claims.open--;
  num_claims.closed++;
  req.session.data['admin-claims-data']['num_claims'] = num_claims;

  res.redirect('admin-confirmation');
  next

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

    req.session.data['check-error-no-qts'] = false;
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
    req.session.data['check-error-no-school'] = false;
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
    req.session.data['check-error-no-school'] = false;
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
    req.session.data['check-error-no-school'] = false;
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
    req.session.data['check-error-no-loan'] = false;
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
      req.session.data['check-error-no-teaching-other'] = false;
    }
    if (!req.session.data['check-teaching-time']) {
      req.session.data['check-error-no-teaching-time'] = true;
      req.session.data['error-message-time'] = "Select one of the options";
    } else {
      req.session.data['check-error-no-teaching-time'] = false;
    }
    req.session.data['check-error-no-teaching'] = false;
    res.redirect('check-teaching');
    next
  } else if (req.session.data['check-teaching'] == "other" && req.session.data['check-teaching-time'] == "other") {
    req.session.data['check-eligible'] = false;
    req.session.data['check-ineligible-reason'] = "teaching-other";
    res.redirect('check-ineligible');
  } else {
    req.session.data['check-error-no-teaching'] = false;
    req.session.data['check-error-no-teaching-other'] = false;
    req.session.data['check-error-no-teaching-time'] = false;
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
    req.session.data['check-error-no-still-teaching'] = false;
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
    req.session.data['check-error-no-teaching-phase'] = false;
    res.redirect('check-eligible');
  }

})

module.exports = router
