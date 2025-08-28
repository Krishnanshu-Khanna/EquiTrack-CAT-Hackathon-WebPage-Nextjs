"use client"; // Required for hooks like useState and useEffect in Next.js App Router

import { useState, useEffect } from 'react';
import { PlusCircle, File, MoreHorizontal, MapPin } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { count } from 'console';

// A simple component to show while data is loading
function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
}

export default function OperatorsPage() {
  // State to store operators, loading status, and any errors
  const [operators, setOperators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/operators');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched operators:', data);
        setOperators(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []); // Empty dependency array means this effect runs once on mount

  // Helper to get initials from a name
  const getNameInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('');
  };
 // NEW: Handler function to navigate to the tracker page
 const handleTrackClick = (operator) => {
  console.log('Tracking operator:', operator);
  // Check if the tracker position data exists before navigating
  
    // Navigate to the /tracker page and pass the coordinates as URL query parameters
    router.push(`operators/tracker?name=${encodeURIComponent(operator._id)}`);
  
};

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
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <p>Failed to load data: {error}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Certification</TableHead>
                <TableHead className="hidden md:table-cell">Assigned Equipment</TableHead>
                <TableHead className="hidden md:table-cell text-right">Hours Worked</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((operator) => (
                <TableRow key={operator._id}>
                  <TableCell className="hidden sm:table-cell">
                    <Avatar className="h-10 w-10">
                      {/* Using a placeholder image service */}
                      <AvatarImage src={`https://i.pravatar.cc/40?u=${operator._id}`} alt={operator.name} />
                      <AvatarFallback>{getNameInitials(operator.name)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{operator.name}</TableCell>
                  <TableCell>
                    <Badge variant={operator.status === 'Active' ? 'secondary' : 'outline'}>
                      {operator.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{operator.certification}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {/* Accessing the populated equipment name is now simple */}
                    {operator.assignedEquipment?.name || 'Unassigned'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right">
                    {operator.hoursWorked} hrs
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Logs</DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleTrackClick(operator)}
                             // Button is disabled if no coordinates exist
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            <span>Track Operator</span>
                          </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{operators.length}</strong> of <strong>{operators.length}</strong> operators
        </div>
      </CardFooter>
    </Card>
  );
}
