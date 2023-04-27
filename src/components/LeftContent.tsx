function LeftContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col gap-5 overflow-y-scroll scrollbar-hide  md:w-2/3">
      {children}
    </div>
  );
}
export default LeftContent;
