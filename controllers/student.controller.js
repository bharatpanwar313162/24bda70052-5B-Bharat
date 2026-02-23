import { Student } from "../models/student.model.js";

// GET /students - list with pagination and sorting
export const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find()
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      Student.countDocuments(),
    ]);

    res.json({
      data: students,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// POST /students - create new student
export const createStudent = async (req, res) => {
  try {
    const { name, roll } = req.body;
    const student = await Student.create({ name, roll });
    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Roll number must be unique" });
    }
    res.status(400).json({ message: error.message || "Failed to create student" });
  }
};

// GET /students/:id - get by id
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid student ID" });
  }
};

// PUT /students/:id - update
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roll } = req.body;

    const student = await Student.findByIdAndUpdate(
      id,
      { name, roll },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Roll number must be unique" });
    }
    res.status(400).json({ message: error.message || "Failed to update student" });
  }
};

// DELETE /students/:id - delete
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid student ID" });
  }
};

