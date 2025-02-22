interface UIColor {
  name: string;
  background: string;
  button: string;
  text: string;
}

export const colorMap: Record<string, UIColor> = {
  'red': {
    name: 'Red',
    background: '#ff7070',
    button: 'red',
    text: '#ffffff',
  },
  'blue': {
    name: 'Blue',
    background: '#85b4ff',
    button: 'blue',
    text: '#ffffff',
  },
  'green': {
    name: 'Green',
    background: '#95ff85',
    button: 'green',
    text: '#ffffff',
  },
  'yellow': {
    name: 'Yellow',
    background: '#ffff85',
    button: '#FFA909',
    text: '#ffffff',
  },
  'black': {
    name: 'Black',
    background: '#b8b8b8',
    button: 'black',
    text: '#ffffff',
  },
}