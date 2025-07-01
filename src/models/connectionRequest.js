const mongoose=require("mongoose")

const connectionSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DevUser",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DevUser",
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "rejected", "ignored", "interested"],
        message: `{VALUE} is not a valid request`,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Connect=mongoose.model("connections",connectionSchema);

module.exports={Connect}