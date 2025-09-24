'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Operator } from '@/lib/types';
import { 
  User, 
  Clock, 
  Fuel, 
  Gauge, 
  Building, 
  Cloud, 
  Wrench, 
  MapPin, 
  DollarSign, 
  Timer,
  TrendingUp,
  Activity
} from 'lucide-react';

interface DashboardData {
  operator: {
    _id: string;
    name: string;
    status: string;
  };
  ActiveEngineHours: number;
  IdleTime: number;
  FuelUsage: number;
  LoadUsage: number;
  TypeOfProject: string;
  WeatherSeason: string;
  MachineType: string;
  SiteDemographic: string;
  ContractValue: string;
  PromisedTime: number;
  ClientEfficiency: number;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
    status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    {status}
  </span>
);

// Metric card component
const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  unit = '', 
  color = 'blue',
  subtitle = ''
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  unit?: string;
  color?: string;
  subtitle?: string;
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
          <span className="text-lg text-gray-500 ml-1">{unit}</span>
        </p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

// Efficiency progress bar
const EfficiencyBar = ({ efficiency }: { efficiency: number }) => {
  const percentage = Math.round(efficiency * 100);
  const getColor = (eff: number) => {
    if (eff >= 0.9) return 'bg-green-500';
    if (eff >= 0.7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Client Efficiency</h3>
        <TrendingUp className="h-5 w-5 text-gray-500" />
      </div>
      <div className="relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            percentage >= 90 ? 'bg-green-100 text-green-800' :
            percentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {percentage >= 90 ? 'Excellent' : percentage >= 70 ? 'Good' : 'Needs Improvement'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getColor(efficiency)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default function PredictionTimePage(): JSX.Element {
  const [operator, setOperator] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const operatorName = useSearchParams().get('name');

  useEffect(() => {
    // For demo purposes, using the provided data
    // In production, this would fetch from your API
    // const mockData: DashboardData = {
    //   operator: {
    //     _id: "68b0af8c56972b99631239a8",
    //     name: "tester",
    //     status: "Active"
    //   },
    //   ActiveEngineHours: 310,
    //   IdleTime: 90,
    //   FuelUsage: 2100,
    //   LoadUsage: 400,
    //   TypeOfProject: "Housing Build",
    //   WeatherSeason: "Winter",
    //   MachineType: "Crane",
    //   SiteDemographic: "Suburban",
    //   ContractValue: "85,000",
    //   PromisedTime: 2,
    //   ClientEfficiency: 0.92
    // };

    // // Simulate API call delay
    // setTimeout(() => {
    //   setOperator(mockData);
    //   setLoading(false);
    // }, 1000);

    // Uncomment below for actual API integration
    
    if (!operatorName) {
      setLoading(false);
      return;
    }

    const fetchOperatorData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/operators");
        if (!response.ok) throw new Error("Failed to fetch operator data.");

        const allOperators = await response.json();
        const foundOperator = allOperators.find((op) => op.operator._id === operatorName);
        
        if (!foundOperator) throw new Error(`Operator with ID "${operatorName}" not found.`);
        setOperator(foundOperator);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOperatorData();
    
  }, [operatorName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!operator) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">No operator data available</p>
      </div>
    );
  }

  const utilizationRate = operator.ActiveEngineHours / (operator.ActiveEngineHours + operator.IdleTime);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Operator Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                  {operator.operator.name} (ID: {operator.operator._id.slice(-8)})
                </p>
              </div>
            </div>
            <StatusBadge status={operator.operator.status} />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            icon={Activity}
            title="Active Engine Hours"
            value={operator.ActiveEngineHours}
            unit="hrs"
            color="green"
            subtitle="Current operational time"
          />
          <MetricCard
            icon={Clock}
            title="Idle Time"
            value={operator.IdleTime}
            unit="hrs"
            color="yellow"
            subtitle={`${Math.round(utilizationRate * 100)}% utilization`}
          />
          <MetricCard
            icon={Fuel}
            title="Fuel Usage"
            value={operator.FuelUsage}
            unit="L"
            color="red"
            subtitle="Total consumption"
          />
          <MetricCard
            icon={Gauge}
            title="Load Usage"
            value={operator.LoadUsage}
            unit="tons"
            color="purple"
            subtitle="Current load capacity"
          />
        </div>

        {/* Project & Contract Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              Project Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Project Type:</span>
                <span className="font-medium text-gray-900">{operator.TypeOfProject}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Machine Type:</span>
                <span className="font-medium text-gray-900 flex items-center">
                  <Wrench className="h-4 w-4 mr-1" />
                  {operator.MachineType}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {operator.SiteDemographic}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Season:</span>
                <span className="font-medium text-gray-900 flex items-center">
                  <Cloud className="h-4 w-4 mr-1" />
                  {operator.WeatherSeason}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Contract Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Contract Value:</span>
                <span className="font-bold text-2xl text-green-600">
                  ${Number(operator.ContractValue.replace(',', '')).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Promised Timeline:</span>
                <span className="font-medium text-gray-900 flex items-center">
                  <Timer className="h-4 w-4 mr-1" />
                  {operator.PromisedTime} Months
                </span>
              </div>
              <div className="pt-2">
                <div className="text-sm text-gray-600 mb-1">Progress Indicator</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: '60%' }} // You can calculate actual progress based on your data
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">60% Complete (estimated)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency Section */}
        <EfficiencyBar efficiency={operator.ClientEfficiency} />

        {/* Quick Stats Summary */}
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(utilizationRate * 100)}%</div>
              <div className="text-sm opacity-90">Machine Utilization</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{(operator.FuelUsage / operator.ActiveEngineHours).toFixed(1)}</div>
              <div className="text-sm opacity-90">L/hr Fuel Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(operator.ClientEfficiency * 100)}%</div>
              <div className="text-sm opacity-90">Client Efficiency</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
