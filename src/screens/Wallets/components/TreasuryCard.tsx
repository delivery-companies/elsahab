import {
  Center,
  Grid,
  Group,
  type MantineColor,
  Paper,
  RingProgress,
  Skeleton,
  Text,
  rem,
} from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";

interface ITreasuryCard {
  isLoading: boolean;
  value: number;
  title: string;
  color?: MantineColor;
}

export const TreasuryCard = ({
  isLoading,
  value,
  title,
  color = "violet",
}: ITreasuryCard) => {
  return (
    <Grid.Col className="" span={{ sm: 12, xs: 6, md: 4 }}>
      {isLoading ? (
        <Skeleton height="100%" />
      ) : (
        <Paper withBorder radius="md" p="xs">
          <Group>
            <RingProgress
              size={80}
              roundCaps
              thickness={8}
              sections={[{ value: 65, color }]}
              label={
                <Center>
                  <IconArrowUpRight
                    style={{ width: rem(20), height: rem(20) }}
                    stroke={1.5}
                  />
                </Center>
              }
            />

            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                {title}
              </Text>
              <Text fw={700} size="xl">
                {value.toLocaleString()}
              </Text>
            </div>
          </Group>
        </Paper>
      )}
    </Grid.Col>
  );
};
