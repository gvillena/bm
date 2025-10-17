import { z } from "zod";

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

export const boundedString = (min: number, max: number, name: string) =>
  z
    .string({ invalid_type_error: `${name} debe ser texto` })
    .min(min, { message: `${name} debe tener al menos ${min} caracteres` })
    .max(max, { message: `${name} debe tener máximo ${max} caracteres` })
    .refine((value: string) => {
      CONTROL_CHARS.lastIndex = 0;
      return !CONTROL_CHARS.test(value);
    }, {
      message: `${name} no puede contener caracteres de control`
    });

export const safeText = (name = "texto seguro") => boundedString(1, 1000, name);
