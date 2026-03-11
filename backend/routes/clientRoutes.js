const express = require('express');
const router = express.Router();
const Client = require('../models/client');

// GET all clients
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching all clients...');
    const clients = await Client.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${clients.length} clients`);
    res.json(clients);
  } catch (error) {
    console.error('❌ Error fetching clients:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET single client by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('🔍 Fetching client with ID:', req.params.id);
    
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      console.log('❌ Client not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Client not found' });
    }
    
    console.log('✅ Client found:', client.companyName);
    res.json(client);
  } catch (error) {
    console.error('❌ Error fetching client:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST create new client
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating new client:', req.body.companyName);
    
    const client = new client(req.body);
    const newClient = await client.save();
    
    console.log('✅ Client created with ID:', newClient._id);
    res.status(201).json(newClient);
  } catch (error) {
    console.error('❌ Error creating client:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT update client
router.put('/:id', async (req, res) => {
  try {
    console.log('✏️ Updating client with ID:', req.params.id);
    
    const client = await client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!client) {
      console.log('❌ Client not found for update with ID:', req.params.id);
      return res.status(404).json({ message: 'Client not found' });
    }
    
    console.log('✅ client updated:', client.companyName);
    res.json(client);
  } catch (error) {
    console.error('❌ Error updating client:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE client
router.delete('/:id', async (req, res) => {
  try {
    console.log('🗑️ Deleting client with ID:', req.params.id);
    
    const client = await Client.findByIdAndDelete(req.params.id);
    
    if (!client) {
      console.log('❌ client not found for deletion with ID:', req.params.id);
      return res.status(404).json({ message: 'client not found' });
    }
    
    console.log('✅ client deleted:', client.companyName);
    res.json({ message: 'client deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting client:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;