import {
	Activity,
	AlertTriangle,
	ArrowUpRight,
	Truck,
	Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getEquipment, getAnomalies, getOperators } from "@/lib/data";

export default function Dashboard() {
	const equipment = getEquipment();
	const anomalies = getAnomalies();
	const operators = getOperators();

	const totalEquipment = equipment.length;
	const activeEquipment = equipment.filter(
		(e) => e.status === "Operational"
	).length;
	const totalAnomalies = anomalies.length;
	const totalOperators = operators.length;

	return (
		<div className='flex flex-1 flex-col gap-4 md:gap-8'>
			<div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Equipment</CardTitle>
						<Truck className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold font-headline'>{totalEquipment}</div>
						<p className='text-xs text-muted-foreground'>
							{activeEquipment} currently operational
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Operators</CardTitle>
						<Users className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold font-headline'>{totalOperators}</div>
						<p className='text-xs text-muted-foreground'>
							{operators.filter((o) => o.status === "Active").length} active
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Utilization</CardTitle>
						<Activity className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold font-headline'>63.5%</div>
						<p className='text-xs text-muted-foreground'>+5.2% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Anomaly Alerts</CardTitle>
						<AlertTriangle className='h-4 w-4 text-destructive' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold font-headline'>{totalAnomalies}</div>
						<p className='text-xs text-muted-foreground'>
							{anomalies.filter((a) => a.severity === "High").length} high severity
							alerts
						</p>
					</CardContent>
				</Card>
			</div>
			<div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
				<Card className='xl:col-span-2'>
					<CardHeader className='flex flex-row items-center'>
						<div className='grid gap-2'>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>
								Overview of most recently used equipment.
							</CardDescription>
						</div>
						<Button asChild size='sm' className='ml-auto gap-1'>
							<Link href='/inventory'>
								View All
								<ArrowUpRight className='h-4 w-4' />
							</Link>
						</Button>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Equipment</TableHead>
									<TableHead>Type</TableHead>
									<TableHead className='hidden sm:table-cell'>Status</TableHead>
									<TableHead className='hidden md:table-cell'>Location</TableHead>
									<TableHead className='text-right'>Engine Hours</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{equipment.slice(0, 5).map((item) => (
									<TableRow key={item.id}>
										<TableCell>
											<div className='font-medium'>{item.name}</div>
											<div className='hidden text-sm text-muted-foreground md:inline'>
												ID: {item.id}
											</div>
										</TableCell>
										<TableCell>{item.type}</TableCell>
										<TableCell className='hidden sm:table-cell'>
											<Badge
												variant={
													item.status === "Operational"
														? "secondary"
														: item.status === "Idle"
														? "outline"
														: "destructive"
												}>
												{item.status}
											</Badge>
										</TableCell>
										<TableCell className='hidden md:table-cell'>
											{item.location}
										</TableCell>
										<TableCell className='text-right'>{item.engineHours} hrs</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Anomaly Alerts</CardTitle>
						<CardDescription>
							Recent system alerts that may require attention.
						</CardDescription>
					</CardHeader>
					<CardContent className='grid gap-6'>
						{anomalies.slice(0, 4).map((anomaly) => (
							<div key={anomaly.id} className='flex items-center gap-4'>
								<div className='bg-destructive/10 p-2 rounded-full'>
									<AlertTriangle className='h-5 w-5 text-destructive' />
								</div>
								<div className='grid gap-1'>
									<p className='text-sm font-medium leading-none'>
										{anomaly.type} on{" "}
										{equipment.find((e) => e.id === anomaly.equipmentId)?.name}
									</p>
									<p className='text-sm text-muted-foreground'>
										{new Date(anomaly.timestamp).toLocaleString()}
									</p>
								</div>
								<Badge variant='destructive' className='ml-auto sm:hidden'>
									{anomaly.severity}
								</Badge>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
