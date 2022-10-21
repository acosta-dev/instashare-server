const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: { type: String, default: null },
  lastname: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String, default: null },
  token: { type: String },
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
  ],
},
{
  timestamps: true,
  versionKey: false,
}
);

//Encrypt user password before save
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 8);
  console.log("Save", this.name);
});

module.exports = model("User", userSchema);