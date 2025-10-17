import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormProps, type UseFormReturn } from "react-hook-form";
import { z, type ZodType } from "zod";

export type UseZodFormOptions<TSchema extends ZodType> = Omit<UseFormProps<z.infer<TSchema>>, "resolver"> & {
  schema: TSchema;
};

export function useZodForm<TSchema extends ZodType>({ schema, ...rest }: UseZodFormOptions<TSchema>): UseFormReturn<
  z.infer<TSchema>
> {
  return useForm<z.infer<TSchema>>({
    ...rest,
    resolver: zodResolver(schema)
  });
}
