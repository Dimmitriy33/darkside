import httpService from "@/helpers/httpHelper";
import endPoints from "./endPoints";

// eslint-disable-next-line import/prefer-default-export
export async function apiGetCategories(): Promise<string[] | null> {
  const res = await httpService.get<string[]>(endPoints.getCategories);

  return res?.data;
}
