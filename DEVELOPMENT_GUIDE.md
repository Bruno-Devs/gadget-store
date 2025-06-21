# Development Guide: Building a Fullstack Remix + Express + Prisma App

This guide shows how to build the Gadget Store application from scratch, including all package installations, configurations, and how the different parts work together.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Initial Setup](#initial-setup)
3. [Frontend Setup (Remix)](#frontend-setup-remix)
4. [Backend Setup (Express)](#backend-setup-express)
5. [Database Setup (Prisma)](#database-setup-prisma)
6. [Development Scripts](#development-scripts)
7. [Project Structure](#project-structure)
8. [How Everything Works Together](#how-everything-works-together)

---

## Project Overview

This is a **fullstack e-commerce application** with:
- **Frontend**: Remix (React-based framework)
- **Backend**: Express.js API server
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

---

## Initial Setup

### 1. Create Project Directory

```bash
mkdir gadget-store
cd gadget-store
```

### 2. Initialize Package.json

```bash
npm init -y
```

### 3. Set Up TypeScript

```bash
npm install -D typescript @types/node
npx tsc --init
```

### 4. Configure TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "@remix-run/dev"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/*"]
    }
  },
  "include": ["remix.env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

## Frontend Setup (Remix)

### 1. Install Remix Dependencies

```bash
npm install @remix-run/node @remix-run/react @remix-run/serve
npm install -D @remix-run/dev
```

### 2. Install React Dependencies

```bash
npm install react react-dom
npm install -D @types/react @types/react-dom
```

### 3. Install Vite (Build Tool)

```bash
npm install -D vite vite-tsconfig-paths vite-env-only
```

### 4. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/vite
npx tailwindcss init -p
```

### 5. Configure Tailwind (tailwind.config.ts)

```typescript
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

### 6. Configure Vite (vite.config.ts)

```typescript
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
});
```

### 7. Create Remix Entry Points

**app/entry.client.tsx:**
```typescript
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
```

**app/entry.server.tsx:**
```typescript
import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
```

### 8. Create Root Component (app/root.tsx)

```typescript
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

---

## Backend Setup (Express)

### 1. Install Express Dependencies

```bash
npm install express cors helmet
npm install -D @types/express @types/cors
```

### 2. Install Development Tools

```bash
npm install -D tsx
```

### 3. Create Express Server (app/api/index.ts)

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Gadget Store API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      products: '/api/products',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
```

---

## Database Setup (Prisma)

### 1. Install Prisma

```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Initialize Prisma

```bash
npx prisma init
```

### 3. Create Database Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orders Order[]
  reviews Review[]

  @@map("users")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal
  stock       Int      @default(0)
  categoryId  String
  imageUrl    String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  category Category @relation(fields: [categoryId], references: [id])
  orderItems OrderItem[]
  reviews Review[]

  @@map("products")
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  description String?
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  products Product[]

  @@map("categories")
}

model Order {
  id        String      @id @default(cuid())
  userId    String
  status    OrderStatus @default(PENDING)
  total     Decimal
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  user       User        @relation(fields: [userId], references: [id])
  orderItems OrderItem[]

  @@map("orders")
}

model OrderItem {
  id        String @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal
  createdAt DateTime @default(now())

  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

model Review {
  id        String @id @default(cuid())
  userId    String
  productId String
  rating    Int
  comment   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@map("reviews")
}

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### 4. Create Database Client (app/database/index.ts)

```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export * from '@prisma/client';

// Database utility functions
export async function connect() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function disconnect() {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
    throw error;
  }
}

export async function healthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error', 
      timestamp: new Date().toISOString() 
    };
  }
}
```

### 5. Update Express Server with Database

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connect, disconnect, healthCheck } from '@/database';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await healthCheck();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbHealth,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await disconnect();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    await connect();
    
    app.listen(PORT, () => {
      console.log(`🚀 API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

---

## Development Scripts

### 1. Install Concurrently

```bash
npm install -D concurrently
```

### 2. Configure Package.json Scripts

```json
{
  "scripts": {
    "build": "remix vite:build",
    "dev": "concurrently --prefix-colors \"blue,green\" --prefix \"[{name}]\" --names \"frontend,backend\" \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "remix vite:dev",
    "dev:backend": "tsx --watch app/api/index.ts",
    "start": "remix-serve ./build/server/index.js",
    "typecheck": "tsc",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset"
  }
}
```

---

## Project Structure

```
gadget-store/
├── prisma/
│   └── schema.prisma          # Database schema
├── app/
│   ├── api/
│   │   └── index.ts           # Express server
│   ├── database/
│   │   └── index.ts           # Prisma client & utilities
│   ├── routes/
│   │   ├── _index.tsx         # Homepage
│   │   ├── products.tsx       # Products page
│   │   └── categories.tsx     # Categories page
│   ├── server/
│   │   ├── index.ts           # Server exports
│   │   └── queries/           # Database query functions
│   │       ├── products.ts
│   │       ├── categories.ts
│   │       ├── users.ts
│   │       └── reviews.ts
│   ├── shared/
│   │   └── index.ts           # Shared utilities
│   ├── root.tsx               # Root component
│   ├── entry.client.tsx       # Client entry
│   └── entry.server.tsx       # Server entry
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── .env
└── README.md
```

---

## How Everything Works Together

### 1. **Development Workflow**

When you run `npm run dev`:

1. **Concurrently** starts both frontend and backend simultaneously
2. **Frontend (Remix)** runs on port 5173 with hot reload
3. **Backend (Express)** runs on port 3001 with file watching
4. **Database** connects via Prisma client

### 2. **Data Flow**

```
Frontend (Remix) ←→ Backend (Express) ←→ Database (PostgreSQL)
     ↓                    ↓                    ↓
  React Components   API Routes         Prisma ORM
  Tailwind CSS      Express Middleware  SQL Queries
  Client-side JS    Error Handling      Data Models
```

### 3. **Request Flow Example**

**User visits `/products`:**

1. **Remix Route** (`app/routes/products.tsx`) loads
2. **Loader Function** calls `getAllProducts()` from server queries
3. **Server Query** (`app/server/queries/products.ts`) uses Prisma
4. **Prisma Client** executes SQL query against PostgreSQL
5. **Data** flows back: Database → Prisma → Server Query → Remix Loader → React Component
6. **UI** renders with product data

### 4. **API Endpoints**

- `GET /health` - Health check with database status
- `GET /api` - API documentation
- `GET /api/products` - Product data (via Express routes)

### 5. **Frontend Routes**

- `/` - Homepage with navigation
- `/products` - Product listing with database data
- `/categories` - Category listing with product counts

### 6. **Key Technologies & Their Roles**

| Technology | Purpose | Location |
|------------|---------|----------|
| **Remix** | Frontend framework | `app/routes/`, `app/root.tsx` |
| **Express** | Backend API server | `app/api/` |
| **Prisma** | Database ORM | `prisma/`, `app/database/` |
| **Tailwind** | CSS framework | `tailwind.config.ts` |
| **TypeScript** | Type safety | Throughout project |
| **Vite** | Build tool | `vite.config.ts` |

### 7. **Environment Variables**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gadget_store"
```

### 8. **Development Commands**

```bash
npm run dev          # Start both frontend and backend
npm run dev:frontend # Start only Remix frontend
npm run dev:backend  # Start only Express backend
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run build        # Build for production
```

---

## Next Steps

1. **Add Authentication** - Implement user login/signup
2. **Add Shopping Cart** - Session-based cart functionality
3. **Add Payment Processing** - Integrate Stripe or PayPal
4. **Add Admin Panel** - Product/category management
5. **Add Search** - Product search functionality
6. **Add Reviews** - User review system
7. **Add Images** - File upload for product images

---

This architecture provides a solid foundation for a scalable fullstack application with clear separation of concerns, type safety, and modern development practices. 