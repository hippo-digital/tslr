const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
// Branching
router.post('/eligibility-qts', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  let qts = req.session.data['qts']

  if (qts === 'no') {
    res.redirect('/ineligible')
  } else {
    res.redirect('/eligibility-schools')
  }
})

router.post('/eligibility-schools', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  let school = req.session.data['school']

  if (school === 'no') {
    res.redirect('/ineligible')
  } else {
    res.redirect('/eligibility-authority')
  }
})

module.exports = router
