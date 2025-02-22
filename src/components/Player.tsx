import { useState } from 'react';
import { TextInput, Button, Paper, Group, NumberInput, Text, List, ScrollArea } from '@mantine/core';

interface PlayerProps {
  initialName: string;
  onNameChange: (name: string) => void;
}

interface ScoreEntry {
  points: number;
  timestamp: Date;
}

export function Player({ initialName, onNameChange }: PlayerProps) {
  const [name, setName] = useState(initialName);
  const [score, setScore] = useState(0);
  const [trackPoints, setTrackPoints] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);

  const handleAddPoints = () => {
    setScore(prev => prev + trackPoints);
    setScoreHistory(prev => [...prev, { points: trackPoints, timestamp: new Date() }]);
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
      
      <ScrollArea h={150} mt="md">
        <List spacing="xs" size="sm" center>
          {scoreHistory.length === 0 ? (
            <Text c="dimmed" ta="center" fz="sm">No points added yet</Text>
          ) : (
            scoreHistory.map((entry, index) => (
              <List.Item key={index}>
                +{entry.points} points ({entry.timestamp.toLocaleTimeString()})
              </List.Item>
            )).reverse()
          )}
        </List>
      </ScrollArea>
    </Paper>
  );
} 