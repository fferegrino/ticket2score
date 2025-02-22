import { useState } from 'react';
import { TextInput, Button, Paper, Group, Text, List, ScrollArea, Select, ComboboxItem } from '@mantine/core';

interface PlayerProps {
  initialName: string;
  initialColor: string;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
}

interface ScoreEntry {
  points: number;
  timestamp: Date;
}

export function Player({ initialName, initialColor, onNameChange, onColorChange }: PlayerProps) {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [name, setName] = useState(initialName);
  const [score, setScore] = useState(0);
  const [trackPoints, setTrackPoints] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);

  const handleColorChange = (value: string | null, option: ComboboxItem) => {
    setSelectedColor(value || '');
    onColorChange(value || '');
  };

  const handleAddPoints = () => {
    if (trackPoints > 0) {
      setScore(prev => prev + trackPoints);
      setScoreHistory(prev => [...prev, { points: trackPoints, timestamp: new Date() }]);
      setTrackPoints(0);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    onNameChange(value);
  };

  return (
    <Paper shadow="xs" p="md" withBorder style={{ backgroundColor: selectedColor || 'white' }}>
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
        <Select
          label="Color"
          data={[
            { value: '#ff7070', label: 'Red' },
            { value: '#85b4ff', label: 'Blue' },
            { value: '#95ff85', label: 'Green' },
            { value: '#ffff85', label: 'Yellow' },
            { value: '#b8b8b8', label: 'Black' },
          ]}
          onChange={handleColorChange}
        />
      </Group>
      
      <Text size="sm" fw={500} mt="md" mb="xs">Track Length:</Text>
      <Group mb="md">
        {[1, 2, 3, 4, 5, 6].map((length) => (
          <Button
            key={length}
            variant={trackPoints === length ? "filled" : "light"}
            onClick={() => setTrackPoints(trackPoints === length ? 0 : length)}
            size="sm"
          >
            {length}
          </Button>
        ))}
        <Button 
          onClick={handleAddPoints} 
          disabled={trackPoints === 0}
          size="sm"
        >
          Add {trackPoints}
        </Button>
      </Group>
      
      <ScrollArea h={150}>
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