import { AppLayout } from "@/components/AppLayout";
import { SimpleCard } from "@/components/SimpleCard";
import { hideChildrenBasedOnRole } from "@/hooks/useAuthorized";
import { useSizes } from "@/hooks/useSizes";
import type { Filters } from "@/services/getEmployeesService";
import { Grid, Pagination } from "@mantine/core";
import { useState } from "react";
import { AddSize } from "./add-size";
import { DeleteSize } from "./delete-size";
import { EditSize } from "./edit-size";

export const Sizes = () => {
    const [filters, setFilters] = useState<Filters>({
        page: 1,
        size: 10
    });

    const {
        data: sizes = {
            data: [],
            pagesCount: 1,
            page: 1
        },
        isLoading,
        isError
    } = useSizes(filters);

    return (
        <AppLayout isLoading={isLoading} isError={isError}>
            {hideChildrenBasedOnRole(["ADMIN", "ADMIN_ASSISTANT"], <AddSize />)}
            <Grid gutter="lg">
                {sizes.data.map((size) => (
                    <Grid.Col key={size.id} span={{ base: 12, md: 6, lg: 3, sm: 4, xs: 6 }}>
                        <SimpleCard
                            {...size}
                            cardEditChildren={<EditSize sizeId={size.id} title={size.title} />}
                            cardDeleteChildren={<DeleteSize sizeId={size.id} />}
                        />
                    </Grid.Col>
                ))}
            </Grid>
            <div className="flex justify-center mt-6">
                <Pagination
                    value={sizes.page}
                    onChange={(page) => setFilters({ ...filters, page })}
                    total={sizes.pagesCount}
                />
            </div>
        </AppLayout>
    );
};
