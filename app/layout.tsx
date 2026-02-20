import "../styles/globals.css";

export const metadata = {
  title: "Simulador de Cobrança (CPE) • Protege",
  description: "Simulador CPE - Protege",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
