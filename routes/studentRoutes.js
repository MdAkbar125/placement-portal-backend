const express = require("express");
const router = express.Router();
const Student = require("../models/Student");


// ➕ ADD Student
router.post("/add", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json({ message: "Student Added ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📄 GET ALL Students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔍 SEARCH & FILTER
router.get("/search", async (req, res) => {
  try {
    const { keyword, company, role, year, minPackage, maxPackage } = req.query;

    let query = {};

    // Keyword search (name OR company)
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } }
      ];
    }

    if (company) query.company = company;
    if (role) query.role = role;
    if (year) query.year = year;

    // Package range (numeric extract)
    if (minPackage || maxPackage) {
      query.package = { $exists: true };
    }

    const students = await Student.find(query);

    res.json(students);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✏️ UPDATE Student
router.put("/update/:id", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Student Updated ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ❌ DELETE Student
router.delete("/delete/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student Deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📄 PAGINATION
router.get("/pagination", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const students = await Student.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Student.countDocuments();

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: students
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📊 COMPANY ANALYTICS
router.get("/analytics/company", async (req, res) => {
  try {
    const data = await Student.aggregate([
      {
        $group: {
          _id: "$company",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;