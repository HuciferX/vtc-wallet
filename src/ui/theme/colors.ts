// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  white: '#e8eaf6',
  white_muted: 'rgba(232, 234, 246, 0.5)',
  white_muted2: 'rgba(232, 234, 246, 0.2)',
  white_muted3: 'rgba(232, 234, 246, 0.8)',
  black: '#08081e',
  black_muted: 'rgba(8, 8, 30, 0.5)',
  black_muted2: 'rgba(8, 8, 30, 0.3)',

  dark: '#0c0c28',
  grey: '#495361',
  light: '#A2A4AA',

  black_dark: '#101035',

  green_dark2: '#1b5e20',
  green_dark: '#2e7d32',
  green: '#00e676',
  green_light: '#66bb6a',

  yellow_dark: '#d5ac00',
  yellow: '#ffd700',
  yellow_light: '#fcd226',

  red_dark: '#c92b40',
  red: '#ff5252',
  red_light: '#f05266',
  red_light2: '#f55454',

  blue_dark: '#1461d1',
  blue: '#1872F6',
  blue_light: '#c6dcfd',

  orange_dark: '#d9691c',
  orange: '#ff9800',
  orange_light: '#ffb74d',
  orange_light2: '#FF7C2A',

  gold: '#ffd700',

  cyan: '#00e5ff',
  purple: '#b47aff'
};

export const colors = Object.assign({}, palette, {
  transparent: 'rgba(0, 0, 0, 0)',

  text: palette.white,
  textWhite: palette.white_muted2,

  textDim: palette.white_muted,

  background: '#08081e',

  error: '#ff5252',

  danger: 'rgba(255, 82, 82, 0.90)',

  card: 'rgba(12, 12, 40, 0.92)',
  warning: palette.orange,
  primary: palette.cyan,

  bg2: '#0c0c28',
  bg3: '#101035',
  bg4: '#181840',
  search_bar_bg: '#0c0c28',

  border: 'rgba(80, 80, 160, 0.25)',
  border2: 'rgba(80, 80, 160, 0.4)',

  icon_yellow: '#ffd700',

  brc20_deploy: '#233933',
  brc20_transfer: '#375e4d',
  brc20_transfer_selected: '#41B530',
  brc20_other: '#3e3e3e',

  value_up_color: '#4DA474',
  value_down_color: '#BF3F4D',

  ticker_color: '#eac249',
  ticker_color2: 'rgba(255, 255, 255, 0.85)',

  success: '#7BE098',

  txid_color: '#2AB2F8',

  cat20_color: '#77A1F2',

  warning_content: '#F4B62CD9',

  warning_bg: '#F4B62C59',
  line: 'rgba(255,255,255,0.15)',
  line2: 'rgba(255,255,255,0.3)'
});

export type ColorTypes = keyof typeof colors;
