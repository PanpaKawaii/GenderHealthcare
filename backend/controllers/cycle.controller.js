const Cycle = require("../models/cycle.model");
const Reminder = require("../models/reminder.model");

exports.create = async (req, res) => {
  try {
    const { periodDays, notes, customerId } = req.body;

    if (!Array.isArray(periodDays) || periodDays.length === 0) {
      return res.status(400).json({
        error: "periodDays is required and must be a non-empty array.",
      });
    }

    // Ngày kết thúc kỳ kinh = ngày cuối trong periodDays
    const lastPeriodDay = new Date(periodDays[periodDays.length - 1]);

    // Ngày rụng trứng = 14 ngày sau ngày đầu tiên có kinh
    const ovulationDate = new Date(periodDays[0]);
    ovulationDate.setDate(ovulationDate.getDate() + 14);

    // fertileWindow = 12 ngày bắt đầu sau ngày hết kinh (ngày cuối kỳ kinh +1)
    const fertileWindow = [];
    const fertileStart = new Date(lastPeriodDay);
    fertileStart.setDate(fertileStart.getDate() + 1);

    for (let i = 0; i < 12; i++) {
      const date = new Date(fertileStart);
      date.setDate(date.getDate() + i);
      fertileWindow.push(date);
    }

    const cycle = new Cycle({
      periodDays,
      notes,
      fertileWindow,
      ovulationDate,
      isPredicted: false,
      customerId,
    });

    const savedCycle = await cycle.save();
    // 🟠 Tạo reminder uống thuốc tránh thai
    await Reminder.create({
      customerId,
      type: "Pill",
      date: new Date(periodDays[0]),
      message: "Hôm nay bắt đầu uống thuốc tránh thai!",
    });

    // 🟢 Tạo reminder ngày rụng trứng
    await Reminder.create({
      customerId,
      type: "Ovulation",
      date: ovulationDate,
      message: "Hôm nay là ngày rụng trứng, khả năng thụ thai cao nhất!",
    });
    res.status(201).json(savedCycle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getByCustomer = async (req, res) => {
  try {
    const cycles = await Cycle.find({ customerId: req.params.customerId }).sort(
      {
        createdAt: -1,
      }
    );
    res.json(cycles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  const cycle = await Cycle.findById(req.params.id);
  if (!cycle) return res.sendStatus(404);
  res.json(cycle);
};

exports.update = async (req, res) => {
  try {
    const { periodDays, notes, isPredicted } = req.body;

    let updateData = { notes, isPredicted };

    if (periodDays && Array.isArray(periodDays) && periodDays.length > 0) {
      const lastPeriodDay = new Date(periodDays[periodDays.length - 1]);

      const ovulationDate = new Date(periodDays[0]);
      ovulationDate.setDate(ovulationDate.getDate() + 14);

      const fertileWindow = [];
      const fertileStart = new Date(lastPeriodDay);
      fertileStart.setDate(fertileStart.getDate() + 1);

      for (let i = 0; i < 12; i++) {
        const d = new Date(fertileStart);
        d.setDate(d.getDate() + i);
        fertileWindow.push(d);
      }

      updateData = {
        ...updateData,
        periodDays,
        ovulationDate,
        fertileWindow,
      };
    }

    const updated = await Cycle.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  const result = await Cycle.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!result });
};
