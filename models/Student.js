const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  company: String,
  role: String,
  package: String,
  year: String,
  interviewRounds: String,
  experience: String,
  preparationTips: String,
  resources: String,
  addedBy: String
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
