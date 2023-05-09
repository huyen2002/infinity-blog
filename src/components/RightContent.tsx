function RightContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden w-1/4 flex-col gap-5 border-l pl-5 md:ml-10 md:flex lg:ml-16 lg:pl-12 ">
      {children}
    </div>
  );
}
export default RightContent;
