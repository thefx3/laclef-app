export default function PageHeader({ title }: { title: string }) {
    return (
      <main className="flex w-full flex-col justify-between items-start">
        <h1 className="text-2xl uppercase font-semibold text-slate-800 tracking-widest md:text-2xl">
          {title}
        </h1>
      </main>
    );
  }
  
