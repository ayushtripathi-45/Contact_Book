const Contact = require('../models/contactModel');

// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.getAll();
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
};

// Search contacts
exports.searchContacts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const contacts = await Contact.search(query);

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching contacts',
      error: error.message
    });
  }
};

// Add new contact
exports.addContact = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required'
      });
    }

    const contact = await Contact.create({ name, phone, email });

    res.status(201).json({
      success: true,
      message: 'Contact added successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding contact',
      error: error.message
    });
  }
};

// Update contact
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email } = req.body;

    const contact = await Contact.update(id, { name, phone, email });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contact',
      error: error.message
    });
  }
};

// Delete contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Contact.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
};