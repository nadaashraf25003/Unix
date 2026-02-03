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

  return {
    roomsQuery,
    roomsByBuilding,
  };
};

export default useRooms;
