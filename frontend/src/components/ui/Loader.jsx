import { motion } from "framer-motion";
import MainLayout from "../layout/MainLayout";

function Loader() {
  return (
    <MainLayout>
    <div className="flex justify-center items-center h-screen">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full"
      />
    </div>
    </MainLayout>
  );
}

export default Loader;