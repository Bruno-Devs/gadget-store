# Gadget Store – Fullstack App Setup Guide

## Prerequisites

- **Node.js** (v20+ recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** (or your preferred database)
- **Git** (optional, for version control)

---

## 1. Clone the Repository

```sh
git clone <your-repo-url>
cd gadget-store
```

---

## 2. Install Dependencies

```sh
npm install
```

---

## 3. Environment Variables

Create a `.env` file in the project root with your database connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Example for local Postgres:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/gadget_store"
```

---

## 4. Prisma Setup

### a. **Prisma Schema Location**

The Prisma schema is located at:  
```
prisma/schema.prisma
```

### b. **Generate Prisma Client**

```sh
npm run db:generate
```

### c. **Push Schema to Database**

This will create tables in your database according to the schema:

```sh
npm run db:push
```

### d. **(Optional) Run Migrations**

If you want to use migrations:

```sh
npm run db:migrate
```

### e. **(Optional) Open Prisma Studio**

To visually inspect your database:

```sh
npm run db:studio
```

---

## 5. Seed the Database (Optional)

If you have a seed script:

```sh
npm run db:seed
```

---

## 6. Start the Application

This will run both the frontend (Remix) and backend (Express API):

```sh
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173) (or next available port)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **API Health**: [http://localhost:3001/health](http://localhost:3001/health)
- **API Docs**: [http://localhost:3001/api](http://localhost:3001/api)

---

## 7. Useful Scripts

| Script                | Description                                 |
|-----------------------|---------------------------------------------|
| `npm run dev`         | Start both frontend and backend (dev mode)  |
| `npm run dev:frontend`| Start only the Remix frontend               |
| `npm run dev:backend` | Start only the Express backend              |
| `npm run build`       | Build the frontend for production           |
| `npm run lint`        | Run ESLint                                  |
| `npm run typecheck`   | Run TypeScript type checking                |
| `npm run db:generate` | Generate Prisma client                      |
| `npm run db:push`     | Push schema to database                     |
| `npm run db:migrate`  | Run database migrations                     |
| `npm run db:studio`   | Open Prisma Studio                          |
| `npm run db:reset`    | Reset the database                          |
| `npm run db:seed`     | Seed the database                           |

---

## 8. Troubleshooting

### **Port Already in Use**

If you see `EADDRINUSE: address already in use :::3001`:

1. Find the process using the port:
   ```sh
   netstat -ano | findstr :3001
   ```
2. Kill the process (replace 8036 with your PID):
   ```sh
   taskkill /PID 8036 /F
   ```

### **Prisma Client Not Generated**

If you see `@prisma/client did not initialize yet`:

- Run:
  ```sh
  npm run db:generate
  ```

### **Database Connection Issues**

- Check your `.env` file for the correct `DATABASE_URL`.
- Make sure your database server is running.

---

## 9. Project Structure

```
gadget-store/
├── prisma/                 # Prisma schema
│   └── schema.prisma
├── app/
│   ├── api/                # Express backend
│   │   └── index.ts
│   ├── database/           # Prisma client and DB utilities
│   │   └── index.ts
│   ├── routes/             # Remix routes (frontend)
│   ├── server/             # Server-side queries (shared)
│   └── shared/             # Shared utilities
├── package.json
├── .env
└── ...
```

---

## 10. Customization

- **Add new API routes**: `app/api/routes/`
- **Add new frontend pages**: `app/routes/`
- **Add new database queries**: `app/server/queries/`

---

## 11. Deployment

- Build the frontend:
  ```sh
  npm run build
  ```
- Start the server:
  ```sh
  npm start
  ```
- Set environment variables on your production server.

---

## 12. Additional Resources

- [Remix Docs](https://remix.run/docs)
- [Express Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**You're all set!**  
If you follow these steps, you'll have a working fullstack app every time. 