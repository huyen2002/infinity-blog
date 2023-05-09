export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen max-w-full bg-white">
      <div className="mx-5 h-screen max-w-full bg-white md:mx-16 xl:mx-32">
        {children}
      </div>
    </div>
  );
}
