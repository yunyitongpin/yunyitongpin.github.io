// 小游戏注册表：在此登记一个小游戏的元信息，组件在 GamesView 中按 component 字段映射。
// 新增游戏：1) 在 components/games/ 下新建组件；2) 在 GamesView 的 gameComponents 中注册；
// 3) 在这里补充一条元信息即可。
export const games = [
  {
    id: 'char-match',
    component: 'CharMatchGame',
    title: '汉字配对记忆',
    emoji: '🀄',
    color: '#2f5d50',
    description: '翻牌找出“汉字”与对应的拼音，全部配对成功即获胜，训练字音记忆。',
    tags: ['汉字', '拼音', '记忆'],
  },
  {
    id: 'pinyin-quiz',
    component: 'PinyinQuizGame',
    title: '拼音小测',
    emoji: '🔊',
    color: '#3b6f61',
    description: '看汉字，从四个选项中选出正确的拼音，连续答对可累积连击。',
    tags: ['拼音', '选择', '测验'],
  },
  {
    id: 'char-guess',
    component: 'CharGuessGame',
    title: '看线索猜汉字',
    emoji: '🧩',
    color: '#52796f',
    description: '根据字义、字源和部件提示，从选项中找出对应的汉字。',
    tags: ['字义', '部件', '推理'],
  },
]
