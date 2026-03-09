import { toast } from "react-toastify";
import { addToQueue } from "./requestQueue";

export function smartFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  return new Promise((resolve, reject) => {
    if (!navigator.onLine) {
      toast.warn("You are offline. Request will run when connection returns.");

      addToQueue({
        url,
        options,
        resolve,
        reject,
      });

      return;
    }

    fetch(url, options)
      .then(resolve)
      .catch((err) => {
        toast.error("Network error. Request queued.");
        addToQueue({
          url,
          options,
          resolve,
          reject,
        });
      });
  });
}
