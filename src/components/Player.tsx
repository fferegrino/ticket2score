import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Paper,
  Group,
  Text,
  List,
  ScrollArea,
  Select,
  ComboboxItem,
  ActionIcon,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import { colorMap } from "../colors";
import { ScoreEntry } from "../ScoreEntry";

interface PlayerProps {
  initialName: string;
  initialColor: string;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onScoreChange: (scoreEntries: ScoreEntry[]) => void;
}

const getStoredHistory = (playerName: string): ScoreEntry[] => {
  const stored = localStorage.getItem(`scoreHistory_${playerName}`);
  if (stored) {
    const parsed = JSON.parse(stored);
    return parsed.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  }
  return [];
};

export function Player({
  initialName,
  initialColor,
  onNameChange,
  onColorChange,
  onScoreChange,
}: PlayerProps) {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [name, setName] = useState(initialName);
  const [trackPoints, setTrackPoints] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>(() =>
    getStoredHistory(initialName),
  );

  useEffect(() => {
    localStorage.setItem(`scoreHistory_${name}`, JSON.stringify(scoreHistory));
    onScoreChange(scoreHistory);
  }, [scoreHistory, name]);

  const handleColorChange = (value: string | null, option: ComboboxItem) => {
    setSelectedColor(value || "");
    onColorChange(value || "");
  };

  const handleAddPoints = () => {
    if (trackPoints > 0) {
      setScoreHistory((prev) => [
        ...prev,
        { points: trackPoints, timestamp: new Date() },
      ]);
      setTrackPoints(0);
    }
  };

  const handleDeleteEntry = (index: number) => {
    modals.openConfirmModal({
      title: "Delete Track",
      children:
        "Are you sure you want to delete this track? This action cannot be undone.",
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        setScoreHistory((prev) => prev.filter((_, i) => i !== index));
      },
    });
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

  const { background, button, text, darker } =
    colorMap[selectedColor] || colorMap["black"];

  return (
    <Paper
      shadow="xs"
      p="md"
      withBorder
      style={{ backgroundColor: background }}
    >
      <Group align="flex-end" mb="md">
        <TextInput
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          styles={{
            root: { flex: 3 },
            input: {
              background: background,
              color: darker,
              border: "none",
              fontWeight: "bold",
              fontSize: "1.5rem",
              padding: "0rem",
            },
          }}
        />
        <Select
          data={[
            { value: "red", label: "Red" },
            { value: "blue", label: "Blue" },
            { value: "green", label: "Green" },
            { value: "yellow", label: "Yellow" },
            { value: "black", label: "Black" },
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
            style={{ backgroundColor: button, color: text }}
          >
            {length}
          </Button>
        ))}
      </Group>
      <Button
        fullWidth
        onClick={handleAddPoints}
        disabled={trackPoints === 0}
        size="xs"
        mb="md"
        style={{
          backgroundColor: button,
          color: text,
          display: trackPoints === 0 ? "none" : "block",
        }}
      >
        +{trackPoints}
      </Button>

      <ScrollArea h={350}>
        <List spacing="xs" size="sm" center>
          {scoreHistory.length === 0 ? (
            <Text ta="center" fz="sm" style={{ color: button }}>
              No tracks added yet
            </Text>
          ) : (
            scoreHistory
              .map((entry, index) => (
                <List.Item
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Group>
                    <Text
                      size="xl"
                      style={{ color: darker, fontWeight: "bold" }}
                    >
                      {entry.points} carts
                    </Text>
                    {/* <Text style={{ color: button }}>
                      ({entry.timestamp.toLocaleTimeString()})
                    </Text> */}
                    <ActionIcon
                      color={button}
                      onClick={() =>
                        handleDeleteEntry(scoreHistory.length - 1 - index)
                      }
                      size="sm"
                    >
                      <IconTrash size="1rem" />
                    </ActionIcon>
                  </Group>
                </List.Item>
              ))
              .reverse()
          )}
        </List>
      </ScrollArea>
    </Paper>
  );
}
