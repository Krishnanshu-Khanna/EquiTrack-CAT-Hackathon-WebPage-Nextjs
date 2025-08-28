import { PlusCircle, File, MoreHorizontal } from 'lucide-react';
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
import { getOperators, getEquipment } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function OperatorsPage() {
  const operators = getOperators();
  const equipment = getEquipment();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div>
            <CardTitle>Operators</CardTitle>
            <CardDescription>
              Manage your team of certified operators.
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Operator
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Avatar</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">
                Certification
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Assigned Equipment
              </TableHead>
               <TableHead className="hidden md:table-cell text-right">
                Hours Worked
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operators.map((operator) => {
              const assignedEquipment = operator.assignedEquipmentId
                ? equipment.find((e) => e.id === operator.assignedEquipmentId)
                : null;
              const nameInitials = operator.name.split(' ').map(n => n[0]).join('');

              return (
                <TableRow key={operator.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://i.pravatar.cc/40?u=${operator.id}`} alt={operator.name} />
                      <AvatarFallback>{nameInitials}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{operator.name}</TableCell>
                  <TableCell>
                    <Badge variant={operator.status === 'Active' ? 'secondary' : 'outline'}>
                      {operator.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {operator.certification}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {assignedEquipment?.name || 'Unassigned'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right">
                    {operator.hoursWorked} hrs
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Logs</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Deactivate
                        </DropdownMenuItem>
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
          Showing <strong>1-{operators.length}</strong> of <strong>{operators.length}</strong> operators
        </div>
      </CardFooter>
    </Card>
  );
}
