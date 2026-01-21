export default function PageShell({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="w-full bg-white p-5 sm:p-6">
        <div className="flex flex-1 flex-col gap-6 font-sans pt-2">
          {children}
        </div>
      </section>
    );
  }
  
