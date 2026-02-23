import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be at most 100 characters"],
    },
    roll: {
      type: Number,
      required: [true, "Roll number is required"],
      unique: true,
      min: [1, "Roll number must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "Roll number must be an integer",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model("Student", studentSchema);

