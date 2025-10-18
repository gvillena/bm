import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type FieldValues,
  type Resolver,
  type UseFormProps,
  type UseFormReturn
} from "react-hook-form";
import { z, type ZodTypeAny } from "zod";

type ZodFormValues<TSchema extends ZodTypeAny> = z.infer<TSchema> & FieldValues;

export type UseZodFormOptions<TSchema extends ZodTypeAny> = Omit<
  UseFormProps<ZodFormValues<TSchema>>,
  "resolver"
> & {
  schema: TSchema;
};

export function useZodForm<TSchema extends ZodTypeAny>(
  { schema, ...rest }: UseZodFormOptions<TSchema>
): UseFormReturn<ZodFormValues<TSchema>> {
  const resolver = zodResolver(schema as unknown as never) as unknown as Resolver<
    ZodFormValues<TSchema>
  >;

  return useForm<ZodFormValues<TSchema>>({
    ...(rest as UseFormProps<ZodFormValues<TSchema>>),
    resolver
  }) as UseFormReturn<ZodFormValues<TSchema>>;
}
