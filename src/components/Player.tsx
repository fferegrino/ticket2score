import { useState, useEffect } from 'react';
import { TextInput, Button, Paper, Group, Text, List, ScrollArea, Select, ComboboxItem, ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

interface PlayerProps {
  initialName: string;
  initialColor: string;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onScoreChange: (score: number) => void;
}

interface ScoreEntry {
  points: number;
  timestamp: Date;
}

const getStoredHistory = (playerName: string): ScoreEntry[] => {
  const stored = localStorage.getItem(`scoreHistory_${playerName}`);
  if (stored) {
    const parsed = JSON.parse(stored);
    return parsed.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    }));
  }
  return [];
};

export function Player({ initialName, initialColor, onNameChange, onColorChange, onScoreChange }: PlayerProps) {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [name, setName] = useState(initialName);
  const [trackPoints, setTrackPoints] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>(() => getStoredHistory(initialName));

  const scoreMap: Record<number, number> = {
    1: 1,
    2: 2,
    3: 4,
    4: 7,
    5: 10,
    6: 15,
  }

  useEffect(() => {
    localStorage.setItem(`scoreHistory_${name}`, JSON.stringify(scoreHistory));
    onScoreChange(scoreHistory.reduce((total, entry) => total + scoreMap[entry.points], 0));
  }, [scoreHistory, name]);

  const handleColorChange = (value: string | null, option: ComboboxItem) => {
    setSelectedColor(value || '');
    onColorChange(value || '');
  };

  const handleAddPoints = () => {
    if (trackPoints > 0) {
      setScoreHistory(prev => [...prev, { points: trackPoints, timestamp: new Date() }]);
      setTrackPoints(0);
    }
  };

  const handleDeleteEntry = (index: number) => {
    setScoreHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleNameChange = (value: string) => {
    const oldName = name;
    setName(value);
    onNameChange(value);
    
    // Move score history to new name key
    const history = localStorage.getItem(`scoreHistory_${oldName}`);
    if (history) {
      localStorage.setItem(`scoreHistory_${value}`, history);
      localStorage.removeItem(`scoreHistory_${oldName}`);
    }
  };

  return (
    <Paper shadow="xs" p="md" withBorder style={{ backgroundColor: selectedColor || 'white' }}>
      <Group align="flex-end" mb="md">
        <TextInput
          label="Player Name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          style={{ flex: 3 }}
        />
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
          value={selectedColor}
          style={{ flex: 2 }}
        />
      </Group>
      <Group mb="md">
        {[1, 2, 3, 4, 5, 6].map((length) => (
          <Button
            key={length}
            variant={trackPoints === length ? "filled" : "light"}
            onClick={() => setTrackPoints(trackPoints === length ? 0 : length)}
            size="xs"
          >
            {length}
          </Button>
        ))}
        <Button 
          onClick={handleAddPoints} 
          disabled={trackPoints === 0}
          size="xs"
        >
          +{trackPoints}
        </Button>
      </Group>
      
      <ScrollArea h={150}>
        <List spacing="xs" size="sm" center>
          {scoreHistory.length === 0 ? (
            <Text c="dimmed" ta="center" fz="sm">No points added yet</Text>
          ) : (
            scoreHistory.map((entry, index) => (
              <List.Item
                key={index}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>+{entry.points} points ({entry.timestamp.toLocaleTimeString()})</span>
                <ActionIcon 
                  color="red" 
                  variant="subtle" 
                  onClick={() => handleDeleteEntry(scoreHistory.length - 1 - index)}
                  size="sm"
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              </List.Item>
            )).reverse()
          )}
        </List>
      </ScrollArea>
    </Paper>
  );
} 