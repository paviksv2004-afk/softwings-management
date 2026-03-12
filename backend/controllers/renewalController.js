const Client = require("../models/Client");  // 🔥 FIXED: uppercase C

exports.getRenewals = async (req, res) => {
  try {
    const clients = await Client.find();

    const today = new Date();

    let renewals = [];
    let expectedRevenue = 0;
    let urgentRenewals = 0;

    clients.forEach((client) => {
      if (!client.services) return;

      const serviceTypes = ["hosting", "domain", "ssl", "amc"];

      serviceTypes.forEach((type) => {
        const servicesArray = client.services[type];

        if (!servicesArray || servicesArray.length === 0) return;

        servicesArray.forEach((service) => {
          if (!service.expiryDate) return;

          const expiry = new Date(service.expiryDate);
          const daysRemaining = Math.ceil(
            (expiry - today) / (1000 * 60 * 60 * 24)
          );

          renewals.push({
            clientId: client._id,
            companyName: client.companyName,
            contactPerson: client.contactPerson,
            mobile: client.mobile,
            email: client.email,
            serviceType: type.toUpperCase(),
            serviceName: service.name,
            amount: service.amount,
            expiryDate: service.expiryDate,
            daysRemaining,
          });

          expectedRevenue += service.amount;

          if (daysRemaining <= 7 && daysRemaining >= 0) {
            urgentRenewals++;
          }
        });
      });
    });

    res.status(200).json({
      renewals,
      totalRenewals: renewals.length,
      expectedRevenue,
      urgentRenewals,
    });
  } catch (error) {
    console.error("Renewal Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};