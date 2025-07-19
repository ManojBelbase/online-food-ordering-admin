// import { ZodType } from "zod";

// export function validateFunction<T>(values: T, schema: ZodType<T>): Record<string, string> {
//   const result = schema.safeParse(values);
//   if (result.success) return {};

//   const errors: Record<string, string> = {};

//   result.error.errors.forEach((err) => {
//     const path = err.path.join(".");
//     errors[path] = err.message;
//   });

//   return errors;
// }
