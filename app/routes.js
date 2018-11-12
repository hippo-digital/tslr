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

// Hmmm... that's gonna need a tricksy regex to catch both b/some-url/ and b/181031/some-url/
/*router.post(b/about-you-trn/, function (req, res) {

  // From eligibility-teaching
  let eligible = req.session.data['teaching']
  if (eligible === 'no') {
    res.redirect('ineligible')
  } else {
    res.redirect('about-you-trn')
  }

})*/

router.post(/teacher-enter-location-confirm/, function (req, res) {

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

  var school_name = req.session.data['teacher-school-name'];
  schools.push(school_name);
  num_schools++;

  req.session.data['teacher-schools'] = schools;
  req.session.data['teacher-num-schools'] = num_schools;
  req.session.data['teacher-schools-setup'] = false;

  // Need to branch differently depending whether answer was yes, yes more or no
  if (option == 'school-confirm-y' || option == 'school-confirm-n') {
    res.redirect('teacher-consent');
  } else {
    res.redirect('teacher-enter-location-confirm');
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

// Service Model C only
// --------------------

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

router.get(/admin-confirm-location-eligibility_(name)_([a-z-]+)/, function (req, res) {

  // From admin-applications
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

module.exports = router
