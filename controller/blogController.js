const Blog = require("./../models/blogModel");
const BlogSearch = require("./../utils/BlogSearch");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  // console.log(req.query);
  const search = new BlogSearch(Blog.find({ state: "published" }), req.query)
    .filter()
    .sort()
    .paginate();

  //Execute Query
  const blogs = await search.query;

  res.status(200).json({
    status: "success",
    result: blogs.length,
    data: {
      blogs,
    },
  });
});

exports.getMyBlogs = catchAsync(async (req, res, next) => {
  const search = new BlogSearch(Blog.find({ author: req.user._id }), req.query)
    .filter()
    .sort()
    .paginate();

  //Execute Query
  const myBlogs = await search.query;

  res.status(200).json({
    status: "success",
    result: myBlogs.length,
    data: {
      myBlogs,
    },
  });
});

exports.getABlogAndUpdateCount = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog || blog.state !== "published") {
    return next(new AppError("Blog not found", 404));
  }

  blog.read_count++;
  await blog.save();
  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.createBlog = catchAsync(async (req, res) => {
  // console.log(req.user);
  const newBlog = await Blog.create({ ...req.body, author: req.user._id });
  res.status(201).json({
    status: "success",
    data: {
      blog: newBlog,
    },
  });
});

exports.editMyBlog = catchAsync(async (req, res, next) => {
  Object.assign(req.blog, req.body);
  await req.blog.save();

  res.status(200).json({
    status: "success",
    data: {
      blog: req.blog,
    },
  });
});

exports.publishBlog = catchAsync(async (req, res, next) => {
  if (req.blog.state === "published") {
    return next(new AppError("Blog is already published", 400));
  }
  Object.assign(req.blog, { state: "published" });
  await req.blog.save();

  res.status(200).json({
    status: "success",
    data: {
      blog: req.blog,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  await req.blog.deleteOne();
  res.status(204).json({
    status: "success",
    data: null,
  });
});
