"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FilePlus2, User, CheckCircle, HardDrive, Calendar, Loader2, MapPin, Trash2, Crosshair, Shapes } from 'lucide-react';

// A dedicated component for the drawing canvas
const ZoneCanvas = ({ zonePoints, onPointsChange, color, trackerPosition, onTrackerChange, drawingMode }) => {
    const canvasRef = useRef(null);
    const [mousePos, setMousePos] = useState(null);
    const GRID_SIZE = 20;
    const POINT_RADIUS = 4;
    const TRACKER_RADIUS = 6;

    // Effect for drawing and redrawing the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }
        
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        ctx.clearRect(0, 0, width, height);

        // --- Draw Grid ---
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.5)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= width; x += GRID_SIZE) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y <= height; y += GRID_SIZE) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // --- Draw Polygon ---
        if (zonePoints.length > 1) {
            ctx.beginPath();
            ctx.moveTo(zonePoints[0].x, zonePoints[0].y);
            for (let i = 1; i < zonePoints.length; i++) {
                ctx.lineTo(zonePoints[i].x, zonePoints[i].y);
            }
            if (zonePoints.length > 2) ctx.closePath();
            ctx.fillStyle = `rgba(${color === 'green' ? '4, 120, 87' : '255, 0, 0'}, 0.3)`;
            ctx.fill();
            ctx.strokeStyle = `rgb(${color === 'green' ? '5, 150, 105' : '255, 0, 0'})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // --- Draw Polygon Points ---
        zonePoints.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, POINT_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = 'white'; ctx.fill();
            ctx.strokeStyle = 'rgb(2, 6, 23)'; ctx.lineWidth = 1.5; ctx.stroke();
        });

        // --- Draw Tracker Marker ---
        if (trackerPosition) {
            ctx.beginPath(); ctx.arc(trackerPosition.x, trackerPosition.y, TRACKER_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.9)'; ctx.fill();
            ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();
        }

        // --- Draw Live Coordinates ---
        if (mousePos) {
            const text = `(${Math.round(mousePos.x)}, ${Math.round(mousePos.y)})`;
            ctx.font = '12px sans-serif';
            ctx.fillStyle = 'rgb(15, 23, 42)';
            ctx.fillText(text, mousePos.x + 10, mousePos.y - 10);
        }

    }, [zonePoints, color, trackerPosition, mousePos, drawingMode]);

    const getMousePos = (event) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    // --- UPDATED CLICK HANDLER ---
    // This now checks the drawing mode to decide what action to take.
    const handleCanvasClick = (event) => {
        const pos = getMousePos(event);
        if (!pos) return;

        if (drawingMode === 'zone') {
            onPointsChange([...zonePoints, pos]);
        } else if (drawingMode === 'tracker') {
            onTrackerChange(pos);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={(e) => setMousePos(getMousePos(e))}
            onMouseLeave={() => setMousePos(null)}
            className="w-full h-64 bg-slate-100 rounded-lg cursor-crosshair border border-slate-300"
        />
    );
};


// Main App Component
export default function App() {
    // Form fields state
    const [name, setName] = useState('');
    const [status, setStatus] = useState('Active');
    const [certification, setCertification] = useState('Certified');
    const [assignedEquipment, setAssignedEquipment] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    
    // Canvas and interaction state
    const [greenZone, setGreenZone] = useState([]);
    const [trackerPosition, setTrackerPosition] = useState(null);
    const [drawingMode, setDrawingMode] = useState('zone'); // 'zone' or 'tracker'

    // Submission status state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        const today = new Date();
        setCreatedDate(today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }, []);

    const resetForm = () => {
        setName(''); setStatus('Active'); setCertification('Certified');
        setAssignedEquipment(''); setGreenZone([]); setTrackerPosition(null);
        setDrawingMode('zone');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true); setSubmitStatus(null); setSubmitMessage('');

        const payload = {
            name, status, certification, assignedEquipment,
            safeZone: { type: 'Polygon', coordinates: greenZone },
            initialTrackerPosition: trackerPosition 
        };
        
        console.log('Submitting Payload:', JSON.stringify(payload, null, 2));

        try {
            const response = await fetch('http://localhost:5000/api/operators', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');
            
            setSubmitStatus('success');
            setSubmitMessage('Record submitted successfully!');
            resetForm();
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage('Failed to submit the record. Please try again.');
            console.error('Submission Error:', error);
        } finally {
            setIsSubmitting(false);
            setTimeout(() => { setSubmitStatus(null); setSubmitMessage(''); }, 3000);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen flex items-center justify-center font-sans p-4">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <div className="flex items-center mb-6">
                    <FilePlus2 className="h-8 w-8 text-blue-600 mr-3" />
                    <h1 className="text-3xl font-bold text-gray-800">Create New Operator</h1>
                </div>
                <p className="text-gray-500 mb-8">
                    Fill out the form below to add a new operator record, including their designated safe zone.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* --- FORM FIELDS (UNCHANGED) --- */}
                    <div className="relative">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., John Doe" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div className="relative">
                                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                                    <option>Active</option> <option>Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="certification" className="block text-sm font-medium text-gray-700 mb-2">Certification</label>
                            <div className="relative">
                                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="text" id="certification" value={certification} onChange={(e) => setCertification(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Forklift Certified" />
                            </div>
                        </div>
                    </div>
                    <div>
                         <label htmlFor="assignedEquipment" className="block text-sm font-medium text-gray-700 mb-2">Assigned Equipment</label>
                         <div className="relative">
                             <HardDrive className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                             <textarea id="assignedEquipment" value={assignedEquipment} onChange={(e) => setAssignedEquipment(e.target.value)} rows={2} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Enter Equipment Name or ID"></textarea>
                         </div>
                    </div>

                    {/* --- UPDATED CANVAS CONTROLS --- */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <label className="block text-sm font-medium text-gray-700">Drawing Controls</label>
                             <div className="flex items-center space-x-2 p-1 bg-slate-100 rounded-lg">
                                <button type="button" onClick={() => setDrawingMode('zone')} className={`flex items-center text-sm font-semibold px-3 py-1 rounded-md transition-colors duration-150 ${drawingMode === 'zone' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-slate-200'}`}>
                                     <Shapes className="h-4 w-4 mr-2"/> Define Safe Zone
                                </button>
                                <button type="button" onClick={() => setDrawingMode('tracker')} className={`flex items-center text-sm font-semibold px-3 py-1 rounded-md transition-colors duration-150 ${drawingMode === 'tracker' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-slate-200'}`}>
                                     <Crosshair className="h-4 w-4 mr-2"/> Place Tracker
                                </button>
                             </div>
                        </div>
                         <ZoneCanvas 
                            zonePoints={greenZone} 
                            onPointsChange={setGreenZone} 
                            color="green"
                            trackerPosition={trackerPosition}
                            onTrackerChange={setTrackerPosition}
                            drawingMode={drawingMode}
                         />
                         <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-500">
                                Current Mode: <span className="font-semibold text-gray-700">{drawingMode === 'zone' ? 'Defining Zone' : 'Placing Tracker'}</span>
                            </p>
                            <button type="button" onClick={() => { setGreenZone([]); setTrackerPosition(null); }} className="flex items-center text-xs text-gray-500 hover:text-red-600 transition-colors duration-150">
                                <Trash2 className="h-3 w-3 mr-1"/> Clear Canvas
                            </button>
                         </div>
                    </div>

                    {/* --- REST OF THE FORM (UNCHANGED) --- */}
                    <div>
                        <label htmlFor="createdDate" className="block text-sm font-medium text-gray-700 mb-2">Created Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" id="createdDate" value={createdDate} readOnly className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
                        </div>
                    </div>
                    <div>
                        <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                            {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>) : ('Create Record')}
                        </button>
                    </div>
                </form>
                
                {submitStatus && (
                    <div className={`mt-6 p-4 border rounded-lg text-center ${submitStatus === 'success' ? 'bg-green-100 border-green-200 text-green-800' : 'bg-red-100 border-red-200 text-red-800'}`}>
                        <p>{submitMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
