import Header from "@/components/Header";
import Footer from "@/components/Footer";

/*
  Layout du groupe (site) : en-tête + pied de page, sur toutes les pages du
  site sauf /login (qui reste hors de ce groupe, sans en-tête ni footer).
*/
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
