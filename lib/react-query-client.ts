import { QueryClient, QueryCache } from "@tanstack/react-query";;
import Logout from "@/features/auth/services/Logout";

/**
 *
 * - Uses QueryCache.onError for centralized error handling
 * - Automatically logs out the user when a session-expired error occurs
 * - Disables automatic retries for queries
 */
export const queryClient = new QueryClient({
  /**
   * QueryCache allows us to listen to errors from ALL queries globally.
   */
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      /**
       * If any query throws a "Session expired" error,
       * immediately log the user out and redirect to login.
       */
      if (error instanceof Error && error.message === "Session expired") {
        Logout();
      }
    },
  }),

  /**
   * Default query behavior across the application
   */
  defaultOptions: {
    queries: {
      /**
       * Disable automatic retries.
       * Prevents repeated calls with an expired token.
       */
      retry: false,
    },
  },
});
