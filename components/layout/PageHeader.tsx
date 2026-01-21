export default function PageHeader({ title }: { title: string }) {
    return (
      <main className="flex w-full flex-col justify-between items-start">
        <h1 className="text-2xl uppercase font-semibold text-slate-900 tracking-wider md:text-3xl">
          {title}
        </h1>
      </main>
    );
  }
  
