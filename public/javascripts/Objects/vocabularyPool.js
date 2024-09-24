const sixth_grade_unit_1 = [
  {
    word: "brave",
    meaning: "valiente",
    audio_path: ""
  },
  {
    word: "funny",
    meaning: "gracioso",
    audio_path: ""
  },
  {
    word: "honor",
    meaning: "honor",
    audio_path: ""
  },
  {
    word: "smart",
    meaning: "inteligente",
    audio_path: ""
  },
  {
    word: "super",
    meaning: "súper",
    audio_path: ""
  },
  {
    word: "saved",
    meaning: "salvado",
    audio_path: ""
  },
  {
    word: "fight",
    meaning: "luchar",
    audio_path: ""
  },
  {
    word: "human",
    meaning: "humano",
    audio_path: ""
  },
  {
    word: "speed",
    meaning: "velocidad",
    audio_path: ""
  },
  {
    word: "great",
    meaning: "genial",
    audio_path: ""
  },
  {
    word: "crime",
    meaning: "crimen",
    audio_path: ""
  },
  {
    word: "sense",
    meaning: "sentido",
    audio_path: ""
  },
  {
    word: "shoot",
    meaning: "disparar",
    audio_path: ""
  }
];

sixth_grade_unit_1.forEach(item => {
  item.audio_path = `/sounds/words/${item.word.toLowerCase()}.wav`;
});

export { sixth_grade_unit_1 };
