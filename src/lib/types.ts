export type Equipment = {
  id: string;
  name: string;
  type: 'Excavator' | 'Bulldozer' | 'Crane' | 'Loader' | 'Generator';
  status: 'Operational' | 'Idle' | 'Maintenance';
  location: string;
  operatorId: string | null;
  utilization: number;
  fuelLevel: number;
  engineHours: number;
  lastService: string;
};

export type Operator = {
  id: string;
  name: string;
  assignedEquipmentId: string | null;
  certification: string;
  status: 'Active' | 'Inactive';
  hoursWorked: number;
};

export type Anomaly = {
  id: string;
  equipmentId: string;
  type:
    | 'Out of location'
    | 'Misuse'
    | 'Over-threshold usage'
    | 'Maintenance due';
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High';
};

export type Contract = {
  id: string;
  equipmentId: string;
  operatorId: string;
  startDate: string;
  endDate:string;
  status: 'Active' | 'Completed' | 'Overdue';
  amount: number;
};
