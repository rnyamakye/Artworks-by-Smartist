import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "react-hot-toast";
import Container from "./Container";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <Container className="pt-24 md:pt-32">{children}</Container>
      <Footer />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        toastOptions={{
          style: {
            backgroundColor: "black",
            color: "white"
          }
        }}
      />
    </div>
  );
};

export default Layout;
