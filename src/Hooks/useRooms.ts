import { useQuery } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

/* =======================
   Types
======================= */

export interface BuildingDto {
  id: number;
  name: string;
  description: string;
}

export interface FloorDto {
  id: number;
  buildingId: number;
  floorNumber: number;
  width: number;
  length: number;
  layoutJson: string;
}

export interface RoomDto {
  id: number;
  buildingId: number;
  floorId: number;
  roomCode: string;
  roomType: string;
  capacity: number;
  positionX: number;
  positionY: number;
  building: BuildingDto;
  floor: FloorDto;
}
export interface RoomAvailabilityDto {
  roomId: number;
  dayOfWeek: string;       // "Monday", "Tuesday", ...
  startTime: string;       // "08:00:00"
  endTime: string;         // "10:00:00"
  isAvailable: boolean;

  // Optional fields for convenience
  roomCode?: string;
  roomType?: string;
  floorId?: number;
  buildingId?: number;
  id?: string | number;
}
/* =======================
   Hook
======================= */

const useRooms = () => {
  const roomsQuery = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await api.get(Urls.ROOMS.GET_ALL);
      return res.data as RoomDto[];
    },
  });

  const roomsByBuilding = (buildingId: number) =>
    useQuery({
      queryKey: ["rooms", buildingId],
      queryFn: async () => {
        const res = await api.get(Urls.ROOMS.GET_BY_BUILDING(buildingId));
        return res.data as RoomDto[];
      },
      enabled: !!buildingId,
    });

  const roomAvailability = (roomId?: number) =>
    useQuery({
      queryKey: roomId ? ["roomsAvailability", roomId] : ["roomsAvailability"],
      queryFn: async () => {
        const url = roomId
          ? `${Urls.ROOMS.AVAILABILITY}?roomId=${roomId}`
          : Urls.ROOMS.AVAILABILITY;
        const res = await api.get(url);
        return res.data as RoomAvailabilityDto[];
      },
      enabled: roomId !== undefined, // optional: fetch only if roomId is passed
    });

  return {
    roomsQuery,
    roomsByBuilding,
    roomAvailability,
  };
};

export default useRooms;
