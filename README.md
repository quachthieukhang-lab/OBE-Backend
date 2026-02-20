<p align="center">   <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a> </p>
# OBE-Backend

## 📌 Description
OBE-Backend is a NestJS-based backend system designed to support Outcome-Based Education (OBE) management.  
The system handles mapping between PLO, CLO, CO, assessments, and student scores, providing structured data management and scalable API architecture.

Built with:
- NestJS
- TypeScript
- PostgreSQL
- RESTful API architecture

---

## 🚀 Project Setup

Install dependencies:

npm install

---

## ▶️ Run the Project

Development mode:
npm run start:dev

Production mode:
npm run start:prod

Build project:
npm run build

---

## 🧪 Testing

Run unit tests:
npm run test

Run e2e tests:
npm run test:e2e

Generate coverage report:
npm run test:cov

---

## 🗄️ Database Setup (PostgreSQL)

Make sure PostgreSQL is running locally.

Example connection string:
postgresql://postgres:password@localhost:5432/obe_db

You can configure environment variables inside:
.env

---

## 📂 Project Structure

src/
 ├── modules/
 ├── common/
 ├── config/
 ├── database/
 └── main.ts

---

## 🌐 Deployment

To deploy in production:

1. Build the project:
   npm run build

2. Run compiled version:
   node dist/main.js

Make sure environment variables are properly configured in production.

---

## 📖 Useful Resources

- NestJS Documentation: https://docs.nestjs.com
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- TypeScript Documentation: https://www.typescriptlang.org/docs/

---

## 📜 License

This project is licensed under the MIT License.

---

© 2026 OBE Backend Project