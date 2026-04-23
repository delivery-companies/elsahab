import { AppLayout } from "@/components/AppLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/store/authStore";
import { useSearchParams } from "react-router-dom";
import { IncomingOrdersStatistics } from "./Repositories";
import { Orders } from "./Orders";
import { RepositoryReports } from "./Reports";

export const ExportedOrders = () => {
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
      {!repo && !reportsRepo && mainRepository ? (
        <IncomingOrdersStatistics />
      ) : reportsRepo && mainRepository && type === "RETURN" ? (
        <RepositoryReports
          key={"reports"}
          setRepo={() => {
            setReportsRepo(undefined);
          }}
          repo={reportsRepo}
        />
      ) : (
        <Orders
          setRepo={() => {
            setRepo(undefined);
          }}
          repo={repo}
        />
      )}
    </AppLayout>
  );
};
