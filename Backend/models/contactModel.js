const db = require('../db');

class Contact {
  // Get all contacts
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Search contacts
  static async search(query) {
    try {
      const searchQuery = `%${query}%`;
      const [rows] = await db.query(
        'SELECT * FROM contacts WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?',
        [searchQuery, searchQuery, searchQuery]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Add new contact
  static async create(contactData) {
    try {
      const { name, phone, email } = contactData;
      const [result] = await db.query(
        'INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, email || '']
      );
      
      const [newContact] = await db.query('SELECT * FROM contacts WHERE id = ?', [result.insertId]);
      return newContact[0];
    } catch (error) {
      throw error;
    }
  }

  // Get contact by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM contacts WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update contact
  static async update(id, contactData) {
    try {
      const { name, phone, email } = contactData;
      await db.query(
        'UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?',
        [name, phone, email || '', id]
      );
      
      const [updatedContact] = await db.query('SELECT * FROM contacts WHERE id = ?', [id]);
      return updatedContact[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete contact
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM contacts WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Contact;