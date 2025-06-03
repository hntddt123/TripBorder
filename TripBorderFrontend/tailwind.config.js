export default {
  darkMode: 'selector',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-right': 'env(safe-area-inset-right)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
      },
      colors: {
        primary: {
          light: 'rgba(225, 255, 180,0.3)',
          dark: '#171717',
          titleLight: '#fcd34d',
          titleDark: 'rgba(0,0,0,0.7)',
          cardLight: 'rgba(250,190,30,0.3)',
          cardDark: 'rgba(0,0,0,0.7)',
          buttonLight: '#fcd34d',
          buttonDark: 'rgb(255,135,30)',
          buttonLightHover: 'rgb(250,190,35)',
          buttonDarkHover: '#dd7700',
          buttonLightActive: '#fcd34d',
          buttonDarkActive: '##b45309',
          buttonDarkTransparent: 'rgba(0,0,0,0.7)',
          buttonDarkTransparentHover: 'rgba(0,0,0,0.8)',
          buttonDarkTransparentActive: 'rgba(0,0,0,0.9)',
          googleDark: '#131314',
          googleTextWhite: '#1f1f1f',
          googleTextDark: '#e3e3e3',
          googleBorderLight: '#1f1f1f1f',
          googleBorderDark: '#8e918f',
          googleBorderDisabledDark: '#8e918f1f',
          googleDisabledLight: '#ffffff61',
          googleDisabledDark: '#13131461',
          googlefocus: '#303030'
        },
      },
    },
    plugins: [],
  }
};
