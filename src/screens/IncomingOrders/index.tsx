import { AppLayout } from "@/components/AppLayout";
import { IncomingOrdersStatistics } from "./Repositories";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IncomingRepoOrders } from "./Orders/index.tsx";
import { useAuth } from "@/store/authStore.ts";
import { RepositoryReports } from "./Reports/index.tsx";

export const IncomingOrders = () => {
  const { mainRepository, type } = useAuth();
  const [params] = useSearchParams();
  const [repo, setRepo] = useState<string | undefined | null>(undefined);
  const [reportsRepo, setReportsRepo] = useState<string | undefined | null>(
    undefined,
  );

  useEffect(() => {
    const repoParam = params.get("repo");
    const reportsRepoParam = params.get("reportsRepo");

    if (repoParam !== null) {
      setRepo(repoParam);
    }
    if (reportsRepoParam !== null) {
      setReportsRepo(reportsRepoParam);
    }
  }, [params]);

  return (
    <AppLayout>
      {!repo && !reportsRepo && mainRepository && type === "RETURN" ? (
        <IncomingOrdersStatistics key={"repos"} />
      ) : reportsRepo && mainRepository && type === "RETURN" ? (
        <RepositoryReports
          key={"reports"}
          setRepo={() => {
            setReportsRepo(undefined);
          }}
          repo={reportsRepo}
        />
      ) : (
        <IncomingRepoOrders
          key={"orders"}
          setRepo={() => {
            setRepo(undefined);
          }}
          repo={repo}
        />
      )}
    </AppLayout>
  );
};
