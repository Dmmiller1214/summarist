import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";

export default function PlayerLoading() {
  return (
    <>
      <Sidebar />

      <div className="md:ml-60">
        <SearchBar />

        <main className="min-h-[calc(100vh-80px)] bg-white px-6 py-12">
          <div className="mx-auto w-full max-w-[900px]">
            <header className="flex flex-col items-center gap-6 border-b border-[#e1e7ea] pb-8 sm:flex-row">
              <div className="h-[180px] w-[120px] shrink-0 animate-pulse rounded bg-[#e1e7ea]" />

              <div className="w-full space-y-4">
                <div className="h-4 w-28 animate-pulse rounded bg-[#e1e7ea]" />
                <div className="h-9 w-2/3 animate-pulse rounded bg-[#e1e7ea]" />
                <div className="h-5 w-1/3 animate-pulse rounded bg-[#e1e7ea]" />
              </div>
            </header>

            <section className="mt-8">
              <div className="h-8 w-24 animate-pulse rounded bg-[#e1e7ea]" />
              <div className="mt-4 h-36 animate-pulse rounded-xl bg-[#d2dcda]" />
            </section>

            <section className="mt-10">
              <div className="h-8 w-32 animate-pulse rounded bg-[#e1e7ea]" />
              <div className="mt-5 space-y-3">
                {[1, 2, 3, 4, 5].map((line) => (
                  <div
                    key={line}
                    className="h-4 animate-pulse rounded bg-[#e1e7ea]"
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
