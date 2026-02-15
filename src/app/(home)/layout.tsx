import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { generateOrganizationSchema } from "@/lib/utils/structured-data";

export default function HomeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Navbar />
      <div className="max-w-6xl mx-auto pb-25 md:p-4 p-1.5">
        {children}
      </div>
      <Footer />
    </div>
  );
}