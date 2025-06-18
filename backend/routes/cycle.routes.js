const express = require("express");
const ctrl = require("../controllers/cycle.controller");
const r = express.Router();

// POST /api/cycles/
r.post("/", ctrl.create);

// GET /api/cycles/by-customer/:customerId
r.get("/by-customer/:customerId", ctrl.getByCustomer);

// GET /api/cycles/by-id/:id
r.get("/by-id/:id", ctrl.getOne);

// PUT /api/cycles/by-id/:id
r.put("/by-id/:id", ctrl.update);

// DELETE /api/cycles/by-id/:id
r.delete("/by-id/:id", ctrl.remove);

module.exports = r;
