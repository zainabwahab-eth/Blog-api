const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Blog must have a title"],
    },
    description: {
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      trim: true,
      required: [true, "Blog must have a title"],
    },
    tags: [String],
    state: {
      type: String,
      enum: {
        values: ["draft", "published"],
      },
      default: "draft",
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: Number,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

blogSchema.pre("save", function (next) {
  const words = this.body.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  this.reading_time = minutes;
  next();
});

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name email",
  });
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
