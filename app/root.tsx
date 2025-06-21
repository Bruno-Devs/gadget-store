import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import MainLayout from "./components/layouts/main";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <MainLayout>
        {children}
        </MainLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en">
        <head>
          <title>{error.status} {error.statusText}</title>
          <Meta />
          <Links />
        </head>
        <body>
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {error.status} {error.statusText}
              </h1>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {error.data?.message || "Something went wrong"}
              </p>
            </div>
          </div>
          <Scripts />
        </body>
      </html>
    );
  }

  const errorMessage = error instanceof Error ? error.message : "Unknown error";

  return (
    <html lang="en">
      <head>
        <title>Unexpected Error</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Unexpected Error
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {errorMessage}
            </p>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
