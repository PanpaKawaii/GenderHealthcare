const express = require("express");
const ctrl = require("../controllers/reminder.controller");
const r = express.Router();

r.post("/", ctrl.create);
r.get("/by-customer/:customerId", ctrl.getByCustomer);
r.get("/by-id/:id", ctrl.getOne);
r.put("/by-id/:id", ctrl.update);
r.delete("/by-id/:id", ctrl.remove);

module.exports = r;
