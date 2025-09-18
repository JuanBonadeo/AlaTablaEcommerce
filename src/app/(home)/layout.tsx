import Navbar from "src/components/ui/Navbar";
import Footer from "src/components/ui/Footer";

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