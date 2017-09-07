export const COLOR_FILTERS = [
  {
    name: 'sky-blue',
    term: 'sky blue',
    buttonColor: '#71d5f8',
    queries: ["#00ffff","#7fffd4","#00ffff","#87cefa","#66cdaa","#00fa9a","#48d1cc","#87ceeb","#00ff7f","#40e0d0"]
  },
  {
    name: 'ultramarine-blue',
    term: 'ultramarine blue',
    buttonColor: '#3C7CF6',
    queries: ["#8a2be2","#6495ed","#00ced1","#00bfff","#1e90ff","#20b2aa","#9370db","#7b68ee","#4169e1","#6a5acd","#4682b4"]
  },
  {
    name: 'medium-blue',
    term: 'medium blue',
    buttonColor: '#0F48AF',
    queries: ["#0000ff","#008b8b","#0000cd","#008080"]
  },
  {
    name: 'dark-blue',
    term: 'dark blue',
    buttonColor: '#192A72',
    queries: ["#00008b","#483d8b","#191970","#000080"]
  },
  {
    name: 'violet',
    term: 'violet',
    buttonColor: '#211346',
    queries: ['#483d8b']
  },
  {
    name: 'teal',
    term: 'teal',
    buttonColor: '#0E4349',
    queries: ['#2f4f4f']
  },
  {
    name: 'green',
    term: 'green',
    buttonColor: '#0F4223',
    queries: ["#006400","#008000"]
  },
  {
    name: 'leaf-green',
    term: 'leaf green',
    buttonColor: '#58871F',
    queries: ["#556b2f","#228b22","#00ff00","#32cd32","#808000","#6b8e23","#2e8b57"]
  },
  {
    name: 'light-green',
    term: 'light green',
    buttonColor: '#9AC12D',
    queries: ["#7fff00","#bdb76b","#adff2f","#7cfc00","#9acd32"]
  },
  {
    name: 'yellow',
    term: 'yellow',
    buttonColor: '#FFFC23',
    queries: ["#ffd700","#ffff00"]
  },
  {
    name: 'orange',
    term: 'orange',
    buttonColor: '#E69C17',
    queries: ["#b8860b","#ff8c00","#e9967a","#daa520","#f08080","#ffa07a","#ffa500","#cd853f","#f4a460"]
  },
  {
    name: 'dark-orange',
    term: 'dark orange',
    buttonColor: '#EB6915',
    queries: ["#d2691e","#ff7f50","#fa8072","#ff6347"]
  },
  {
    name: 'vermilion',
    term: 'vermilion',
    buttonColor: '#D8440E',
    queries: ["#ff4500","#8b4513","#a0522d"]
  },
  {
    name: 'red',
    term: 'red',
    buttonColor: '#CD130E',
    queries: ["#a52a2a","#dc143c","#8b0000","#b22222","#ff0000"]
  },
  {
    name: 'fuchsia',
    term: 'fuchsia',
    buttonColor: '#9D3469',
    queries: ["#8b008b","#9932cc","#9400d3","#ff1493","#ff00ff","#cd5c5c","#ff00ff","#ba55d3","#c71585","#db7093"]
  },
  {
    name: 'purple',
    term: 'purple',
    buttonColor: '#6B2056',
    queries: ["#4b0082","#800080","#663399"]
  },
  {
    name: 'dark-purple',
    term: 'dark purple',
    buttonColor: '#541439',
    queries: ['#800000']
  },
  {
    name: 'dark-grey',
    term: 'dark grey',
    buttonColor: '#6E6E6E',
    queries: ["#5f9ea0","#8fbc8f","#696969","#808080","#778899","#3cb371","#bc8f8f","#708090","#000000"]
  },
  {
    name: 'light-grey',
    term: 'light grey',
    buttonColor: '#DCDCDC',
    queries: ["#ffe4c4","#deb887","#a9a9a9","#dcdcdc","#ff69b4","#f0e68c","#add8e6","#d3d3d3","#90ee90","#ffb6c1","#b0c4de","#ffe4b5","#ffdead","#da70d6","#eee8aa","#98fb98","#afeeee","#ffdab9","#ffc0cb","#dda0dd","#b0e0e6","#c0c0c0","#d2b48c","#d8bfd8","#ee82ee","#f5deb3"]
  },
  {
    name: 'pale-grey',
    term: 'pale grey',
    buttonColor: '#F0F0F0',
    queries: ["#f0f8ff","#faebd7","#f0ffff","#f5f5dc","#ffebcd","#fff8dc","#fffaf0","#f8f8ff","#f0fff0","#fffff0","#e6e6fa","#fff0f5","#fffacd","#e0ffff","#fafad2","#ffffe0","#faf0e6","#f5fffa","#ffe4e1","#fdf5e6","#ffefd5","#fff5ee","#fffafa","#ffffff","#f5f5f5"]
  },
];

export const LINE_FILTERS = {
  composition: [
    {
      name: 'vertical',
      svgId: 'line_vertical'
    },
    {
      name: 'diagonal',
      svgId: 'line_diagonal'
    },
    {
      name: 'horizontal',
      svgId: 'line_horizontal'
    },
    {
      name: 'curvy',
      svgId: 'line_curvy'
    }
  ],
  linearity: [
    {
      name: 'broken',
      svgId: 'lines_broken'
    },
    {
      name: 'unbroken',
      svgId: 'lines_unbroken'
    },
    {
      name: 'all types',
      svgId: 'lines_alltypes'
    }
  ]
};
