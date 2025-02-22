import { useState } from 'react';
import { TextInput, Button, Paper, Group, NumberInput, Text } from '@mantine/core';

interface PlayerProps {
  initialName: string;
  onNameChange: (name: string) => void;
}

export function Player({ initialName, onNameChange }: PlayerProps) {
  const [name, setName] = useState(initialName);
  const [score, setScore] = useState(0);
  const [trackPoints, setTrackPoints] = useState(0);

  const handleAddPoints = () => {
    setScore(prev => prev + trackPoints);
    setTrackPoints(0);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    onNameChange(value);
  };

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Group align="flex-end" mb="md">
        <TextInput
          label="Player Name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          style={{ flex: 1 }}
        />
        <Text size="xl" fw={700} mb={8}>
          Score: {score}
        </Text>
      </Group>
      <Group>
        <NumberInput
          label="Track Points"
          value={trackPoints}
          onChange={(value) => setTrackPoints(Number(value))}
          min={0}
          style={{ flex: 1 }}
        />
        <Button onClick={handleAddPoints} disabled={trackPoints === 0}>
          Add Points
        </Button>
      </Group>
    </Paper>
  );
} 