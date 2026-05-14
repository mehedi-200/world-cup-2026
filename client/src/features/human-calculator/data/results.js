// All 6 combo results from 4 options (sorted alphabetically by ID)
export const comboResults = {
  // ⚠️ SPECIAL CASE — Red warning, screen shake, glitch
  'happy+married': {
    isSpecial: true,
    animation: 'danger',
    title: '⚠️ SYSTEM WARNING',
    subtitle: '💔 IMPOSSIBLE COMBINATION DETECTED',
    voiceTemplate:
      '{name}… Beta bujhis na… biye kore happy thaka possible na. Ei duniya movie na, real life script alada. তুই যতই হাসিস, ভিতরে তো জানিস reality কী! সংসার মানেই sacrifice… আর sacrifice-এ happiness? ভাই, সেটা শুধু Facebook status-এ possible!',
    shareText:
      '⚠️ Happy + Married? Impossible! Ei duniya movie na, real life script alada. #HumanCalculator',
  },

  // 🧠😄 Brain + Happy
  'brain+happy': {
    isSpecial: false,
    animation: 'cinematic',
    title: '🧠😄 Overthinking Happiness',
    subtitle: 'Brain says logic, Heart says party',
    voiceTemplate:
      '{name}… শোন, তুই happy… কিন্তু তোর brain তো থামে না! রাতে শুতে গেলে brain বলে "তুই কি সত্যিই happy, নাকি pretend করতেছিস?" সকালে চা খেতে গেলে brain বলে "এই happiness কতদিন টিকবে?" ভাই, তোর brain তোর happiness-এর সবচেয়ে বড় শত্রু। মাথা বন্ধ কর, enjoy কর… পারবি না, কারণ brain আবার বলবে "enjoy করাটাও কি logical?"',
    shareText:
      '🧠😄 Brain + Happy — brain বলে logic, মন বলে party! মাথা বন্ধ করতে পারি না। #HumanCalculator',
  },

  // 🧠💍 Brain + Married
  'brain+married': {
    isSpecial: false,
    animation: 'cinematic',
    title: '🧠💍 Internal Argument',
    subtitle: 'Married but brain won\'t stop debating',
    voiceTemplate:
      '{name}… এটা drama film না, এটা তোর daily internal argument! তুই married, কিন্তু brain এখনো debate শেষ করে নাই। বউ বলে "হ্যাঁ বল," brain বলে "কিন্তু technically…" বউ বলে "আমাকে ভালোবাসিস?" brain বলে "define ভালোবাসা।" ভাই, তোর brain একদিন তোর divorce-এর কারণ হবে। বউয়ের সামনে brain off কর… survive করবি।',
    shareText:
      '🧠💍 Married কিন্তু brain এখনো debate শেষ করে নাই! বউ বলে হ্যাঁ বল, brain বলে technically… #HumanCalculator',
  },

  // 🧠🎬 Brain + Tiktoker
  'brain+tiktoker': {
    isSpecial: false,
    animation: 'cinematic',
    title: '🧠🎬 Error 404: Brain Not Found',
    subtitle: 'TikToker দের brain? সেটা আবার কী?',
    voiceTemplate:
      '{name}… TikToker দের আবার brain খুঁজিস? ওদের brain নাই, pain নাই—শুধু "record" আর "post"! তুই brain দিয়ে ভাবিস "content-টা কি meaningful?" আর TikTok algorithm বলে "ভাই, meaningful লাগবে না, নাচ!" তোর brain বলে "একটু intellectual কিছু বানাই," কিন্তু views আসে cat video-তে। brain আর TikTok একসাথে চলে না… একটা ছাড়, নাহলে দুইটাই যাবে!',
    shareText:
      '🧠🎬 TikToker দের brain নাই, pain নাই—শুধু record আর post! Brain আর TikTok একসাথে চলে না। #HumanCalculator',
  },

  // 😄🎬 Happy + Tiktoker
  'happy+tiktoker': {
    isSpecial: false,
    animation: 'cinematic',
    title: '😄🎬 Professional Pretender',
    subtitle: 'Happy on screen, existential crisis off screen',
    voiceTemplate:
      '{name}… তুই happy? নাকি TikTok-এর জন্য happy এর ভান করতেছিস? camera on হলে তুই world-এর happiest person, camera off হলে তুই ceiling-এর দিকে তাকায়ে ভাবিস "life-এ কী করতেছি?" TikTok-এ smile দিস, comment-এ লেখে "so positive!" কিন্তু reality হলো তুই last 3 টা reel একই dress-এ করেছিস কারণ laundry করিস নাই। Happy TikToker… ভাই, Oscar-এ nominate হওয়া উচিত তোর!',
    shareText:
      '😄🎬 Camera on = happiest person, camera off = ceiling-এর দিকে তাকায়ে থাকি। Oscar worthy! #HumanCalculator',
  },

  // 💍🎬 Married + Tiktoker
  'married+tiktoker': {
    isSpecial: false,
    animation: 'cinematic',
    title: '💍🎬 Couple Vlogger From Hell',
    subtitle: 'বউ বলে কাজ কর, তুই বলিস "intro দিয়ে নিই"',
    voiceTemplate:
      '{name}… তুই married, আবার TikToker? এটা তো level 999 danger zone! বউ বলে "খাবার আন," তুই বলিস "wait, এইটা record করি, engagement বাড়বে!" রাতে ঝগড়া হলে তোর first thought "এইটা storytime content হবে!" বউ কান্দে, তুই camera angle ঠিক করিস। ভাই, একদিন বউ তোর phone টা ভাঙবে, আর সেটাও তুই upload দিবি caption দিয়ে "she broke my phone 😭💔 part 1"।',
    shareText:
      '💍🎬 বউ কান্দে, আমি camera angle ঠিক করি! Married TikToker life। #HumanCalculator',
  },
};
