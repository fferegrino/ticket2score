import { Table, Paper, Text } from '@mantine/core';

interface PlayerScore {
  name: string;
  score: number;
  color: string;
}

interface ScoreboardProps {
  players: PlayerScore[];
}

export function Scoreboard({ players }: ScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Paper shadow="xs" p="md" withBorder mb="xl">
      <Text size="xl" fw={700} ta="center" mb="md">
        Scoreboard
      </Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Rank</Table.Th>
            <Table.Th>Player</Table.Th>
            <Table.Th ta="right">Score</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedPlayers.map((player, index) => (
            <Table.Tr key={player.name}>
              <Table.Td style={{ backgroundColor: player.color || 'inherit' }}>{index + 1}</Table.Td>
              <Table.Td style={{ backgroundColor: player.color || 'inherit' }}>
                <Text>
                  {player.name}
                </Text>
              </Table.Td>
              <Table.Td ta="right" style={{ backgroundColor: player.color || 'inherit' }}>
                {player.score}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
} 