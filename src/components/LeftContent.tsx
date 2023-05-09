function LeftContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col gap-5 overflow-y-scroll scrollbar-hide md:w-3/4">
      {children}
    </div>
  );
}
export default LeftContent;
