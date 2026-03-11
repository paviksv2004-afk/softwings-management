// controllers/clientController.js
const Client = require("../models/client");
const asyncHandler = require("express-async-handler");

// ===== Add Client =====
const addClient = asyncHandler(async (req, res) => {
  const { companyName, contactPerson, mobile, email, address, services } = req.body;

  // Only companyName and email are required
  if (!companyName || !email) {
    res.status(400);
    throw new Error("Company Name and Email are required");
  }

  if (!services || typeof services !== "object") {
    res.status(400);
    throw new Error("Services data is required");
  }

  let totalAmount = 0;
  const processedServices = {};

  // Process each service type
  for (const type in services) {
    if (!Array.isArray(services[type])) continue;

    processedServices[type] = services[type].map((service) => {
      if (!service.name || !service.startDate || !service.duration) {
        throw new Error("Each service must have name, startDate and duration");
      }

      const startDate = new Date(service.startDate);
      if (isNaN(startDate)) throw new Error("Invalid startDate format");

      const expiryDate = new Date(startDate);
      expiryDate.setMonth(expiryDate.getMonth() + Number(service.duration));

      const amount = Number(service.amount || 0);
      totalAmount += amount;

      return {
        name: service.name,
        startDate,
        duration: Number(service.duration),
        expiryDate,
        amount,
      };
    });
  }

  const client = await Client.create({
    companyName,
    contactPerson: contactPerson || "",
    mobile: mobile || "",
    email,
    address: address || "",
    services: processedServices,
    totalAmount,
  });

  res.status(201).json({
    success: true,
    message: "Client created successfully",
    data: client,
  });
});

// ===== Get All Clients =====
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ isDeleted: false }).sort({ createdAt: -1 });
  res.status(200).json(clients);
});

// ===== Get Single Client =====
const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client || client.isDeleted) {
    res.status(404);
    throw new Error("Client not found");
  }
  res.status(200).json(client);
});

// ===== Update Client =====
const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  const { companyName, contactPerson, mobile, email, address, services } = req.body;

  if (companyName) client.companyName = companyName;
  if (contactPerson !== undefined) client.contactPerson = contactPerson;
  if (mobile !== undefined) client.mobile = mobile;
  if (email) client.email = email;
  if (address !== undefined) client.address = address;

  if (services) {
    let totalAmount = 0;
    const processedServices = {};

    for (const type in services) {
      if (!Array.isArray(services[type])) continue;

      processedServices[type] = services[type].map((service) => {
        const startDate = new Date(service.startDate);
        const expiryDate = new Date(startDate);
        expiryDate.setMonth(expiryDate.getMonth() + Number(service.duration));

        const amount = Number(service.amount || 0);
        totalAmount += amount;

        return {
          name: service.name,
          startDate,
          duration: Number(service.duration),
          expiryDate,
          amount,
        };
      });
    }

    client.services = processedServices;
    client.totalAmount = totalAmount;
  }

  const updatedClient = await client.save();
  res.status(200).json(updatedClient);
});

// ===== Soft Delete Client =====
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  client.isDeleted = true;
  await client.save();
  res.status(200).json({ message: "Client deactivated successfully" });
});

// ===== Check Email Exists =====
const checkEmailExists = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const client = await Client.findOne({ email });
  res.status(200).json({ exists: !!client });
});

module.exports = {
  addClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  checkEmailExists,
};