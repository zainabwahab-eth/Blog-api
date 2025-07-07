const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const Blog = require("./../models/blogModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    message: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // const { email, password } = req.body;

  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new AppError("Please enter email and passowrd", 400));
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError("Password or email is incorrect", 401));
  }

  const token = signToken(user._id);

  res.status(201).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //Check if user has a token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in. Please login", 401));
  }

  //Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("User no longer exist", 401));
  }

  req.user = currentUser;
  next();
});

exports.checkAuthor = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new AppError("Cannot find blog", 401));
  }

  if (req.user._id.toString() !== blog.author._id.toString()) {
    return next(
      new AppError(
        "You cannot perform this action because you are not the owner of this blog",
        401
      )
    );
  }

  req.blog = blog;
  next();
});
