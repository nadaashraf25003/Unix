import {  useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  // ✅ Get all pre-generated paths (optional)
  const allPathsQuery = useQuery({
    queryKey: ["room-paths"],
    queryFn: async () =>
      (await api.get(Urls.ROOM_PATHS.GET_ALL)).data as RoomPathDto[],
  });

  // ✅ Get a specific path if it exists
  const getPathQuery = (fromRoomId: number, toRoomId: number) =>
    useQuery({
      queryKey: ["room-path", fromRoomId, toRoomId],
      queryFn: async () =>
        (await api.get(Urls.ROOM_PATHS.GET_PATH(fromRoomId, toRoomId))).data as RoomPathDto,
      enabled: !!fromRoomId && !!toRoomId,
    });

  // ✅ Generate path dynamically if it doesn't exist
  const generatePathMutation = useMutation({
    mutationFn: async ({ fromRoomId, toRoomId }: { fromRoomId: number; toRoomId: number }) =>
      (await api.post(Urls.ROOM_PATHS.GENERATE(fromRoomId, toRoomId))).data as RoomPathDto,
    onSuccess: (data, variables) => {
      // Update the cache so getPathQuery can use it instantly
      queryClient.setQueryData(["room-path", variables.fromRoomId, variables.toRoomId], data);
    },
  });

  return {
    allPathsQuery,
    getPathQuery,
    generatePathMutation,
  };
};

export default useRoomNavigation;
