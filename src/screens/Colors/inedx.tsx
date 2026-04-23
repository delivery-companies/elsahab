import { AppLayout } from "@/components/AppLayout";
import { SimpleCard } from "@/components/SimpleCard";
import { hideChildrenBasedOnRole } from "@/hooks/useAuthorized";
import { useColors } from "@/hooks/useColors";
import type { Filters } from "@/services/getEmployeesService";
import { Grid, Pagination } from "@mantine/core";
import { useState } from "react";
import { AddColor } from "./add-color";
import { DeleteColor } from "./delete-color";
import { EditColor } from "./edit-color";

export const Colors = () => {
    const [filters, setFilters] = useState<Filters>({
        page: 1,
        size: 10
    });

    const {
        data: colors = {
            data: [],
            pagesCount: 1,
            page: 1
        },
        isLoading,
        isError
    } = useColors(filters);

    return (
        <AppLayout isLoading={isLoading} isError={isError}>
            {hideChildrenBasedOnRole(["ADMIN", "ADMIN_ASSISTANT"], <AddColor />)}
            <Grid gutter="lg">
                {colors.data.map((color) => (
                    <Grid.Col key={color.id} span={{ base: 12, md: 6, lg: 3, sm: 4, xs: 6 }}>
                        <SimpleCard
                            {...color}
                            cardDeleteChildren={<DeleteColor colorId={color.id} />}
                            cardEditChildren={
                                <EditColor colorId={color.id} title={color.title} code={color.code} />
                            }
                        />
                    </Grid.Col>
                ))}
            </Grid>
            <div className="flex justify-center mt-6">
                <Pagination
                    value={colors.page}
                    onChange={(page) => setFilters({ ...filters, page })}
                    total={colors.pagesCount}
                />
            </div>
        </AppLayout>
    );
};
