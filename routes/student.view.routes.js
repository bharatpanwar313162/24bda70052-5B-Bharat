import express from "express";
import { Student } from "../models/student.model.js";

const router = express.Router();

// Show list + create form
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.render("students/index", { students });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load students");
  }
});

// Handle create from form
router.post("/students", async (req, res) => {
  try {
    const { name, roll } = req.body;
    await Student.create({ name, roll });
    res.redirect("/view/students");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message || "Failed to create student");
  }
});

// Show edit form
router.get("/students/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.render("students/edit", { student });
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid student ID");
  }
});

// Handle update from form
router.post("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roll } = req.body;
    const student = await Student.findByIdAndUpdate(
      id,
      { name, roll },
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.redirect("/view/students");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message || "Failed to update student");
  }
});

// Handle delete
router.post("/students/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.redirect("/view/students");
  } catch (error) {
    console.error(error);
    res.status(400).send("Failed to delete student");
  }
});

export default router;

