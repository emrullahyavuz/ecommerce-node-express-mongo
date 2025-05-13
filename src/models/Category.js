const mongoose = require("mongoose");
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

// Generate slug before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
      locale: 'tr'
    });
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
