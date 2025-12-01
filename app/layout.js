// import { Inter } from 'next/font/google';
// import './globals.css';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'Elite Pay - Digital Payment System',
//   description: 'Modern crypto payment platform',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-slate-950 text-white`}>{children}</body>
//     </html>
//   );
// }

import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Elite Pay - Digital Payment System',
  description: 'Modern crypto payment platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-white`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
