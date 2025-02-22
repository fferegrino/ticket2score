import { useState, useEffect } from "react";
import { Container, Title, SimpleGrid, Button, Group } from "@mantine/core";
import { ModalsProvider, modals } from "@mantine/modals";
import { Player } from "./components/Player";
import { Scoreboard } from "./components/Scoreboard";
import { ScoreEntry } from "./ScoreEntry";
import { useMediaQuery } from "@mantine/hooks";

interface PlayerData {
  name: string;
  score: number;
  color: string;
  cartsLeft: number;
}

const MAX_CARTS = 45;

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
    { name: "Player 1", score: 0, color: "black", cartsLeft: MAX_CARTS },
    { name: "Player 2", score: 0, color: "black", cartsLeft: MAX_CARTS },
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
          cartsLeft: MAX_CARTS,
        },
      ]);
    }
  };
  const isMobile = useMediaQuery("(max-width: 1000px)");

  const removePlayer = () => {
    modals.openConfirmModal({
      title: "Remove Player",
      children:
        "Are you sure you want to remove the last player? This action cannot be undone.",
      labels: { confirm: "Remove", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (players.length > 2) {
          setPlayers(players.slice(0, -1));
        }
      },
    });
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
    const usedCarts = scoreEntries.reduce(
      (total, entry) => total + entry.points,
      0,
    );
    newPlayers[index].cartsLeft = MAX_CARTS - usedCarts;
    setPlayers(newPlayers);
  };

  const resetGame = () => {
    modals.openConfirmModal({
      title: "Start New Game",
      children:
        "Are you sure you want to start a new game? All current scores will be reset, but player history will be kept.",
      labels: { confirm: "Start New Game", cancel: "Cancel" },
      confirmProps: { color: "orange" },
      onConfirm: () => {
        setPlayers([
          { name: "Player 1", score: 0, color: "", cartsLeft: MAX_CARTS },
          { name: "Player 2", score: 0, color: "", cartsLeft: MAX_CARTS },
        ]);
      },
    });
  };

  const clearAllData = () => {
    modals.openConfirmModal({
      title: "Clear All Data",
      children:
        "Are you sure you want to clear all data? This will remove all players and their score history. This action cannot be undone.",
      labels: { confirm: "Clear All Data", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        // Clear all player histories
        for (const player of players) {
          localStorage.removeItem(`scoreHistory_${player.name}`);
        }
        // Clear game state
        localStorage.removeItem(STORAGE_KEY);
        // Reset to initial state
        resetGame();
      },
    });
  };

  return (
    <ModalsProvider>
      <Container size="xl" py={isMobile ? "xs" : "xl"}>
        <Scoreboard players={players} />

        <SimpleGrid
          cols={{
            base: players.length,
            sm: players.length,
            md: players.length,
          }}
          spacing={isMobile ? "0" : "md"}
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
    </ModalsProvider>
  );
}

export default App;
