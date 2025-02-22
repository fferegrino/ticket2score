interface UIColor {
  name: string;
  background: string;
  button: string;
  darker: string;
  text: string;
}

export const colorMap: Record<string, UIColor> = {
  red: {
    name: "Red",
    background: "#FFCCCC",
    button: "red",
    darker: "#832E2E",
    text: "#ffffff",
  },
  blue: {
    name: "Blue",
    background: "#85b4ff",
    button: "blue",
    darker: "#234482",
    text: "#ffffff",
  },
  green: {
    name: "Green",
    background: "#95ff85",
    button: "green",
    darker: "#365C30",
    text: "#ffffff",
  },
  yellow: {
    name: "Yellow",
    background: "#ffff85",
    button: "#FFA909",
    darker: "#5C5C30",
    text: "#ffffff",
  },
  black: {
    name: "Black",
    background: "#b8b8b8",
    button: "black",
    darker: "#333333",
    text: "#ffffff",
  },
};
