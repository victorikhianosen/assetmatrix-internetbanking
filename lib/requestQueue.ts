type QueuedRequest = {
  url: string;
  options?: RequestInit;
  resolve: (value: Response | PromiseLike<Response>) => void;
  reject: (reason?: unknown) => void;
};

const queue: QueuedRequest[] = [];

export function addToQueue(request: QueuedRequest) {
  queue.push(request);
}

export async function processQueue() {
  while (queue.length > 0) {
    const req = queue.shift();

    if (!req) return;

    try {
      const response = await fetch(req.url, req.options);
      req.resolve(response);
    } catch (error: unknown) {
      req.reject(error);
    }
  }
}
