import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/70 print:bg-white print:min-h-0">
      <Sidebar />
      <main className="lg:ml-[260px] min-h-screen print:ml-0 print:min-h-0">
        <div className="p-4 pt-16 lg:p-8 lg:pt-8 print:p-0 print:m-0">
          {children}
        </div>
      </main>
    </div>
  );
}
