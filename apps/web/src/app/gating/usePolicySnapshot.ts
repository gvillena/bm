import { useQuery } from "@tanstack/react-query";
import { fetchPolicySnapshot } from "@services/policies";

export function usePolicySnapshot() {
  return useQuery({
    queryKey: ["policySnapshot"],
    queryFn: fetchPolicySnapshot,
    staleTime: 5 * 60 * 1000
  });
}
