import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";

export default function BookLoading() {
  return (
    <>
      <Sidebar />

      <div className="md:ml-60">
        <SearchBar />

        <main className="min-h-[calc(100vh-80px)] bg-white px-6 py-12">
          <div className="mx-auto w-full max-w-[1070px]">
            <section className="flex flex-col gap-10 lg:flex-row">
              <div className="flex-1">
                <div className="h-7 w-24 animate-pulse rounded-full bg-[#e1e7ea]" />

                <div className="mt-5 h-10 w-2/3 animate-pulse rounded bg-[#e1e7ea]" />

                <div className="mt-4 h-6 w-4/5 animate-pulse rounded bg-[#e1e7ea]" />

                <div className="mt-4 h-5 w-1/3 animate-pulse rounded bg-[#e1e7ea]" />

                <div className="mt-6 border-y border-[#e1e7ea] py-5">
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-5 animate-pulse rounded bg-[#e1e7ea]"
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <div className="h-11 w-28 animate-pulse rounded bg-[#d2dcda]" />
                  <div className="h-11 w-28 animate-pulse rounded bg-[#d2dcda]" />
                </div>
              </div>

              <div className="flex justify-center lg:w-[300px]">
                <div className="h-[375px] w-[250px] animate-pulse rounded bg-[#e1e7ea]" />
              </div>
            </section>

            <section className="mt-12 max-w-3xl">
              <div className="h-8 w-48 animate-pulse rounded bg-[#e1e7ea]" />

              <div className="mt-5 space-y-3">
                {[1, 2, 3, 4].map((line) => (
                  <div
                    key={line}
                    className="h-4 animate-pulse rounded bg-[#e1e7ea]"
                  />
                ))}
              </div>
            </section>

            <section className="mt-12 max-w-3xl">
              <div className="h-8 w-44 animate-pulse rounded bg-[#e1e7ea]" />

              <div className="mt-5 space-y-3">
                {[1, 2, 3].map((line) => (
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