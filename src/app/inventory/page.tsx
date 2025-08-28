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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { getEquipment } from '@/lib/data';

export default function InventoryPage() {
  const equipment = getEquipment();

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="idle">Idle</TabsTrigger>
          <TabsTrigger value="maintenance" className="hidden sm:flex">
            Maintenance
          </TabsTrigger>
        </TabsList>
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
              Add Equipment
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Equipment Inventory</CardTitle>
            <CardDescription>
              Manage your fleet and view their status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    Image
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Engine Hours
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="hidden sm:table-cell">
                      <img
                        alt="Equipment image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        width="64"
                        src={`https://picsum.photos/seed/${item.id}/64/64`}
                        data-ai-hint={`${item.type}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Operational' ? 'secondary' : item.status === 'Idle' ? 'outline' : 'destructive'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.location}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.engineHours.toLocaleString()} hrs
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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-{equipment.length}</strong> of <strong>{equipment.length}</strong> equipment
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
