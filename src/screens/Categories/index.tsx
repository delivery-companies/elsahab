import { AppLayout } from "@/components/AppLayout";
import { SimpleCard } from "@/components/SimpleCard";
import { hideChildrenBasedOnRole } from "@/hooks/useAuthorized";
import { useCategory } from "@/hooks/useCategory";
import type { Filters } from "@/services/getEmployeesService";
import { Grid, Pagination } from "@mantine/core";
import { useState } from "react";
import { AddCategory } from "./add-category";
import { DeleteCategory } from "./delete-category";
import { EditCategory } from "./edit-category";

export const Categories = () => {
    const [filters, setFilters] = useState<Filters>({
        page: 1,
        size: 10
    });

    const {
        data: categories = {
            data: [],
            pagesCount: 1,
            page: 1
        },
        isLoading,
        isError
    } = useCategory(filters);

    return (
        <AppLayout isLoading={isLoading} isError={isError}>
            {hideChildrenBasedOnRole(["ADMIN", "ADMIN_ASSISTANT"], <AddCategory />)}
            <Grid gutter="lg">
                {categories.data.map((category) => (
                    <Grid.Col key={category.id} span={{ base: 12, md: 6, lg: 3, sm: 4, xs: 6 }}>
                        <SimpleCard
                            {...category}
                            cardDeleteChildren={<DeleteCategory categoryId={category.id} />}
                            cardEditChildren={
                                <EditCategory categoryId={category.id} title={category.title} />
                            }
                        />
                    </Grid.Col>
                ))}
            </Grid>
            <div className="flex justify-center mt-6">
                <Pagination
                    value={categories.page}
                    onChange={(page) => setFilters({ ...filters, page })}
                    total={categories.pagesCount}
                />
            </div>
        </AppLayout>
    );
};
