import { useState } from 'react'
import { Container, Title, SimpleGrid, Button, Group } from '@mantine/core'
import { Player } from './components/Player'

function App() {
  const [players, setPlayers] = useState(['Player 1', 'Player 2']);

  const addPlayer = () => {
    if (players.length < 5) {
      setPlayers([...players, `Player ${players.length + 1}`]);
    }
  };

  const removePlayer = () => {
    if (players.length > 2) {
      setPlayers(players.slice(0, -1));
    }
  };

  const handleNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  return (
    <Container size="xl" py="xl">
      <Title ta="center" mb="xl">
        Ticket to Ride Score Tracker
      </Title>

      <Group justify="center" mb="xl">
        <Button onClick={addPlayer} disabled={players.length >= 5}>
          Add Player
        </Button>
        <Button onClick={removePlayer} disabled={players.length <= 2} color="red">
          Remove Player
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {players.map((player, index) => (
          <Player
            key={index}
            initialName={player}
            onNameChange={(name) => handleNameChange(index, name)}
          />
        ))}
      </SimpleGrid>
    </Container>
  )
}

export default App
