import { createTamagui, createTokens } from 'tamagui';
import { createMedia } from '@tamagui/react-native-media-driver';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';

const appTokens = createTokens({
  ...tokens,
  color: {
    ...tokens.color,
    green8: '#48d22b',
    blue8: '#007bff',
    gray8: '#333333',
    background: '#ffffff',
  },
});

const config = createTamagui({
  tokens: appTokens,
  themes,
  media: createMedia({
    sm: { maxWidth: 860 },
    gtSm: { minWidth: 860 },
  }),
  shorthands,
});

export default config;