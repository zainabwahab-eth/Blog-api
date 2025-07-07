# Blog API
A RESTful blogging API built with Node.js, Express, and MongoDB. It allows users to create, read, update, and delete blog posts with JWT-based authentication and role-based access control. Public users can read published blogs, while only authenticated users can manage their own blogs.

## Features
- User authentication (Sign up & Login) with JWT

- Blogs in draft or published state

- Public access to published blogs

Authenticated users can:

- Create blogs (defaults to draft)

- Publish, update, and delete their own blogs

- View their own blogs

Pagination, filtering, and search by:

- Title, author, tags

- Sorting by reading time, read count, or timestamp

- Auto-increment read count

- Reading time algorithm based on body length

- Tests using Jest and Supertest

- In-memory MongoDB for test environment

## Blog Schema
{
  title: String,
  description: String,
  body: String,
  tags: [String],
  author_id: ObjectId,
  state: "draft" | "published",
  read_count: Number,
  reading_time: String,
  createdAt: Date
}

## Running Tests
```npm run test```
Test environment uses an in-memory MongoDB instance.

## Tech Stack
- Node.js

- Express.js

- MongoDB with Mongoose

- JWT for auth

- Jest & Supertest for testing

## API Endpoints
- Auth
POST /users/signup

POST /users/login

- Blogs
GET /blogs — Public blogs (paginated, filterable)

GET /blogs/:id — View a blog (increments read count)

POST /blogs — Create new blog (auth required)

PATCH /blogs/:id — Edit blog (auth & ownership required)

DELETE /blogs/:id — Delete blog (auth & ownership required)

PATCH /blogs/:id/publish — Publish blog (auth & ownership)

GET /blogs/myblogs — View your blogs (auth required)

## Author
Built by Zainab Wahab as part of the AltSchool Node.js backend project.