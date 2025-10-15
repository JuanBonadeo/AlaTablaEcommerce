import Navbar from "@web/components/ui/Navbar";
import Footer from "@web/components/ui/Footer";

export default function HomeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto pb-25 p-2 md:p-4">
        {children}
      </div>
      <Footer />
    </div>
  );
}