import { Equipment, Operator, Anomaly, Contract } from "@/lib/types";

const equipment: Equipment[] = [
	{
		id: "EQP-001",
		name: "CAT 336",
		type: "Excavator",
		status: "Operational",
		location: "Site A",
		operatorId: "OP-001",
		utilization: 85,
		fuelLevel: 75,
		engineHours: 1245,
		lastService: "2024-05-10",
	},
	{
		id: "EQP-002",
		name: "CAT D6",
		type: "Bulldozer",
		status: "Idle",
		location: "Site B",
		operatorId: null,
		utilization: 0,
		fuelLevel: 90,
		engineHours: 3450,
		lastService: "2024-03-22",
	},
	{
		id: "EQP-003",
		name: "CAT 3200",
		type: "Crane",
		status: "Operational",
		location: "Main Yard",
		operatorId: "OP-004",
		utilization: 65,
		fuelLevel: 55,
		engineHours: 5120,
		lastService: "2024-07-01",
	},
	{
		id: "EQP-004",
		name: "CAT 950",
		type: "Loader",
		status: "Maintenance",
		location: "Workshop",
		operatorId: "OP-002",
		utilization: 92,
		fuelLevel: 60,
		engineHours: 850,
		lastService: "2024-06-15",
	},
	{
		id: "EQP-005",
		name: "CAT XQ125",
		type: "Generator",
		status: "Operational",
		location: "Site C",
		operatorId: "OP-003",
		utilization: 10,
		fuelLevel: 100,
		engineHours: 2500,
		lastService: "2024-04-30",
	},
];

const operators: Operator[] = [
	{
		id: "OP-001",
		name: "Krishnanshu",
		assignedEquipmentId: "EQP-001",
		certification: "CAT336",
		status: "Active",
		hoursWorked: 128,
	},
	{
		id: "OP-002",
		name: "Shubham",
		assignedEquipmentId: "EQP-004",
		certification: "Loader Certified",
		status: "Inactive",
		hoursWorked: 6,
	},
	{
		id: "OP-003",
		name: "Jay Gandhi",
		assignedEquipmentId: null,
		certification: "Excavator Certified",
		status: "Active",
		hoursWorked: 12,
	},
	{
		id: "OP-004",
		name: "Nayan",
		assignedEquipmentId: "EQP-003",
		certification: "Crane Certified",
		status: "Active",
		hoursWorked: 76,
	},
	{
		id: "OP-005",
		name: "Abhay",
		assignedEquipmentId: null,
		certification: "All-Rounder",
		status: "Active",
		hoursWorked: 0,
	},
];

const anomalies: Anomaly[] = [
	{
		id: "ANM-001",
		equipmentId: "EQP-002",
		type: "Maintenance due",
		timestamp: "2024-07-20T10:00:00Z",
		severity: "Medium",
	},
	{
		id: "ANM-002",
		equipmentId: "EQP-004",
		type: "Over-threshold usage",
		timestamp: "2024-07-19T14:30:00Z",
		severity: "High",
	},
	{
		id: "ANM-003",
		equipmentId: "EQP-001",
		type: "Out of location",
		timestamp: "2024-07-18T08:15:00Z",
		severity: "High",
	},
	{
		id: "ANM-004",
		equipmentId: "EQP-005",
		type: "Misuse",
		timestamp: "2024-07-17T11:00:00Z",
		severity: "Low",
	},
	{
		id: "ANM-005",
		equipmentId: "EQP-003",
		type: "Maintenance due",
		timestamp: "2024-07-16T09:00:00Z",
		severity: "Medium",
	},
];

const contracts: Contract[] = [
	{
		id: "CTR-001",
		equipmentId: "EQP-001",
		operatorId: "OP-001",
		startDate: "2024-07-01",
		endDate: "2024-07-31",
		status: "Active",
		amount: 12000,
	},
	{
		id: "CTR-002",
		equipmentId: "EQP-002",
		operatorId: "OP-003",
		startDate: "2024-07-01",
		endDate: "2024-08-31",
		status: "Active",
		amount: 8000,
	},
	{
		id: "CTR-003",
		equipmentId: "EQP-005",
		operatorId: "OP-005",
		startDate: "2024-07-01",
		endDate: "2024-08-31",
		status: "Active",
		amount: 8000,
	},
];

export const getEquipment = () => equipment;
export const getOperators = () => operators;
export const getAnomalies = () => anomalies;
export const getContracts = () => contracts;
