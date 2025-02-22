import { Table, Paper, Text } from "@mantine/core";
import { colorMap } from "../colors";

interface PlayerScore {
  name: string;
  score: number;
  cartsLeft: number;
  color: string;
}

interface ScoreboardProps {
  players: PlayerScore[];
}

export function Scoreboard({ players }: ScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Paper shadow="xs" p="md" withBorder mb="xl">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Rank</Table.Th>
            <Table.Th>Player</Table.Th>
            <Table.Th ta="right">Score</Table.Th>
            <Table.Th ta="right">Carts Left</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedPlayers.map((player, index) => {
            const { background, button, text, darker } =
              colorMap[player.color] || colorMap["black"];

            return (
              <Table.Tr key={player.name}>
                <Table.Td style={{ backgroundColor: background }}>
                  {index + 1}
                </Table.Td>
                <Table.Td style={{ backgroundColor: background }}>
                  <Text size="md" style={{ color: darker, fontWeight: "bold" }}>
                    {player.name}
                  </Text>
                </Table.Td>
                <Table.Td ta="right" style={{ backgroundColor: background }}>
                  <Text size="xl" style={{ color: darker, fontWeight: "bold" }}>
                    {player.score}
                  </Text>
                </Table.Td>
                <Table.Td ta="right" style={{ backgroundColor: background }}>
                  <Text size="md" style={{ color: darker, fontWeight: "bold" }}>
                    {player.cartsLeft}
                  </Text>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
