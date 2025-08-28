import { MoreHorizontal, PlusCircle, File } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getContracts, getEquipment, getOperators } from '@/lib/data';

export default function ContractsPage() {
  const contracts = getContracts();
  const equipment = getEquipment();
  const operators = getOperators();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div>
            <CardTitle>Contracts</CardTitle>
            <CardDescription>
              View and manage equipment rental contracts.
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export Invoices
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                New Contract
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract ID</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead className="hidden md:table-cell">Start Date</TableHead>
              <TableHead className="hidden md:table-cell">End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => {
              const equipmentName =
                equipment.find((e) => e.id === contract.equipmentId)?.name || 'N/A';
              const operatorName =
                operators.find((o) => o.id === contract.operatorId)?.name || 'N/A';
              
              const statusVariant: "default" | "secondary" | "outline" | "destructive" = 
                contract.status === 'Active' ? 'secondary' 
                : contract.status === 'Overdue' ? 'destructive' 
                : 'outline';

              return (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.id}</TableCell>
                  <TableCell>{equipmentName}</TableCell>
                  <TableCell>{operatorName}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(contract.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(contract.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant}>{contract.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${contract.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{contracts.length}</strong> of <strong>{contracts.length}</strong> contracts
        </div>
      </CardFooter>
    </Card>
  );
}
