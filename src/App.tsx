import { useState, useEffect } from "react";
import { Container, Title, SimpleGrid, Button, Group } from "@mantine/core";
import { Player } from "./components/Player";
import { Scoreboard } from "./components/Scoreboard";
import { ScoreEntry } from "./ScoreEntry";

interface PlayerData {
  name: string;
  score: number;
  color: string;
}

const scoreMap: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 10,
  6: 15,
};

const STORAGE_KEY = "ticketToRideState";

const getInitialState = (): PlayerData[] => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    return JSON.parse(savedState);
  }
  return [
    { name: "Player 1", score: 0, color: "black" },
    { name: "Player 2", score: 0, color: "black" },
  ];
};

function App() {
  const [players, setPlayers] = useState<PlayerData[]>(getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  }, [players]);

  const addPlayer = () => {
    if (players.length < 5) {
      setPlayers([
        ...players,
        {
          name: `Player ${players.length + 1}`,
          score: 0,
          color: "black",
        },
      ]);
    }
  };

  const removePlayer = () => {
    if (players.length > 2) {
      setPlayers(players.slice(0, -1));
    }
  };

  const handleNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const handleColorChange = (index: number, color: string) => {
    const newPlayers = [...players];
    newPlayers[index].color = color;
    setPlayers(newPlayers);
  };

  const handleScoreChange = (index: number, scoreEntries: ScoreEntry[]) => {
    const newPlayers = [...players];
    newPlayers[index].score = scoreEntries.reduce(
      (total, entry) => total + scoreMap[entry.points],
      0,
    );
    setPlayers(newPlayers);
  };

  const resetGame = () => {
    setPlayers([
      { name: "Player 1", score: 0, color: "" },
      { name: "Player 2", score: 0, color: "" },
    ]);
  };

  const clearAllData = () => {
    // Clear all player histories
    for (const player of players) {
      localStorage.removeItem(`scoreHistory_${player.name}`);
    }
    // Clear game state
    localStorage.removeItem(STORAGE_KEY);
    // Reset to initial state
    resetGame();
  };

  return (
    <Container size="xl" py="xl">
      <Scoreboard players={players} />

      <SimpleGrid
        cols={{ base: 1, sm: 2, md: players.length }}
        spacing="md"
        mb="xl"
      >
        {players.map((player, index) => (
          <Player
            key={index}
            initialName={player.name}
            initialColor={player.color}
            onNameChange={(name) => handleNameChange(index, name)}
            onColorChange={(color) => handleColorChange(index, color)}
            onScoreChange={(score) => handleScoreChange(index, score)}
          />
        ))}
      </SimpleGrid>

      <Group justify="center" gap="md">
        <Group>
          <Button onClick={addPlayer} disabled={players.length >= 5}>
            Add Player
          </Button>
          <Button
            onClick={removePlayer}
            disabled={players.length <= 2}
            color="red"
          >
            Remove Player
          </Button>
        </Group>
        <Group>
          <Button onClick={resetGame} color="orange">
            New Game
          </Button>
          <Button onClick={clearAllData} color="red" variant="outline">
            Clear All Data
          </Button>
        </Group>
      </Group>
    </Container>
  );
}

export default App;
