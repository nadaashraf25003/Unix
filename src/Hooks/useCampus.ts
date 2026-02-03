import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";
import toast from "react-hot-toast";

/* ================= TYPES ================= */
export interface BuildingDto {
  id?: number;
  name: string;
  description?: string;
}

export interface RoomDto {
  id?: number;
  roomCode: string;
  roomType: string;
  capacity: number;
  buildingId: number;
  floorId?: number;
}

export interface EquipmentDto {
  id?: number;
  name: string;
  quantity: number;
  roomId: number;
}

export interface RoomAvailabilityDto {
  roomId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

/* ================= HOOK ================= */
const useCampus = () => {
  const qc = useQueryClient();

  const buildingsQuery = useQuery({
    queryKey: ["buildings"],
    queryFn: async () =>
      (await api.get(Urls.BUILDINGS.GET_ALL)).data as BuildingDto[],
  });

  const createBuildingMutation = useMutation({
    mutationFn: async (dto: BuildingDto) =>
      (await api.post(Urls.BUILDINGS.CREATE, dto)).data,
    onSuccess: () => {
      toast.success("Building created");
      qc.invalidateQueries({ queryKey: ["buildings"] });
    },
  });

  const roomsQuery = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => (await api.get(Urls.ROOMS.GET_ALL)).data as RoomDto[],
  });

  const roomsByBuildingQuery = (buildingId: number) =>
    useQuery({
      queryKey: ["rooms", "building", buildingId],
      queryFn: async () =>
        (await api.get(Urls.ROOMS.GET_BY_BUILDING(buildingId))).data as RoomDto[],
      enabled: !!buildingId,
    });

  const createRoomMutation = useMutation({
    mutationFn: async (dto: RoomDto) => (await api.post(Urls.ROOMS.CREATE, dto)).data,
    onSuccess: () => {
      toast.success("Room created");
      qc.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  const equipmentByRoomQuery = (roomId: number) =>
    useQuery({
      queryKey: ["equipment", roomId],
      queryFn: async () =>
        (await api.get(Urls.EQUIPMENT.GET_BY_ROOM(roomId))).data as EquipmentDto[],
      enabled: !!roomId,
    });

  const addEquipmentMutation = useMutation({
    mutationFn: async (dto: EquipmentDto) =>
      (await api.post(Urls.EQUIPMENT.CREATE, dto)).data,
    onSuccess: () => {
      toast.success("Equipment added");
      qc.invalidateQueries({ queryKey: ["equipment"] });
    },
  });

  const roomAvailabilityQuery = useQuery({
    queryKey: ["room-availability"],
    queryFn: async () =>
      (await api.get(Urls.ROOMS.AVAILABILITY)).data as RoomAvailabilityDto[],
  });

  return {
    buildingsQuery,
    createBuildingMutation,
    roomsQuery,
    roomsByBuildingQuery,
    createRoomMutation,
    equipmentByRoomQuery,
    addEquipmentMutation,
    roomAvailabilityQuery,
  };
};

export default useCampus;
