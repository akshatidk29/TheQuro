import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    tokens: {
      type: Number,
      default: 0,
    },
    tokenHistory: [
      {
        type: {
          type: String,
        },
        amount: Number,
        reason: String,
        date: {
          type: Date,
          default: Date.now,
        },
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;