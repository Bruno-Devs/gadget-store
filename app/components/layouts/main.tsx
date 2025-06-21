import React from "react";
import { Link } from "@remix-run/react";
import Nav from "../nav";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div className="flex flex-col min-h-screen bg-gray-50">
		<Nav />
		{/* Main Content */}
		<main className="flex-1 w-full md:container md:mx-auto px-4 py-6 md:py-8">
			{children}
		</main>

		{/* Footer */}
		<footer className="bg-white border-t mt-8">
			<div className="w-full md:container md:mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6 px-4 md:px-6 text-sm text-gray-500">
				<div className="text-center md:text-left">&copy; {new Date().getFullYear()} Gadget Store. All rights reserved.</div>
				<div className="flex flex-col gap-2 md:flex-row md:gap-4 items-center justify-center">
					<Link to="/about">About</Link>
					<Link to="/contact">Contact</Link>
					<Link to="/privacy">Privacy Policy</Link>
				</div>
				<div className="flex gap-4 justify-center md:justify-end">
					<a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.94 3.62-.72-.02-1.39-.22-1.98-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.11 2.94 3.97 2.97A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 24 4.59a8.48 8.48 0 0 1-2.54.7z" /></svg></a>
					<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.68 0H1.32A1.32 1.32 0 0 0 0 1.32v21.36A1.32 1.32 0 0 0 1.32 24h11.5v-9.29H9.69v-3.62h3.13V8.41c0-3.1 1.89-4.79 4.65-4.79 1.32 0 2.45.1 2.78.14v3.22h-1.91c-1.5 0-1.79.71-1.79 1.75v2.3h3.58l-.47 3.62h-3.11V24h6.09A1.32 1.32 0 0 0 24 22.68V1.32A1.32 1.32 0 0 0 22.68 0" /></svg></a>
				</div>
			</div>
		</footer>
	</div>
);

export default MainLayout;
