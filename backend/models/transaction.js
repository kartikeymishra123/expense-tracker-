let { Schema, model } = require("mongoose");

let transactionSchema = new Schema(
  {
    tittle: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "spend"], // ✅ restrict to two possible values
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user", // ✅ must match model name used in user.js
      required: true, // ✅ ensures every transaction belongs to a user
    },
  },
  { timestamps: true }
);

let transaction = model("Transaction", transactionSchema);

module.exports = transaction;
