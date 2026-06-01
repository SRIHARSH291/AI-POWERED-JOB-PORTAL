function ErrorBox({ message }) {
  return (
    <div className="bg-red-500/20 border border-red-500 p-4 rounded-xl text-center">
      <p className="text-red-400 font-semibold">
        ⚠ {message || "Something went wrong"}
      </p>
    </div>
  );
}

export default ErrorBox;