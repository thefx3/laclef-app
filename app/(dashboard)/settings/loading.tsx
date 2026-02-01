export default function Loading() {
  return (
    <div className="px-6 py-6">
      <div className="space-y-6 animate-pulse">
        <div className="h-7 w-48 rounded-lg bg-slate-200" />
        <div className="space-y-3">
          <div className="h-10 rounded-xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-slate-100" />
        </div>
        <div className="h-56 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}
