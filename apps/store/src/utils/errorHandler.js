import toast from "react-hot-toast";
import { blockStatus } from "@/stores/blockStatus";

export const handleError = (err) => {
  if (err.response?.status === 403 && err.response?.data?.message === "You have been blocked") {
    blockStatus.setState(true);
    return;
  }

  let message;
  if (err.response?.status === 401) {
    message = "Incorrect email or password";
  } else {
    message = err.response?.data?.message ?? err.message ?? "Something went wrong";
  }
  toast.error(message);
};
