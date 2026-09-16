export type PhoneticKind = 'vowel' | 'consonant'
export type PhoneticFilter = 'all' | PhoneticKind

export interface PhoneticExample {
  word: string
  phonetic: string
  meaning: string
}

export interface PhoneticItem {
  symbol: string
  video: string
  tips: string[]
  confusion: string
  examples: PhoneticExample[]
}

export interface PhoneticGroup {
  id: string
  title: string
  summary: string
  kind: PhoneticKind
  items: PhoneticItem[]
}

const VIDEO_BASE = '/video/phonetics/'

function item(
  symbol: string,
  video: string,
  tips: string[],
  confusion: string,
  examples: [string, string, string][]
): PhoneticItem {
  return {
    symbol,
    video: VIDEO_BASE + video,
    tips,
    confusion,
    examples: examples.map(([word, phonetic, meaning]) => ({ word, phonetic, meaning })),
  }
}

export const phoneticGroups: PhoneticGroup[] = [
  {
    id: 'monophthong', title: '单元音', summary: '发音过程中口型和舌位基本保持不变', kind: 'vowel', items: [
      item('/iː/', 'long-i.mp4', ['嘴角向两侧展开，接近微笑。', '舌前部抬高，声音拉长且保持稳定。'], '不要读成短促的 /ɪ/，注意保持足够时长。', [['see', '/siː/', '看见'], ['green', '/ɡriːn/', '绿色的'], ['teacher', '/ˈtiːtʃə/', '老师']]),
      item('/ɪ/', 'short-i.mp4', ['嘴唇自然放松，微微张开。', '舌前部略抬，发音短促。'], '比 /iː/ 更短、更松，不要把嘴角过度拉开。', [['sit', '/sɪt/', '坐'], ['fish', '/fɪʃ/', '鱼'], ['city', '/ˈsɪti/', '城市']]),
      item('/e/', 'short-e.mp4', ['嘴巴半开，嘴角略向两侧。', '舌前部抬起，发音短而清晰。'], '口型比 /æ/ 小，舌位也更高。', [['bed', '/bed/', '床'], ['desk', '/desk/', '书桌'], ['head', '/hed/', '头']]),
      item('/æ/', 'short-ae.mp4', ['嘴巴张大，嘴角向两侧展开。', '舌尖抵近下齿，舌前部位置较低。'], '不要读成汉语“啊”，声音应更靠前。', [['cat', '/kæt/', '猫'], ['map', '/mæp/', '地图'], ['happy', '/ˈhæpi/', '快乐的']]),
      item('/ɜː/', 'long-er.mp4', ['嘴唇放松并略微扁平。', '舌身居中，声音从口腔中央持续发出。'], '英式发音中不要额外卷舌或带出明显的 /r/。', [['bird', '/bɜːd/', '鸟'], ['word', '/wɜːd/', '单词'], ['learn', '/lɜːn/', '学习']]),
      item('/ə/', 'schwa.mp4', ['口腔和嘴唇完全放松。', '舌身居中，轻而短地带过。'], '常出现在非重读音节，不能发得过重或过长。', [['about', '/əˈbaʊt/', '关于'], ['teacher', '/ˈtiːtʃə/', '老师'], ['banana', '/bəˈnɑːnə/', '香蕉']]),
      item('/ʌ/', 'short-uh.mp4', ['嘴巴自然半开，嘴唇放松。', '舌中部略抬，短促发音。'], '比 /ɑː/ 更短，口型也更小。', [['cup', '/kʌp/', '杯子'], ['bus', '/bʌs/', '公共汽车'], ['love', '/lʌv/', '爱']]),
      item('/uː/', 'long-u.mp4', ['双唇收圆并向前突出。', '舌后部抬高，声音持续。'], '不要读成短促的 /ʊ/，同时避免在开头加入 /j/。', [['food', '/fuːd/', '食物'], ['blue', '/bluː/', '蓝色的'], ['school', '/skuːl/', '学校']]),
      item('/ʊ/', 'short-u.mp4', ['双唇略微收圆，不必前突。', '舌后部抬起，发音短而放松。'], '比 /uː/ 更短、更松，嘴唇圆度更小。', [['book', '/bʊk/', '书'], ['good', '/ɡʊd/', '好的'], ['look', '/lʊk/', '看']]),
      item('/ɔː/', 'long-aw.mp4', ['双唇收圆并略向前突出。', '舌后部抬起，发音饱满且持续。'], '与 /ɒ/ 相比时长更长，嘴唇也更圆。', [['door', '/dɔː/', '门'], ['talk', '/tɔːk/', '谈话'], ['small', '/smɔːl/', '小的']]),
      item('/ɒ/', 'short-o.mp4', ['嘴巴张开，双唇稍圆。', '舌后部位置较低，快速发音。'], '不要拉长成 /ɔː/，也不要读成汉语“奥”。', [['hot', '/hɒt/', '热的'], ['box', '/bɒks/', '盒子'], ['clock', '/klɒk/', '时钟']]),
      item('/ɑː/', 'long-a.mp4', ['嘴巴充分张开，嘴唇自然。', '舌位低而靠后，声音拉长。'], '声音应从口腔后部发出，不要混成短音 /ʌ/。', [['car', '/kɑː/', '汽车'], ['park', '/pɑːk/', '公园'], ['father', '/ˈfɑːðə/', '父亲']]),
    ],
  },
  {
    id: 'diphthong', title: '双元音', summary: '从一个元音自然滑向另一个元音', kind: 'vowel', items: [
      item('/eɪ/', 'diphthong-ei.mp4', ['从 /e/ 开始，嘴巴半开。', '舌位向 /ɪ/ 滑动，前重后轻。'], '必须有连续滑动，不要拆成两个独立音节。', [['day', '/deɪ/', '一天'], ['name', '/neɪm/', '名字'], ['eight', '/eɪt/', '八']]),
      item('/aɪ/', 'diphthong-ai.mp4', ['从开口较大的 /a/ 开始。', '嘴角逐渐展开，滑向 /ɪ/。'], '起始音要饱满，结尾短而轻。', [['time', '/taɪm/', '时间'], ['five', '/faɪv/', '五'], ['light', '/laɪt/', '光']]),
      item('/ɔɪ/', 'diphthong-oi.mp4', ['从圆唇的 /ɔ/ 开始。', '嘴角向两侧展开并滑向 /ɪ/。'], '保持一个音节，避免把两个部分割裂。', [['boy', '/bɔɪ/', '男孩'], ['voice', '/vɔɪs/', '声音'], ['toy', '/tɔɪ/', '玩具']]),
      item('/əʊ/', 'diphthong-oh.mp4', ['从放松的 /ə/ 开始。', '双唇逐渐收圆，滑向 /ʊ/。'], '英式起点较轻，不要直接发成一个长 /o/。', [['go', '/ɡəʊ/', '去'], ['home', '/həʊm/', '家'], ['road', '/rəʊd/', '道路']]),
      item('/aʊ/', 'diphthong-au.mp4', ['从开口较大的 /a/ 开始。', '双唇逐渐收圆，滑向 /ʊ/。'], '结尾不要额外加辅音 /w/。', [['now', '/naʊ/', '现在'], ['house', '/haʊs/', '房子'], ['out', '/aʊt/', '向外']]),
      item('/ɪə/', 'diphthong-ia.mp4', ['从短促的 /ɪ/ 开始。', '口型逐渐放松，滑向 /ə/。'], '英式发音结尾不卷舌，不要加出明显的 /r/。', [['ear', '/ɪə/', '耳朵'], ['near', '/nɪə/', '附近'], ['here', '/hɪə/', '这里']]),
      item('/eə/', 'diphthong-ea.mp4', ['从 /e/ 开始，嘴巴半开。', '口型放松并滑向 /ə/。'], '与 /ɪə/ 的起始舌位不同，结尾同样不要卷舌。', [['air', '/eə/', '空气'], ['care', '/keə/', '关心'], ['chair', '/tʃeə/', '椅子']]),
      item('/ʊə/', 'diphthong-ua.mp4', ['从略圆唇的 /ʊ/ 开始。', '双唇逐渐放松，滑向 /ə/。'], '现代英式口语中部分词会并入 /ɔː/，这里保留传统教学读法。', [['tour', '/tʊə/', '旅行'], ['pure', '/pjʊə/', '纯净的'], ['cure', '/kjʊə/', '治愈']]),
    ],
  },
  {
    id: 'plosive', title: '爆破音', summary: '先阻断气流，再迅速释放', kind: 'consonant', items: [
      item('/p/', 'p.mp4', ['双唇闭合阻断气流，再突然张开。', '声带不振动，词首通常有明显送气。'], '与 /b/ 的关键区别是 /p/ 不振动声带。', [['pen', '/pen/', '钢笔'], ['map', '/mæp/', '地图'], ['happy', '/ˈhæpi/', '快乐的']]),
      item('/b/', 'b.mp4', ['双唇闭合后快速释放气流。', '发音时声带振动，送气较弱。'], '用手触摸喉部，可感受与 /p/ 不同的振动。', [['book', '/bʊk/', '书'], ['baby', '/ˈbeɪbi/', '婴儿'], ['job', '/dʒɒb/', '工作']]),
      item('/t/', 't.mp4', ['舌尖抵住上齿龈，阻断后释放气流。', '声带不振动，词首通常送气。'], '不要把舌尖抵在牙齿背面发成汉语式的“特”。', [['tea', '/tiː/', '茶'], ['table', '/ˈteɪbl/', '桌子'], ['cat', '/kæt/', '猫']]),
      item('/d/', 'd.mp4', ['舌尖抵住上齿龈后迅速放开。', '发音时声带振动，送气较弱。'], '发音位置与 /t/ 相同，区别主要在声带振动。', [['dog', '/dɒɡ/', '狗'], ['day', '/deɪ/', '一天'], ['red', '/red/', '红色的']]),
      item('/k/', 'k.mp4', ['舌后部抵住软腭，再突然释放。', '声带不振动，词首通常送气。'], '不要在音尾额外加入元音，避免读成“克”。', [['key', '/kiː/', '钥匙'], ['cat', '/kæt/', '猫'], ['back', '/bæk/', '后面']]),
      item('/ɡ/', 'g.mp4', ['舌后部抵住软腭后释放气流。', '发音时声带振动。'], '位置与 /k/ 相同，但 /ɡ/ 有声且送气更弱。', [['go', '/ɡəʊ/', '去'], ['game', '/ɡeɪm/', '游戏'], ['big', '/bɪɡ/', '大的']]),
    ],
  },
  {
    id: 'fricative', title: '摩擦音', summary: '气流通过狭窄通道产生摩擦', kind: 'consonant', items: [
      item('/f/', 'f.mp4', ['上齿轻触下唇。', '气流从缝隙摩擦而出，声带不振动。'], '不要用双唇相碰，避免发成 /p/。', [['fish', '/fɪʃ/', '鱼'], ['five', '/faɪv/', '五'], ['leaf', '/liːf/', '叶子']]),
      item('/v/', 'v.mp4', ['上齿轻触下唇。', '保持摩擦并让声带振动。'], '不要读成 /w/；/v/ 必须有齿唇接触和摩擦。', [['very', '/ˈveri/', '非常'], ['voice', '/vɔɪs/', '声音'], ['love', '/lʌv/', '爱']]),
      item('/θ/', 'voiceless-th.mp4', ['舌尖轻放在上下齿之间。', '让气流从舌齿间摩擦而出，声带不振动。'], '不要替换成 /s/ 或 /f/，要能看见少量舌尖。', [['think', '/θɪŋk/', '思考'], ['three', '/θriː/', '三'], ['mouth', '/maʊθ/', '嘴']]),
      item('/ð/', 'voiced-th.mp4', ['舌尖轻放在上下齿之间。', '保持轻微摩擦，同时振动声带。'], '位置与 /θ/ 相同，但 /ð/ 有声；不要读成 /z/。', [['this', '/ðɪs/', '这个'], ['they', '/ðeɪ/', '他们'], ['mother', '/ˈmʌðə/', '母亲']]),
      item('/s/', 's.mp4', ['舌尖靠近上齿龈但不接触。', '气流从舌面中央摩擦而出，声带不振动。'], '与 /z/ 的口型相同，区别在于声带是否振动。', [['sun', '/sʌn/', '太阳'], ['city', '/ˈsɪti/', '城市'], ['bus', '/bʌs/', '公共汽车']]),
      item('/z/', 'z.mp4', ['舌尖靠近上齿龈。', '保持气流摩擦，同时振动声带。'], '不要读成汉语拼音 z；这是连续的有声摩擦音。', [['zoo', '/zuː/', '动物园'], ['zero', '/ˈzɪərəʊ/', '零'], ['nose', '/nəʊz/', '鼻子']]),
      item('/ʃ/', 'sh.mp4', ['舌前部抬向硬腭，舌尖稍后缩。', '双唇略向前，声带不振动。'], '发音位置比 /s/ 更靠后，气流声音更厚。', [['she', '/ʃiː/', '她'], ['shop', '/ʃɒp/', '商店'], ['fish', '/fɪʃ/', '鱼']]),
      item('/ʒ/', 'zh.mp4', ['舌位与 /ʃ/ 相同。', '保持摩擦并振动声带。'], '不要发成破擦音 /dʒ/，气流应连续。', [['vision', '/ˈvɪʒn/', '视力'], ['usual', '/ˈjuːʒuəl/', '通常的'], ['measure', '/ˈmeʒə/', '测量']]),
      item('/h/', 'h.mp4', ['口型随后的元音自然变化。', '声门打开，让气流轻轻呼出，声带不振动。'], '不要把声音压在喉咙里，也不要完全省略气流。', [['hat', '/hæt/', '帽子'], ['home', '/həʊm/', '家'], ['behind', '/bɪˈhaɪnd/', '在后面']]),
      item('/r/', 'r.mp4', ['舌尖向后抬起，但不要碰到上颚。', '双唇略圆，声带振动。'], '英式非卷舌口音中，词尾无后接元音时通常不发 /r/。', [['red', '/red/', '红色的'], ['right', '/raɪt/', '正确的'], ['around', '/əˈraʊnd/', '围绕']]),
    ],
  },
  {
    id: 'affricate', title: '破擦音', summary: '由爆破开始，以摩擦结束', kind: 'consonant', items: [
      item('/tʃ/', 'ch.mp4', ['舌前部先抵住上齿龈后方。', '先阻断再摩擦释放，声带不振动。'], '要保持一个完整辅音，不要拆成 /t/ 和 /ʃ/ 两拍。', [['chair', '/tʃeə/', '椅子'], ['child', '/tʃaɪld/', '孩子'], ['watch', '/wɒtʃ/', '观看']]),
      item('/dʒ/', 'j.mp4', ['舌位与 /tʃ/ 相同。', '先阻断再摩擦释放，同时振动声带。'], '不要读成单纯的 /ʒ/，开头应有短暂阻塞。', [['job', '/dʒɒb/', '工作'], ['June', '/dʒuːn/', '六月'], ['bridge', '/brɪdʒ/', '桥']]),
      item('/tr/', 'tr.mp4', ['舌尖先接近上齿龈后方。', '释放时迅速过渡到 /r/，声带不振动。'], '国内 48 音标教学将其作为组合音学习，实际拼读仍要保持连贯。', [['tree', '/triː/', '树'], ['train', '/treɪn/', '火车'], ['try', '/traɪ/', '尝试']]),
      item('/dr/', 'dr.mp4', ['舌尖先形成短暂阻塞。', '释放后立即过渡到有声的 /r/。'], '与 /tr/ 相比声带振动，两个部分不要分开。', [['draw', '/drɔː/', '画'], ['dream', '/driːm/', '梦想'], ['drink', '/drɪŋk/', '喝']]),
      item('/ts/', 'ts.mp4', ['舌尖先完成 /t/ 的阻塞。', '释放时直接进入 /s/ 的摩擦。'], '常出现在词尾，要连贯发出且不要额外加元音。', [['cats', '/kæts/', '猫（复数）'], ['hats', '/hæts/', '帽子（复数）'], ['sports', '/spɔːts/', '体育运动']]),
      item('/dz/', 'dz.mp4', ['舌尖先完成 /d/ 的阻塞。', '释放时直接进入有声的 /z/。'], '常见于词尾复数或第三人称形式，声带应持续振动。', [['beds', '/bedz/', '床（复数）'], ['hands', '/hændz/', '手（复数）'], ['roads', '/rəʊdz/', '道路（复数）']]),
    ],
  },
  {
    id: 'sonorant', title: '鼻音、舌边音与半元音', summary: '气流较通畅，声音连续而清晰', kind: 'consonant', items: [
      item('/m/', 'm.mp4', ['双唇闭合，软腭下降。', '气流从鼻腔通过，声带振动。'], '发音可持续，词尾不要额外加元音。', [['man', '/mæn/', '男人'], ['milk', '/mɪlk/', '牛奶'], ['room', '/ruːm/', '房间']]),
      item('/n/', 'n.mp4', ['舌尖抵住上齿龈，软腭下降。', '气流从鼻腔通过，声带振动。'], '与 /ŋ/ 相比发音位置更靠前。', [['name', '/neɪm/', '名字'], ['nine', '/naɪn/', '九'], ['sun', '/sʌn/', '太阳']]),
      item('/ŋ/', 'ng.mp4', ['舌后部抵住软腭，舌尖放松。', '气流从鼻腔通过，声带振动。'], '不要先发 /n/ 再额外加 /ɡ/；在 sing 中没有独立 /ɡ/。', [['sing', '/sɪŋ/', '唱歌'], ['long', '/lɒŋ/', '长的'], ['English', '/ˈɪŋɡlɪʃ/', '英语']]),
      item('/l/', 'l.mp4', ['舌尖抵住上齿龈。', '气流从舌头两侧通过，声带振动。'], '词首通常较清晰；词尾的“暗 l”舌后部还会抬起。', [['light', '/laɪt/', '光'], ['look', '/lʊk/', '看'], ['feel', '/fiːl/', '感觉']]),
      item('/w/', 'w.mp4', ['双唇收圆并向前突出。', '舌后部抬起，迅速滑向后面的元音。'], '不要读成 /v/；发 /w/ 时上齿不接触下唇。', [['we', '/wiː/', '我们'], ['water', '/ˈwɔːtə/', '水'], ['away', '/əˈweɪ/', '离开']]),
      item('/j/', 'y.mp4', ['舌前部抬向硬腭但不接触。', '迅速滑向后面的元音，声带振动。'], '它是辅音滑音，不是字母 j 常对应的 /dʒ/。', [['yes', '/jes/', '是'], ['year', '/jɪə/', '年'], ['use', '/juːz/', '使用']]),
    ],
  },
]

export function flattenPhonetics(groups: PhoneticGroup[]): PhoneticItem[] {
  return groups.flatMap(group => group.items)
}

export function filterPhoneticGroups(groups: PhoneticGroup[], filter: PhoneticFilter): PhoneticGroup[] {
  if (filter === 'all') return groups
  return groups.filter(group => group.kind === filter)
}

export function shufflePhonetics(items: PhoneticItem[], random: () => number = Math.random): PhoneticItem[] {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]]
  }
  return shuffled
}
