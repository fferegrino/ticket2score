import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Paper,
  Group,
  Text,
  List,
  ScrollArea,
  ActionIcon,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { colorMap } from "../colors";
import { ScoreEntry } from "../ScoreEntry";

interface PlayerProps {
  initialName: string;
  initialColor: string;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onScoreChange: (scoreEntries: ScoreEntry[]) => void;
}

const BUTTONS = [1, 2, 3, 4, 5, 6];

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

const COLORS = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "black", label: "Black" },
];

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

  const isMobile = useMediaQuery("(max-width: 1000px)");
  const isSmallerMobile = useMediaQuery("(max-width: 500px)");

  useEffect(() => {
    localStorage.setItem(`scoreHistory_${name}`, JSON.stringify(scoreHistory));
    onScoreChange(scoreHistory);
  }, [scoreHistory, name]);

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

  const handleNextColor = () => {
    const currentIndex = COLORS.findIndex(
      (color) => color.value === selectedColor,
    );
    const nextIndex = (currentIndex + 1) % COLORS.length;
    setSelectedColor(COLORS[nextIndex].value);
    onColorChange(COLORS[nextIndex].value);
  };

  const handlePreviousColor = () => {
    const currentIndex = COLORS.findIndex(
      (color) => color.value === selectedColor,
    );
    const previousIndex = (currentIndex - 1 + COLORS.length) % COLORS.length;
    setSelectedColor(COLORS[previousIndex].value);
    onColorChange(COLORS[previousIndex].value);
  };

  const { background, button, text, darker } =
    colorMap[selectedColor] || colorMap["black"];

  const chunkedButtons = BUTTONS.reduce((acc, button, index) => {
    const chunkIndex = Math.floor(index / (isSmallerMobile ? 2 : 3));
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(button);
    return acc;
  }, [] as number[][]);

  return (
    <Paper
      shadow={isMobile ? "none" : "xs"}
      p={isMobile ? "xs" : "md"}
      radius={isMobile ? "none" : "md"}
      withBorder={isMobile ? false : true}
      style={{ backgroundColor: background }}
    >
      <TextInput
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        mb={isMobile ? "xs" : "xs"}
        styles={{
          root: { flex: 3 },
          input: {
            background: background,
            color: darker,
            border: "none",
            fontWeight: "bold",
            fontSize: isMobile ? "1rem" : "1.5rem",
            padding: "0rem",
          },
        }}
      />
      <Button.Group
        mb={isMobile ? "xs" : "xs"}
        style={{ display: isSmallerMobile || isMobile ? "none" : "block" }}
      >
        {BUTTONS.map((length) => (
          <Button

            key={length}
            variant={trackPoints === length ? "filled" : "light"}
            onClick={() => setTrackPoints(trackPoints === length ? 0 : length)}
            size="xs"
            style={{
              backgroundColor: button,
              color: text,
              fontSize: isMobile ? "0.75rem" : "1rem",
              padding: isMobile ? "0.5rem" : "0.5rem",
            }}
          >
            {length}
          </Button>
        ))}
      </Button.Group>
      <Group
        mb={isMobile ? "xs" : "xs"}
        gap="2"
        align="center"
        justify="center"
        style={{ display: isSmallerMobile || isMobile ? "flex" : "none" }}
      >
        {chunkedButtons.map((chunk, index) => (
          <Button.Group key={index}>
            {chunk.map((length) => (
              <Button
                key={length}
                variant={trackPoints === length ? "filled" : "light"}
                onClick={() =>
                  setTrackPoints(trackPoints === length ? 0 : length)
                }
                size="xs"
                style={{
                  backgroundColor: button,
                  color: text,
                  fontSize: isMobile ? "0.75rem" : "1rem",
                  padding: isMobile ? "0.5rem" : "0.5rem",
                }}
              >
                {length}
              </Button>
            ))}
          </Button.Group>
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
              No tracks
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
                      size={isMobile ? "sm" : "xl"}
                      style={{ color: darker, fontWeight: "bold" }}
                      onClick={() =>
                        handleDeleteEntry(scoreHistory.length - 1 - index)
                      }
                    >
                      {entry.points} carts
                    </Text>
                    <ActionIcon
                      hidden={isMobile}
                      style={{ display: isMobile ? "none" : "block" }}
                      color={button}
                      onClick={() =>
                        handleDeleteEntry(scoreHistory.length - 1 - index)
                      }
                      size="xs"
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
      <Group>
        <ActionIcon
          size={isMobile ? "xs" : "lg"}
          variant="subtle"
          onClick={handlePreviousColor}
          style={{ color: button }}
        >
          <IconChevronLeft />
        </ActionIcon>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            color: darker,
            display: isMobile ? "none" : "block",
          }}
        >
          {COLORS.find((color) => color.value === selectedColor)?.label}
        </Text>
        <ActionIcon
          size={isMobile ? "xs" : "lg"}
          variant="subtle"
          onClick={handleNextColor}
          style={{ color: button }}
        >
          <IconChevronRight />
        </ActionIcon>
      </Group>
    </Paper>
  );
}
