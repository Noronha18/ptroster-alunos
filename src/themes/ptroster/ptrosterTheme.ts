// Tema Astryx do PTRoster: grafite escuro com acento lima "volt".
// O app é só escuro (uso em academia), então cada token tem um valor único.
// Depois de editar: npx astryx theme build src/themes/ptroster/ptrosterTheme.ts
// Mantenha as cores em sincronia com o bloco @theme de src/index.css.
import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

export const ptrosterTheme = defineTheme({
  name: 'ptroster',
  extends: neutralTheme,
  tokens: {
    '--color-background-body': '#0B0C0E',
    '--color-background-surface': '#15171A',
    '--color-background-card': '#15171A',
    '--color-background-popover': '#1E2125',
    '--color-background-muted': '#1E2125',

    '--color-accent': '#C8FF2E',
    '--color-accent-muted': '#2B3610',
    '--color-on-accent': '#0B0C0E',
    '--color-text-accent': '#C8FF2E',
    '--color-icon-accent': '#C8FF2E',

    '--color-text-primary': '#F4F5F6',
    '--color-text-secondary': '#A3A9B1',
    '--color-text-disabled': '#5C636B',
    '--color-icon-primary': '#F4F5F6',
    '--color-icon-secondary': '#A3A9B1',

    '--color-border': '#2A2E33',
    '--color-border-emphasized': '#3D434A',

    '--color-success': '#C8FF2E',
    '--color-on-success': '#0B0C0E',
    '--color-warning': '#FF8A3D',
    '--color-on-warning': '#0B0C0E',
    '--color-error': '#FF5A52',
    '--color-on-error': '#0B0C0E',
  },
});
