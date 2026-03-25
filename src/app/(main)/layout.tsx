import AuthGuard from "@/components/AuthGuard";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthGuard>
        <Navbar />
        {children}
        <Footer />
      </AuthGuard>
    </>
  );
}
