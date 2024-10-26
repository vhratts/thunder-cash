// app/layout.tsx

// globals.css includes @tailwind directives
// adjust the path if necessary
import "../styles/globals.css";
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return <Providers>{children}</Providers>;
}
