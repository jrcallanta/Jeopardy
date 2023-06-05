import { TITLE } from "./my-game-data";
import "./styles/globals.css";
import { Poppins } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: "800" });

export const metadata = {
    title: TITLE,
    description: "Just a friendly game of Jeopardy.",
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className={poppins.className}>{children}</body>
        </html>
    );
}
