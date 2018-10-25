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
/*
router.get(/(username|id)\/(.+)/, function (req, res, next) {
//router.get(/^\/(discussion|page)\/(.+)/, function (req, res, next) {
  res.write(req.params[0]); //This has "discussion" or "page"
  res.write(req.params[1]); //This has the slug
  res.end();
});
*/

// The below needs extending to be more dynamic and to use session storage + redirect method
// as it will be less brittle and work for archived versions

router.get(/admin-confirm-eligibility\/(name)\/([a-z-]+)/, function (req, res) {

  // From admin-applications
  var my_var = req.params[1];
  my_global_var = 'Thing';
  res.render('b/admin-confirm-eligibility', {'teacher_name': req.params[1]});

})

module.exports = router
