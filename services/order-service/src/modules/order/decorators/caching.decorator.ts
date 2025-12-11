export function Cacheable(ttlSeconds: number = 60) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, { data: any; timestamp: number }>();

    descriptor.value = async function (...args: any[]) {
      const cacheKey = JSON.stringify({ method: propertyKey, args });

      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < ttlSeconds * 1000) {
        console.log(`[Cache] Returning cached result for ${propertyKey}`);
        return cached.data;
      }

      const result = await originalMethod.apply(this, args);

      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    };

    return descriptor;
  };
}

export function LogExecution() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const className = target.constructor.name;

      console.log(`[${className}.${propertyKey}] Started with args:`, args);

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;

        console.log(`[${className}.${propertyKey}] Completed in ${duration}ms`);
        return result;
      } catch (error) {
        console.error(`[${className}.${propertyKey}] Failed:`, error);
        throw error;
      }
    };

    return descriptor;
  };
}

export function Retry(maxRetries: number = 3, delayMs: number = 1000) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;

          if (attempt < maxRetries) {
            console.log(
              `[Retry] ${propertyKey} attempt ${attempt} failed, retrying in ${delayMs}ms`,
            );
            await new Promise((resolve) =>
              setTimeout(resolve, delayMs * attempt),
            );
          }
        }
      }

      console.error(
        `[Retry] ${propertyKey} failed after ${maxRetries} attempts`,
      );
      throw lastError;
    };

    return descriptor;
  };
}
