import { useState } from 'react'
import { Container, Title, SimpleGrid, Button, Group } from '@mantine/core'
import { Player } from './components/Player'
import { Scoreboard } from './components/Scoreboard'

interface PlayerData {
  name: string;
  score: number;
  color: string;
}

function App() {
  const [players, setPlayers] = useState<PlayerData[]>([
    { name: 'Player 1', score: 0, color: '' },
    { name: 'Player 2', score: 0, color: '' }
  ]);

  const addPlayer = () => {
    if (players.length < 5) {
      setPlayers([...players, { 
        name: `Player ${players.length + 1}`, 
        score: 0,
        color: ''
      }]);
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

  const handleScoreChange = (index: number, score: number) => {
    const newPlayers = [...players];
    newPlayers[index].score = score;
    setPlayers(newPlayers);
  };

  return (
    <Container size="xl" py="xl">
      <Title ta="center" mb="xl">
        Ticket to Ride Score Tracker
      </Title>

      <Scoreboard players={players} />

      <Group justify="center" mb="xl">
        <Button onClick={addPlayer} disabled={players.length >= 5}>
          Add Player
        </Button>
        <Button onClick={removePlayer} disabled={players.length <= 2} color="red">
          Remove Player
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: players.length }} spacing="md">
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
    </Container>
  )
}

export default App
