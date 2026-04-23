export const StatisticsItem = ({
    title,
    value
}: {
    title: string;
    value: number;
}) => {
    return (
        <div className="flex flex-col items-start justify-start space-y-2 w-full border p-2 rounded-md bg-background">
            <p className="text-md">{title}</p>
            <p className="text-2xl font-bold text-center">{value?.toLocaleString() || 0}</p>
        </div>
    );
};
