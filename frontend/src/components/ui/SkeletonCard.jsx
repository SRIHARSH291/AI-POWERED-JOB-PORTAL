import MainLayout from "../layout/MainLayout";

function SkeletonCard() {
  return (
    <MainLayout>
    <div className="bg-white/10 p-6 rounded-xl animate-pulse">
      <div className="h-4 bg-white/20 w-1/2 mb-3 rounded"></div>
      <div className="h-8 bg-white/20 w-1/3 rounded"></div>
    </div>
    </MainLayout>
  );
}

export default SkeletonCard;