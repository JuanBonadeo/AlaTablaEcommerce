/**
 * Utility to verify if a value is a plain object
 */
function isPlainObject(value: unknown): boolean {
    return typeof value === 'object' && value !== null && value.constructor === Object;
}

/**
 * Recursively converts Date objects in an object (or array of objects) to ISO strings.
 * Used to ensure data passed from Server Components to Client Components is serializable.
 */
export function serializeDates<T>(data: T): T {
    if (data === null || data === undefined) {
        return data;
    }

    // Handle Date objects
    if (data instanceof Date) {
        return data.toISOString() as unknown as T;
    }

    // Handle Arrays
    if (Array.isArray(data)) {
        return data.map((item) => serializeDates(item)) as unknown as T;
    }

    // Handle Plain Objects
    if (isPlainObject(data)) {
        const newObj: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                newObj[key] = serializeDates((data as any)[key]);
            }
        }
        return newObj as T;
    }

    // Return primitives as is
    return data;
}
