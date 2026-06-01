import Navbar from "./Navbar.jsx";

function HomeMainLayout({ children }) {
  return (

      <div className="flex flex-col bg-[#414141] text-white text-center">
        <Navbar />

        <div className="">
          {children}
        </div>
      </div>

  );
}

export default HomeMainLayout;