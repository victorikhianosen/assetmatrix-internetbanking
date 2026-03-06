export function ReceiptSkeleton() {
  return (
    <section className="flex justify-center">
      <div className="md:w-[60vw] w-full animate-pulse bg-card lg:px-10 px-3 rounded-xl py-5 overflow-hidden">
        <div className="flex justify-center items-center flex-col w-full">
          <div className="p-4 rounded-full">
            <div className="p-2 h-24 w-24 rounded-full bg-muted" />
          </div>
          <div className="h-8 w-40 mt-4 mb-2 rounded bg-muted" />
          <div className="h-8 w-32 mb-5 rounded bg-muted" />
          <div className="border-t border-b border-border w-full py-5 space-y-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-full flex justify-between items-center pt-2">
                <div className="h-5 w-1/2 rounded bg-muted" />
                <div className="h-5 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
          <div className="w-full flex justify-between items-center pt-2">
            <div className="h-12 w-full rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </section>
  );
}
