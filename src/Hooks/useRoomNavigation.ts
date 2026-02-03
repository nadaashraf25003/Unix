import { useQuery } from "@tanstack/react-query";
import api from "@/API/Config";
import Urls from "@/API/URLs";

/* ================= TYPES ================= */
export interface RoomPathDto {
  id: number;
  fromRoomId: number;
  toRoomId: number;
  pathDescription: string;
}

/* ================= HOOK ================= */
const useRoomNavigation = () => {
  const allPathsQuery = useQuery({
    queryKey: ["room-paths"],
    queryFn: async () =>
      (await api.get(Urls.ROOM_PATHS.GET_ALL)).data as RoomPathDto[],
  });

  const getPathQuery = (fromRoomId: number, toRoomId: number) =>
    useQuery({
      queryKey: ["room-path", fromRoomId, toRoomId],
      queryFn: async () =>
        (await api.get(
          Urls.ROOM_PATHS.GET_PATH(fromRoomId, toRoomId)
        )).data as RoomPathDto,
      enabled: !!fromRoomId && !!toRoomId,
    });

  return {
    allPathsQuery,
    getPathQuery,
  };
};

export default useRoomNavigation;
