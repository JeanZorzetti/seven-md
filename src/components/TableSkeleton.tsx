export default function TableSkeleton({ cols = 5, rows = 6 }: { cols?: number; rows?: number }) {
  return (
    <div className="w-full animate-pulse">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-gray-50 px-6 py-4 flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className={`h-3.5 bg-gray-100 rounded flex-1 ${j === 0 ? 'max-w-[180px]' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  )
}
