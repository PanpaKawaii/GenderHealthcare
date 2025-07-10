const express = require("express");
const ctrl = require("../controllers/testservice.controller");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");
router.use(authenticate, authorize("Doctor"));

router.post("/", ctrl.create);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
