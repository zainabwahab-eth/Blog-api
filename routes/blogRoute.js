const express = require("express");
const blogController = require("./../controller/blogController");
const authController = require("./../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(authController.protect, blogController.createBlog);

router.route("/myblogs").get(authController.protect, blogController.getMyBlogs);

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.checkAuthor,
    blogController.editMyBlog
  )
  .get(blogController.getABlogAndUpdateCount)
  .delete(
    authController.protect,
    authController.checkAuthor,
    blogController.deleteBlog
  );

router
  .route("/:id/publish")
  .patch(
    authController.protect,
    authController.checkAuthor,
    blogController.publishBlog
  );

module.exports = router;
