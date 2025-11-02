import toast from "react-hot-toast";

export const handleError = (err) => {
  let message;
  if (err.response?.status === 401) {
    message = "Incorrect email or password";
  } else {
    message = err.response?.data?.message ?? err.message ?? "Something went wrong";
  }
  toast.error(message);
};
