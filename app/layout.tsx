import type { Metadata } from "next";
import "../src/index.css";
import { ApolloClientProvider } from "@/lib/apollo/provider";

export const metadata: Metadata = {
  title: "Muse You - 문화예술을 함께 즐기는 특별한 플랫폼",
  description: "서울시 문화예술 공연 정보를 제공하고, 함께 관람할 파트너를 매칭하며, 단체 관람 프로그램을 제공하는 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ApolloClientProvider>{children}</ApolloClientProvider>
      </body>
    </html>
  );
}

