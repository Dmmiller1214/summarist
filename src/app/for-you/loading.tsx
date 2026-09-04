import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";

function BookCardSkeleton() {
  return (
    <div className="w-[180px] shrink-0">
      <div className="h-[270px] animate-pulse rounded bg-[#e1e7ea]" />
      <div className="mt-3 h-5 animate-pulse rounded bg-[#e1e7ea]" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-[#e1e7ea]" />
      <div className="mt-3 h-4 animate-pulse rounded bg-[#e1e7ea]" />
    </div>
  );
}

export default function ForYouLoading() {
  return (
    <>
      <Sidebar />

      <div className="md:ml-60">
        <SearchBar />

        <main className="min-h-[calc(100vh-80px)] bg-white px-6 py-12">
          <div className="mx-auto w-full max-w-[1070px]">
            <div className="h-9 w-32 animate-pulse rounded bg-[#e1e7ea]" />

            <section className="mt-10">
              <div className="mb-4 h-4 w-44 animate-pulse rounded bg-[#e1e7ea]" />

              <div className="flex flex-col gap-6 rounded-lg bg-[#f1f6f4] p-6 sm:flex-row sm:items-center">
                <div className="h-[210px] w-[140px] shrink-0 animate-pulse rounded bg-[#d2dcda]" />

                <div className="w-full">
                  <div className="h-7 w-1/2 animate-pulse rounded bg-[#d2dcda]" />
                  <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-[#d2dcda]" />
                  <div className="mt-5 h-4 w-full animate-pulse rounded bg-[#d2dcda]" />
                  <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-[#d2dcda]" />
                </div>
              </div>
            </section>

            {[1, 2].map((section) => (
              <section key={section} className="mt-12">
                <div className="h-7 w-56 animate-pulse rounded bg-[#e1e7ea]" />
                <div className="mt-3 h-4 w-64 animate-pulse rounded bg-[#e1e7ea]" />

                <div className="mt-6 flex gap-5 overflow-hidden">
                  {[1, 2, 3, 4].map((card) => (
                    <BookCardSkeleton key={card} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}