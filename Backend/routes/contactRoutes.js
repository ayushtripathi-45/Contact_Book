const express = require('express');
const router = express.Router();
const {
  getAllContacts,
  searchContacts,
  addContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');

router.get('/', getAllContacts);
router.get('/search', searchContacts);
router.post('/', addContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
