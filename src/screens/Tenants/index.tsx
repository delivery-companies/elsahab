import { AppLayout } from "@/components/AppLayout";
import { useTenants } from "@/hooks/useTenants";
import type { Filters } from "@/services/getEmployeesService";
import { Button, Grid, Pagination } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomTenantCard } from "./tenant-card";

export const TenantsScreen = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<Filters>({
        page: 1,
        size: 10
    });
    const {
        data: tenants = {
            data: [],
            pagesCount: 0,
            page: 0
        },
        isError,
        isLoading
    } = useTenants(filters);
    return (
        <AppLayout isLoading={isLoading} isError={isError}>
            <div className="flex mb-6 items-center gap-6">
                <Button
                    onClick={() => {
                        navigate("/tenants/add");
                    }}
                    size="lg"
                    variant="outline"
                >
                    اضافة شركة
                </Button>
            </div>
            <Grid gutter="md">
                {tenants.data.map((tenant) => (
                    <Grid.Col key={tenant.id} span={{ base: 12, md: 6, lg: 4, xs: 12, xl: 3, sm: 6 }}>
                        <CustomTenantCard {...tenant} />
                    </Grid.Col>
                ))}
            </Grid>
            <div className="flex justify-center mt-10">
                <Pagination
                    total={tenants.pagesCount}
                    value={tenants.page}
                    onChange={(page) => setFilters({ ...filters, page })}
                />
            </div>
        </AppLayout>
    );
};
