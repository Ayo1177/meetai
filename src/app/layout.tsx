import React from 'react'
import "./globals.css";
interface Props {
    children: React.ReactNode
};


export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

