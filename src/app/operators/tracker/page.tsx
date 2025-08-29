"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { use } from "react";

// Sample data structure matching your Operator type
interface Operator {
  _id: string;
  name: string;
  safeZone?: {
    coordinates: Array<Array<{ x: number; y: number }>> | Array<{ x: number; y: number }> ;
  };
}

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

interface SimulationStatus {
  zone: 'safe' | 'warning' | 'danger' | 'outside';
  message: string;
  point: { x: number; y: number };
}

export default function PolygonVisualizer() {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
var lolz = true
  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number } | null>(null);
  const [currentStatus, setCurrentStatus] = useState<SimulationStatus | null>(null);
  const [simulationStep, setSimulationStep] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSentonce, setEmailSentonce] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();
  const operatorName = searchParams.get("name");
const [initialX, setInitialX] = useState(Math.floor(Math.random() * 100));
const [initialY, setInitialY] = useState(Math.floor(Math.random() * 100));
  // Predefined simulation path - scaled to fit our coordinate system
//   const intX = Math.floor(Math.random() * 100)
//   const intY = Math.floor(Math.random() * 100)
  const simulationPath = [
    {x:initialX,y:initialY},    // Start outside
    { x: 100, y: 80 },   // Move towards safe zone
    { x: 150, y: 110 },  // Enter safe zone
    { x: 200, y: 140 },  // Inside safe zone
    { x: 250, y: 170 },  // Still inside
    { x: 300, y: 200 },  // Moving towards edge
    { x: 400, y: 250 },  // Exit safe zone
    { x: 500, y: 300 },  // Outside safe zone
    { x: 600, y: 350 },  // Far outside
    { x: 700, y: 400 },  // Very far outside
    { x: 50, y: 450 },   // Move to different area
    { x: 100, y: 400 }   // End position
  ];

  useEffect(() => {
    // Only fetch if there's an operator name in the URL
    if (!operatorName) {
        setLoading(false);
        return;
    }

    const fetchOperatorData = async () => {
      try {
        setLoading(true);
        setError(null);
        // NOTE: In a real application, you would likely fetch a specific operator by ID
        // For this example, we fetch all and then find the one we need.
        const response = await fetch("http://localhost:5000/api/operators");
        if (!response.ok) throw new Error("Failed to fetch operator data.");

        const allOperators: Operator[] = await response.json();
        const foundOperator = allOperators.find((op) => op.operator._id === operatorName);
        
        if (!foundOperator) throw new Error(`Operator with ID "${operatorName}" not found.`);

        setOperator(foundOperator.operator);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOperatorData();
  }, [operatorName]);

  // Transform operator data to points
  useEffect(() => {
    if (operator && operator.safeZone?.coordinates?.[0]) {
    //   const polygonPoints = operator.safeZone.coordinates;
        let polygonPoints ;
      if (operator.safeZone.coordinates.length == 1 ) {
        console.log("The data is in the form: Array<Array<{ x: number; y: number }>>");
         polygonPoints = operator.safeZone.coordinates[0];
        // This is a 2D array of points (e.g., a multi-polygon)
        // You can now safely access elements like coordinates[0][0].x
      
      } else {
        console.log("The data is in the form: Array<{ x: number; y: number }>");
        polygonPoints = operator.safeZone.coordinates.map(coord => coord[0]);
        // This is a 1D array of points (e.g., a simple line or polygon)
        // You can now safely access elements like coordinates[0].x
      }


      if (Array.isArray(polygonPoints) && polygonPoints.length > 0
    ) {
        setPoints(polygonPoints);
      } else {
        setPoints([]);
      }
    }
  }, [operator]);

  // Point-in-polygon algorithm (Ray casting)
  const isPointInPolygon = (point: { x: number; y: number }, polygon: { x: number; y: number }[]) => {
    if (polygon.length < 3) return false;
    
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      
      const intersect = ((yi > point.y) !== (yj > point.y))
          && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    
    return inside;
  };

  // Check proximity and send to server
  const checkProximity = async (point: { x: number; y: number }): Promise<SimulationStatus> => {
    try {
      if (points.length < 3) {
        return { zone: 'outside', message: 'No safe zone defined', point };
      }

      const isInSafeZone = isPointInPolygon(point, points);
      
      let status: SimulationStatus;
      
      if (isInSafeZone) {
        status = { zone: 'safe', message: 'Device is in Safe Zone', point };
        setEmailSent(false); // Reset email flag when back in safe zone
      } else {
        status = { zone: 'outside', message: 'ALERT: Device outside Safe Zone!', point };
        
        // Send email notification for outside zone (only once per excursion)
        if (!emailSent && lolz) {
          try {
            lolz = false
            console.log(emailSentonce)
            console.log(operator)
              setEmailSentonce(true);
            await fetch('http://localhost:8000/ses', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to_email:"nayanansh@gmail.com",
            subject:"The machine is out of the safe zone",
            message:`Alert: The device associated with operator with name/ID -> ${operator?.name || operator?._id} , has exited the safe zone at coordinates (${point.x.toFixed(2)}, ${point.y.toFixed(2)}). Immediate attention is required to ensure the device's safety and compliance with operational protocols.`
              })
            });
            setEmailSent(true);
            console.log('Alert email sent to dealer');
          } catch (emailError) {
            console.error('Failed to send email alert:', emailError);
          }
        }
      }

      // This part can be used to augment the local check with a server-side check
      try {
        const response = await fetch('http://localhost:3002/api/check-proximity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ point, operatorId: operator?._id })
        });
        
        if (response.ok) {
          const serverStatus = await response.json();
          // You might prefer the server's response over the local one
          return serverStatus;
        }
      } catch (serverError) {
        console.log('Server proximity check failed, using local detection.');
      }

      return status;
    } catch (error) {
      console.error('Error in checkProximity:', error);
      return { zone: 'outside', message: 'Error checking proximity', point };
    }
  };

  // Start/Stop simulation logic
  const handleSimulationToggle = () => {
    if (isSimulating) {
      // Stop the simulation
      setIsSimulating(false);
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
      // Reset state
      setSimulationInterval(null);
      setCurrentPosition(null);
      setCurrentStatus(null);
      setSimulationStep(0);
    } else {
      // Start the simulation
      setIsSimulating(true);
      setSimulationStep(0);
      setEmailSent(false);
      
      let currentStep = 0;
      const interval = setInterval(async () => {
        if (currentStep >= simulationPath.length) {
          clearInterval(interval);
          setIsSimulating(false);
          setSimulationInterval(null);
          return;
        }
        
        const currentPoint = simulationPath[currentStep];
        setCurrentPosition(currentPoint);
        setSimulationStep(currentStep + 1);
        
        const status = await checkProximity(currentPoint);
        setCurrentStatus(status);
        
        currentStep++;
      }, 1000); // Move every 1 second
      
      setSimulationInterval(interval);
    }
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Operator Data</h2>
          <p className="text-gray-500">Fetching safe zone information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Data</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No operator found
  if (!operator) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Operator Selected</h2>
          <p className="text-gray-500">Please select an operator to view their safe zone.</p>
        </div>
      </div>
    );
  }

  // Calculate bounds for better scaling
  const calculateBounds = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return { minX: 0, maxX: 600, minY: 0, maxY: 400 };
    
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  };

  const bounds = calculateBounds([...points, ...simulationPath]);
  const padding = 40;
  const svgWidth = 600;
  const svgHeight = 400;
  const drawWidth = svgWidth - 2 * padding;
  const drawHeight = svgHeight - 2 * padding;

  // Scale points to fit in SVG with padding
  const scalePoints = (inputPoints: { x: number; y: number }[]) => {
    if (inputPoints.length === 0 || (bounds.maxX - bounds.minX === 0) || (bounds.maxY - bounds.minY === 0)) return [];
    
    const xScale = drawWidth / (bounds.maxX - bounds.minX);
    const yScale = drawHeight / (bounds.maxY - bounds.minY);
    const scale = Math.min(xScale, yScale) * 0.9; // Use 0.9 for a bit more padding
    
    const centerX = (bounds.maxX + bounds.minX) / 2;
    const centerY = (bounds.maxY + bounds.minY) / 2;
    
    return inputPoints.map(p => ({
      x: padding + drawWidth / 2 + (p.x - centerX) * scale,
      // CORRECTED: Invert the Y-axis for correct SVG display
      y: padding + drawHeight / 2 - (p.y - centerY) * scale,
    }));
  };

  const scaledPoints = scalePoints(points);
  const scaledCurrentPosition = currentPosition ? scalePoints([currentPosition])[0] : null;

  // Create path string for polygon
  const pathString = scaledPoints.length > 0 
    ? `M ${scaledPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`
    : '';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 gap-6">
      {/* Left Panel: Controls */}
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full lg:w-80 lg:max-w-xs flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Proximity Monitor
        </h2>
        
        {operator && (
          <p className="text-gray-600 mb-6">
            Monitoring: <span className="font-semibold text-blue-600">{operator.name || operator._id}</span>
          </p>
        )}

        {/* Simulation Controls */}
        <div className="space-y-4">
          <button
            onClick={handleSimulationToggle}
            disabled={points.length === 0}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              isSimulating 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                : 'bg-cyan-500 hover:bg-cyan-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none shadow-lg'
            }`}
          >
            {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
          </button>

          {/* Status Display */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Step: <span className="font-medium text-gray-800">{simulationStep} / {simulationPath.length}</span></p>
              <p>State: <span className={`font-medium ${isSimulating ? 'text-green-600' : 'text-red-600'}`}>{isSimulating ? 'Running' : 'Stopped'}</span></p>
              {currentPosition && (
                <p>Position: <span className="font-mono text-gray-800">({currentPosition.x.toFixed(1)}, {currentPosition.y.toFixed(1)})</span></p>
              )}
              {currentStatus && (
                <p>Zone: <span className={`font-bold ${currentStatus.zone === 'safe' ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStatus.zone.charAt(0).toUpperCase() + currentStatus.zone.slice(1)}
                </span></p>
              )}
            </div>
          </div>

          {/* Alert Display */}
          {currentStatus && (
            <div className={`p-4 rounded-lg text-center font-semibold transition-all duration-300 ${
              currentStatus.zone === 'safe' ? 'bg-green-100 text-green-800' :
              currentStatus.zone === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              currentStatus.zone === 'danger' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              <div className="flex items-center justify-center mb-1">
                {currentStatus.zone === 'outside' && (
                  <svg className="w-6 h-6 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                )}
                <p>{currentStatus.message}</p>
              </div>
              {currentStatus.zone === 'outside' && emailSent && (
                <p className="text-sm mt-1 font-normal">📧 Alert email sent to dealer</p>
              )}
            </div>
          )}

          {/* Coordinates Display */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Safe Zone Points ({points.length})</h4>
            <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
              {points.map((p, i) => (
                <div key={i} className="flex justify-between hover:bg-gray-100 px-1 rounded">
                  <span>P{i + 1}:</span>
                  <span className="font-mono">({p.x.toFixed(1)}, {p.y.toFixed(1)})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Visualization */}
      <div className="flex-1 bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Real-time Proximity Simulation
        </h3>
        <div className="relative w-full max-w-2xl aspect-[3/2]">
          <svg
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-inner border-2 border-gray-200"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.5"/>
              </pattern>
              <linearGradient id="polygonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

            {scaledPoints.length > 2 && (
              <>
                <path
                  d={pathString}
                  fill="url(#polygonGradient)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d={pathString}
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="1.5"
                  strokeDasharray="6,3"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="9" dur="1s" repeatCount="indefinite" />
                </path>
              </>
            )}

            {scaledPoints.map((p, i) => (
              <g key={`point-${i}`}>
                <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#1e40af" strokeWidth="2"/>
              </g>
            ))}

            {isSimulating && scalePoints(simulationPath).map((p, i) => (
              <g key={`path-${i}`}>
                <circle cx={p.x} cy={p.y} r="3" fill="#64748b" opacity="0.5" />
              </g>
            ))}

            {scaledCurrentPosition && (
              <g className="transition-transform duration-500 ease-out">
                <circle
                  cx={scaledCurrentPosition.x}
                  cy={scaledCurrentPosition.y}
                  r="12"
                  fill={currentStatus?.zone === 'safe' ? '#10b981' : '#ef4444'}
                  opacity="0.3"
                  filter="url(#glow)"
                >
                  <animate attributeName="r" values="12;16;12" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <circle
                  cx={scaledCurrentPosition.x}
                  cy={scaledCurrentPosition.y}
                  r="7"
                  fill={currentStatus?.zone === 'safe' ? '#10b981' : '#ef4444'}
                  stroke="white"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>

          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg text-xs border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-2">Legend</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 opacity-50 border border-blue-600 rounded-sm"></div><span>Safe Zone</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span>Device (Safe)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span>Device (Outside)</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-500 rounded-full"></div><span>Sim Path</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
