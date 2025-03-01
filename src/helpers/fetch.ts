import axios from "axios";
import { toast } from "react-toastify";
import {
  apiOrigin,
  handleAxiosError
} from "./constants";

export const getTrainings = async (
  keyWord?: string[],
  limit?: number,
  page?: number,
) => {
  try {
    let url = `${apiOrigin}/source?limit=${limit || 5}&page=${page || 1}`;
    if (keyWord && keyWord.length > 0) url += `&search=${encodeURIComponent(keyWord.join())}`;

    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error retrieving job data list`);
    }
  } catch (err) {
    handleAxiosError(err, "");
    throw err;
  }
};
