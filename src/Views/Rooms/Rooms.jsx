import React, { useState, useMemo, useEffect } from "react";
import useRooms from "@/Hooks/useRooms";
import { 
  Calendar, 
  Clock, 
  ChevronDown, 
  Filter, 
  Search,
  CheckCircle,
  XCircle,
  Building,
  ChevronRight,
  Zap,
  RefreshCw,
  AlertCircle
} from "lucide-react";

const Rooms = () => {
  const { roomsQuery, roomAvailability } = useRooms();

  const rooms = roomsQuery.data || [];
  const availabilityQuery = roomAvailability();
  const availability = availabilityQuery.data || [];

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRooms, setExpandedRooms] = useState([]);
  const [showAvailableNow, setShowAvailableNow] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const generateSlots = () => {
    const slots = [];
    let hour = 9;
    let minute = 0;

    while (hour < 17 || (hour === 17 && minute < 30)) {
      const startTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      minute += 45;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
      const endTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      slots.push({ startTime, endTime });
    }
    return slots;
  };

  const allSlots = generateSlots();

  const availabilityWithCode = useMemo(() => {
    return availability.map((a) => {
      if (!a.roomCode) {
        const room = rooms.find((r) => r.id === a.roomId);
        return { ...a, roomCode: room ? room.roomCode : `Room ${a.roomId}` };
      }
      return a;
    });
  }, [availability, rooms]);

  // Get current time in HH:mm format
  const getCurrentTimeSlot = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    
    // Find which slot we're in
    for (const slot of allSlots) {
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);
      
      const slotStart = new Date();
      slotStart.setHours(startHour, startMinute, 0, 0);
      
      const slotEnd = new Date();
      slotEnd.setHours(endHour, endMinute, 0, 0);
      
      if (now >= slotStart && now < slotEnd) {
        return slot;
      }
    }
    return null;
  };

  // Get current day name
  const getCurrentDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[currentTime.getDay()];
  };

  // Get rooms available now
  const getRoomsAvailableNow = useMemo(() => {
    if (!showAvailableNow) return rooms;
    
    const currentDay = getCurrentDay();
    const currentSlot = getCurrentTimeSlot();
    
    if (!currentSlot) return []; // Outside business hours
    
    return rooms.filter(room => {
      const availabilityRecord = availabilityWithCode.find(
        a => 
          a.roomId === room.id &&
          a.dayOfWeek === currentDay &&
          a.startTime.slice(0, 5) === currentSlot.startTime &&
          a.endTime.slice(0, 5) === currentSlot.endTime &&
          a.isAvailable
      );
      return availabilityRecord !== undefined;
    });
  }, [showAvailableNow, rooms, availabilityWithCode, currentTime]);

  // Check if we're within business hours
  const isWithinBusinessHours = useMemo(() => {
    const now = currentTime;
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Business hours: 9:00 - 17:30
    if (hour < 9 || hour > 17) return false;
    if (hour === 17 && minute >= 30) return false;
    
    return true;
  }, [currentTime]);

  const filteredRooms = useMemo(() => {
    let result = showAvailableNow ? getRoomsAvailableNow : rooms;
    
    if (selectedRoomId) {
      result = result.filter((r) => r.id === Number(selectedRoomId));
    }
    
    if (searchTerm) {
      result = result.filter((r) =>
        r.roomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.roomType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result;
  }, [rooms, selectedRoomId, searchTerm, showAvailableNow, getRoomsAvailableNow]);

  const availabilityByDayAndRoom = useMemo(() => {
    const dayToShow = selectedDay || (showAvailableNow ? getCurrentDay() : "");
    if (!dayToShow) return [];

    return filteredRooms.map((room) => {
      const roomSlots = allSlots.map((slot) => {
        const existing = availabilityWithCode.find(
          (a) =>
            a.roomId === room.id &&
            a.dayOfWeek === dayToShow &&
            a.startTime.slice(0, 5) === slot.startTime &&
            a.endTime.slice(0, 5) === slot.endTime
        );
        
        // Check if this is the current slot (for highlighting)
        const isCurrentSlot = showAvailableNow && 
          slot.startTime === getCurrentTimeSlot()?.startTime &&
          slot.endTime === getCurrentTimeSlot()?.endTime;
        
        return {
          ...slot,
          roomId: room.id,
          dayOfWeek: dayToShow,
          roomCode: room.roomCode,
          isAvailable: existing ? existing.isAvailable : true,
          isCurrentSlot: isCurrentSlot,
        };
      });
      return { room, slots: roomSlots };
    });
  }, [availabilityWithCode, selectedDay, filteredRooms, allSlots, showAvailableNow, currentTime]);

  const toggleRoomExpansion = (roomId) => {
    setExpandedRooms(prev =>
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="min-h-screen bg-light dark:bg-dark-bg p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Room Availability
                </h1>
                {showAvailableNow && (
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Available Now
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {showAvailableNow 
                  ? "Rooms available for immediate booking"
                  : "View and manage room availability throughout the week"
                }
              </p>
            </div>
            
            {/* Current Time Display */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700">
                <Clock className="h-4 w-4 text-primary dark:text-dark-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getCurrentDay()}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Booked</span>
                </div>
                {showAvailableNow && (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                    <span>Current Slot</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <div className="card mb-8">
            <div className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-300">
              <Filter className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Filters & Tools</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Available Now Toggle */}
              <div className="md:col-span-1">
                <button
                  onClick={() => {
                    setShowAvailableNow(!showAvailableNow);
                    if (!showAvailableNow) {
                      setSelectedDay(getCurrentDay());
                    } else {
                      setSelectedDay("");
                    }
                  }}
                  className={`w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-xl transition-all ${
                    showAvailableNow
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-800'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Zap className={`h-5 w-5 ${showAvailableNow ? 'animate-pulse' : ''}`} />
                  {showAvailableNow ? 'Show All Rooms' : 'Available Now'}
                </button>
              </div>

              {/* Search */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Rooms
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by room code or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Room Select */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Room
                </label>
                <div className="relative">
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="input appearance-none pr-10 cursor-pointer"
                  >
                    <option value="">
                      {showAvailableNow 
                        ? `Available Rooms (${getRoomsAvailableNow.length})`
                        : `All Rooms (${rooms.length})`
                      }
                    </option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.roomCode} - {room.roomType}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Day Select */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {showAvailableNow ? 'Viewing' : 'Select Day'}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="input pl-10 appearance-none cursor-pointer"
                    disabled={showAvailableNow}
                  >
                    {showAvailableNow ? (
                      <option value={getCurrentDay()}>
                        {getCurrentDay()} (Current)
                      </option>
                    ) : (
                      <>
                        <option value="">Choose a day</option>
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                            {day === getCurrentDay() && " (Today)"}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Current Time Slot Info */}
            {showAvailableNow && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Current Time Slot:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        {getCurrentTimeSlot()?.startTime} - {getCurrentTimeSlot()?.endTime}
                      </span>
                    </div>
                  </div>
                  {!isWithinBusinessHours && (
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>Outside business hours</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        {selectedDay || showAvailableNow ? (
          <div className="animate-slideDown">
            {/* Day Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary dark:text-dark-primary" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {showAvailableNow ? `Available Now - ${getCurrentDay()}` : selectedDay}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                    ({filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}{' '}
                    {showAvailableNow && !isWithinBusinessHours ? 'outside business hours' : 'available'})
                  </span>
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  9:00 AM - 5:30 PM (45-min slots)
                </span>
                <button
                  onClick={() => setCurrentTime(new Date())}
                  className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  title="Refresh time"
                >
                  <RefreshCw className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Outside Business Hours Warning */}
            {showAvailableNow && !isWithinBusinessHours && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Outside Regular Business Hours
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing rooms that would be available if it were within business hours (9:00 AM - 5:30 PM).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rooms Grid */}
            {availabilityByDayAndRoom.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  {showAvailableNow ? (
                    <Zap className="h-16 w-16 mx-auto" />
                  ) : (
                    <Calendar className="h-16 w-16 mx-auto" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {showAvailableNow ? 'No rooms available right now' : 'No rooms available'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {showAvailableNow
                    ? "Check back during business hours or try a different filter"
                    : "Try adjusting your filters or select a different day"}
                </p>
                {showAvailableNow && (
                  <button
                    onClick={() => setShowAvailableNow(false)}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    View All Rooms
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {availabilityByDayAndRoom.map(({ room, slots }) => {
                  const currentSlot = slots.find(s => s.isCurrentSlot);
                  const isAvailableNow = currentSlot?.isAvailable;
                  
                  return (
                    <div 
                      key={room.id} 
                      className={`card hover:shadow-lg transition-shadow duration-300 ${
                        showAvailableNow && isAvailableNow 
                          ? 'ring-2 ring-green-500 dark:ring-green-400' 
                          : ''
                      }`}
                    >
                      {/* Room Header */}
                      <div 
                        className="flex items-center justify-between cursor-pointer p-4"
                        onClick={() => toggleRoomExpansion(room.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${
                              showAvailableNow && isAvailableNow
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : 'bg-primary/10 dark:bg-dark-primary/20'
                            }`}>
                              <Building className={`h-6 w-6 ${
                                showAvailableNow && isAvailableNow
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-primary dark:text-dark-primary'
                              }`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                  {room.roomCode}
                                </h3>
                                {showAvailableNow && isAvailableNow && (
                                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-2 py-0.5 rounded-full">
                                    Available Now
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {room.roomType}
                              </p>
                            </div>
                          </div>
                          
                          {/* Quick Stats */}
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {slots.filter(s => s.isAvailable).length} available slots
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {slots.filter(s => !s.isAvailable).length} booked
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <ChevronRight 
                          className={`h-6 w-6 text-gray-400 transition-transform duration-200 ${
                            expandedRooms.includes(room.id) ? 'rotate-90' : ''
                          }`}
                        />
                      </div>

                      {/* Expanded Slots */}
                      {expandedRooms.includes(room.id) && (
                        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 animate-slideDown">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto scrollbar-thin p-2">
                            {slots.map((slot, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border transition-all duration-200 ${
                                  slot.isCurrentSlot
                                    ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                                    : ''
                                } ${
                                  slot.isAvailable
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                }`}
                              >
                                <div className="text-center">
                                  <div className="font-semibold text-gray-900 dark:text-white">
                                    {slot.startTime}
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                    to {slot.endTime}
                                  </div>
                                  {slot.isCurrentSlot && (
                                    <div className="mb-1">
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                                        <Clock className="h-3 w-3" />
                                        Current
                                      </span>
                                    </div>
                                  )}
                                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    slot.isAvailable
                                      ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                                      : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                                  }`}>
                                    {slot.isAvailable ? (
                                      <>
                                        <CheckCircle className="h-3 w-3" />
                                        Available
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="h-3 w-3" />
                                        Booked
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="card text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="bg-primary/10 dark:bg-dark-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-primary dark:text-dark-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {isWithinBusinessHours 
                  ? 'Need a room right now?'
                  : 'View Room Availability'
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {isWithinBusinessHours
                  ? 'Click "Available Now" to see rooms available for immediate booking.'
                  : 'Select a day or use "Available Now" to see rooms during business hours.'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isWithinBusinessHours && (
                  <button
                    onClick={() => {
                      setShowAvailableNow(true);
                      setSelectedDay(getCurrentDay());
                    }}
                    className="btn-primary inline-flex items-center justify-center gap-2"
                  >
                    <Zap className="h-5 w-5" />
                    View Available Now
                  </button>
                )}
                
                <div className="grid grid-cols-7 gap-2 max-w-sm mx-auto sm:mx-0">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`p-2 rounded-lg border text-sm ${
                        day === getCurrentDay()
                          ? 'border-primary dark:border-dark-primary bg-primary/10 dark:bg-dark-primary/20'
                          : 'border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-dark-primary'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
              {showAvailableNow ? (
                <>
                  <Zap className="h-4 w-4" />
                  Available Now
                </>
              ) : (
                'Total Rooms'
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {showAvailableNow ? getRoomsAvailableNow.length : rooms.length}
            </div>
          </div>
          
          <div className="card">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Filtered Rooms</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredRooms.length}
            </div>
          </div>
          
          <div className="card">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {showAvailableNow ? 'Current Slot' : 'Time Slots/Day'}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {showAvailableNow 
                ? `${getCurrentTimeSlot()?.startTime || '-'}`
                : allSlots.length
              }
            </div>
          </div>
          
          <div className="card">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {showAvailableNow ? 'Current Day' : 'Days Available'}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {showAvailableNow ? getCurrentDay().slice(0, 3) : '7'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;