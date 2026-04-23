const Brand = require("../models/Brand");
const Note = require("../models/Note");

const flow = {
  SUBMITTED: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["SHORTLISTED"],
  SHORTLISTED: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: []
};

// CREATE BRAND
exports.createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL BRANDS
exports.getBrands = async (req, res) => {
  const { status, category } = req.query;

  let filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const brands = await Brand.find(filter);
  res.json(brands);
};

// GET SINGLE BRAND + NOTES
exports.getSingleBrand = async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  const notes = await Note.find({ brand_id: req.params.id });

  if (!brand) return res.status(404).json({ error: "Not found" });

  res.json({ brand, notes });
};

// UPDATE STATUS (IMPORTANT)
exports.updateStatus = async (req, res) => {
  const { status } = req.body;

  const brand = await Brand.findById(req.params.id);
  if (!brand) return res.status(404).json({ error: "Not found" });

  const allowed = flow[brand.status];

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status transition" });
  }

  brand.status = status;
  await brand.save();

  res.json(brand);
};

// ADD NOTE
exports.addNote = async (req, res) => {
  const { note } = req.body;

  if (!note) {
    return res.status(400).json({ error: "Note cannot be empty" });
  }

  const newNote = await Note.create({
    brand_id: req.params.id,
    note
  });

  res.json(newNote);
};

// DASHBOARD SUMMARY
exports.getSummary = async (req, res) => {
  const total = await Brand.countDocuments();

  const submitted = await Brand.countDocuments({ status: "SUBMITTED" });
  const under_review = await Brand.countDocuments({ status: "UNDER_REVIEW" });
  const shortlisted = await Brand.countDocuments({ status: "SHORTLISTED" });
  const accepted = await Brand.countDocuments({ status: "ACCEPTED" });
  const rejected = await Brand.countDocuments({ status: "REJECTED" });

  res.json({
    total,
    submitted,
    under_review,
    shortlisted,
    accepted,
    rejected
  });
};