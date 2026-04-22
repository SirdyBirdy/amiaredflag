// ─────────────────────────────────────────
//  DATA — amitheredflag.com
// ─────────────────────────────────────────

const FLAGS = [
  { text: "you've said 'i'm not like other people' unironically", tag: "classic" },
  { text: "you read their message, decided to make them wait, then forgot to reply", tag: "avoidant" },
  { text: "you describe your exes as 'crazy' — all of them", tag: "pattern recognition" },
  { text: "you've said 'i just don't do labels' to someone you see every day", tag: "commitment issues" },
  { text: "you've typed 'k.' as a complete sentence", tag: "passive aggressive" },
  { text: "you've cancelled plans via text 20 minutes after you were supposed to arrive", tag: "chronically late" },
  { text: "you're 'just brutally honest' but only about other people's flaws", tag: "selective honesty" },
  { text: "you've left someone on read for 3 days then sent 'hey' like nothing happened", tag: "chaos gremlin" },
  { text: "you've said 'i hate drama' while actively creating it", tag: "irony" },
  { text: "you've checked their location without them knowing", tag: "trust issues" },
  { text: "your love language is 'not communicating until it explodes'", tag: "avoidant" },
  { text: "you've given someone the silent treatment for more than 48 hours", tag: "emotional withholding" },
  { text: "you've said 'fine' and meant 19 different things", tag: "communication style" },
  { text: "you've DMed an ex at 2am with 'you up?'", tag: "self-sabotage" },
  { text: "you've introduced someone as 'a friend' for 8 months", tag: "labelling problems" },
  { text: "you know your attachment style but refuse to work on it", tag: "self-aware but unbothered" },
  { text: "you've negged someone and called it flirting", tag: "manipulation lite" },
  { text: "you've said 'i'll change' more than twice to the same person", tag: "broken promises" },
  { text: "you've screenshotted private messages to show other people", tag: "breach of trust" },
  { text: "you've cried to get out of an argument you were clearly losing", tag: "nuclear option" },
];

const VERDICTS = [
  {
    min: 0, max: 2,
    zone: "green-zone",
    title: "SURPRISINGLY FINE",
    emoji: "🟢",
    desc: "Okay. Either you're genuinely a well-adjusted person or you're in denial — but we're choosing to believe you. You passed. You are not the red flag. Scroll down. We have an offer for you.",
    cta: "no really. scroll down. this is important.",
    badminton: true,
    shareText: (score) => `i just took the am i the red flag quiz.\n\nresult: 🟢 SURPRISINGLY FINE (${score}/20 flags)\n\nallegedly i'm one of the healthy ones. alleged.\n\nthey also invited me to play badminton??\n\ncheck yours → amitheredflag.com`,
  },
  {
    min: 3, max: 6,
    zone: "amber-zone",
    title: "YELLOW FLAG SEASON",
    emoji: "🟡",
    desc: "You've got some things to work on but you're not beyond saving. A few honest conversations and maybe one podcast about attachment theory should sort you right out.",
    cta: "download an app called 'Headspace'. just trust us.",
    shareText: (score) => `i just took the am i the red flag quiz.\n\nresult: 🟡 YELLOW FLAG SEASON (${score}/20 flags)\n\nsome things to work on apparently. we don't need to discuss which ones.\n\ncheck yours → amitheredflag.com`,
  },
  {
    min: 7, max: 10,
    zone: "amber-zone",
    title: "RED FLAG RISING",
    emoji: "🟠",
    desc: "We're not going to sugarcoat it. You are the reason someone is at therapy right now. The good news: you clearly have self-awareness. Use it. Call someone.",
    cta: "scroll down. the therapist section is for you.",
    shareText: (score) => `i just took the am i the red flag quiz.\n\nresult: 🟠 RED FLAG RISING (${score}/20 flags)\n\napparently i am the reason someone is in therapy. growth era incoming.\n\ncheck yours → amitheredflag.com`,
  },
  {
    min: 11, max: 15,
    zone: "red-zone",
    title: "CERTIFIED RED FLAG",
    emoji: "🔴",
    desc: "Babe. BABE. This is an intervention. The fact that you're still reading means there's hope. But we need you to stop, put down your phone, and text your therapist. Not your ex. Your therapist.",
    cta: "the therapist section below is not optional.",
    shareText: (score) => `i just took the am i the red flag quiz.\n\nresult: 🔴 CERTIFIED RED FLAG (${score}/20 flags)\n\ni am going to be somebody's villain origin story and i have accepted this.\n\ncheck yours → amitheredflag.com`,
  },
  {
    min: 16, max: 20,
    zone: "red-zone",
    title: "THE WHOLE FLAGPOLE",
    emoji: "🚨",
    desc: "You're not a red flag. You're the entire parade. We say this with love: you are the plot twist in other people's healing arc. But redemption exists. It's called accountability. You've heard of it.",
    cta: "we have arranged some professional contacts below. they're expecting your call.",
    shareText: (score) => `i just took the am i the red flag quiz.\n\nresult: 🚨 THE WHOLE FLAGPOLE (${score}/20 flags)\n\ni am not a red flag i am the entire flagpole and i think that's valid.\n\ncheck yours → amitheredflag.com`,
  },
];

const METER_LABELS = [
  [0, 0, "start checking boxes..."],
  [1, 2, "we like the honesty."],
  [3, 5, "okay. okay. we see you."],
  [6, 9, "this is getting concerning."],
  [10, 13, "are you okay?? genuinely asking."],
  [14, 16, "we need to talk."],
  [17, 20, "we are legally obligated to share therapist contacts."],
];

const THERAPISTS = [
  {
    icon: "🧠",
    name: "BetterHelp",
    desc: "online therapy, no commute, no excuses",
    url: "https://betterhelp.com",
  },
  {
    icon: "💬",
    name: "Talkspace",
    desc: "therapy via text if you're still scared of calls",
    url: "https://talkspace.com",
  },
  {
    icon: "📱",
    name: "7 Cups",
    desc: "free listener available right now",
    url: "https://7cups.com",
  },
  {
    icon: "🌿",
    name: "Calm",
    desc: "start with the anxiety section",
    url: "https://calm.com",
  },
  {
    icon: "📖",
    name: "Attached (book)",
    desc: "the bible of attachment theory. read it.",
    url: "https://www.amazon.com/s?k=Attached+Levine+Heller",
  },
  {
    icon: "🎙️",
    name: "Where Should We Begin?",
    desc: "esther perel's podcast. eye-opening.",
    url: "https://www.estherperel.com/podcast",
  },
];
