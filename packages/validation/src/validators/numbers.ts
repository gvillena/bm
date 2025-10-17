import { z } from "zod";

export const nonNegativeInt = (name: string) =>
  z
    .number({ invalid_type_error: `${name} debe ser numérico` })
    .int({ message: `${name} debe ser entero` })
    .min(0, { message: `${name} debe ser >= 0` });

export const percentage = (name = "porcentaje") =>
  z
    .number({ invalid_type_error: `${name} debe ser numérico` })
    .min(0, { message: `${name} debe ser >= 0` })
    .max(100, { message: `${name} debe ser <= 100` });
