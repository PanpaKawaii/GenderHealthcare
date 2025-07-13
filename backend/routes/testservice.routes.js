const express = require("express");
const ctrl = require("../controllers/testservice.controller");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");
router.use(authenticate);

router.post("/", authorize('Admin', 'Doctor'), ctrl.create);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.put("/:id", authorize('Admin', 'Doctor'), ctrl.update);
router.delete("/:id", authorize('Admin', 'Doctor'), ctrl.remove);

module.exports = router;
