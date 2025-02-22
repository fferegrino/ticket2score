import { Table, Paper, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const textSize = isMobile ? "xs" : "md";
  return (
    <Paper
      shadow="xs"
      p={isMobile ? "0" : "md"}
      withBorder={isMobile ? false : true}
      mb={isMobile ? "0" : "xl"}
    >
      <Table style={{ borderBottom: isMobile ? "1px solid #000" : "none" }}>
        <Table.Thead
          style={{ display: isMobile ? "none" : "table-header-group" }}
        >
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
                  <Text
                    size={textSize}
                    style={{ color: darker, fontWeight: "bold" }}
                  >
                    {player.name}
                  </Text>
                </Table.Td>
                <Table.Td ta="right" style={{ backgroundColor: background }}>
                  <Text
                    size={textSize}
                    style={{ color: darker, fontWeight: "bold" }}
                  >
                    {player.score}
                  </Text>
                </Table.Td>
                <Table.Td ta="right" style={{ backgroundColor: background }}>
                  <Text
                    size={textSize}
                    style={{ color: darker, fontWeight: "bold" }}
                  >
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
