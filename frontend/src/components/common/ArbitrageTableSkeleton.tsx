import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from '@/components/ui/table'

export function ArbitrageTableSkeleton() {
  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-primary/30 hover:bg-transparent">
            <TableHead>Cryptocurrency</TableHead>
            <TableHead>Buy From</TableHead>
            <TableHead>Sell To</TableHead>
            <TableHead className="text-right">Buy Price</TableHead>
            <TableHead className="text-right">Sell Price</TableHead>
            <TableHead className="text-right">Profit %</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i} className="border-b border-border/30">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16 bg-primary/20 animate-pulse" />
                    <Skeleton className="h-3 w-24 bg-primary/10 animate-pulse" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 bg-primary/20 animate-pulse rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 bg-primary/20 animate-pulse rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-20 ml-auto bg-primary/20 animate-pulse" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-20 ml-auto bg-primary/20 animate-pulse" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-16 ml-auto bg-primary/20 animate-pulse" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-24 ml-auto bg-primary/20 animate-pulse" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
