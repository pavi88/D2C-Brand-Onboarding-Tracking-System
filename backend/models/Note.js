const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    note: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);