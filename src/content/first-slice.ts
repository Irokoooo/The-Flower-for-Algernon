import type { DialogueBeat } from '../narrative/types';
export const firstSlice: DialogueBeat[] = [
 {id:'lab.test',sceneId:'lab',stimulusId:'test-card',speaker:'examiner',voiceAsset:'voice.examiner.test',subtitles:{en:'Which card belongs beside this one?',zhHans:'哪张卡片应该放在这张旁边？'},nextBeatId:'diary.prompt',tags:['opening','test']},
 {id:'diary.prompt',sceneId:'diary',stimulusId:'test-card',speaker:'charlie',voiceAsset:'voice.charlie.diary',subtitles:{en:'Write down what you remember.',zhHans:'把你记得的写下来。'},nextBeatId:'bakery.low',tags:['report']},
 {id:'bakery.low',sceneId:'bakery',stimulusId:'bakery-counter-laughter',speaker:'coworker',voiceAsset:'voice.coworker.bakery',subtitles:{en:'There he is. Our professor.',zhHans:'他来了。我们的大教授。'},nextBeatId:'bakery.low.perception',tags:['low','objective-stimulus']},
 {id:'bakery.low.perception',sceneId:'bakery',stimulusId:'bakery-counter-laughter',speaker:'charlie',voiceAsset:'voice.charlie.bakery.low',subtitles:{en:'They saved a name for me. I laugh too.',zhHans:'他们给我起了个名字。我也笑了。'},nextBeatId:'bakery.gain',tags:['low','perception']},
 {id:'bakery.gain',sceneId:'bakery',stimulusId:'cognition-gain',speaker:'charlie',voiceAsset:'voice.charlie.gain',subtitles:{en:'I can see the pattern now.',zhHans:'我现在看见规律了。'},nextBeatId:'bakery.high',tags:['gain']},
 {id:'bakery.high',sceneId:'bakery',stimulusId:'bakery-counter-laughter',speaker:'charlie',voiceAsset:'voice.charlie.bakery.high',subtitles:{en:'The pause was an invitation. I was the joke.',zhHans:'那阵停顿是在招呼别人一起笑。笑话是我。'},nextBeatId:'decline.callback',tags:['high','same-stimulus']},
 {id:'decline.callback',sceneId:'bakery-callback',stimulusId:'bakery-counter-laughter',speaker:'charlie',voiceAsset:'voice.charlie.bakery.decline',subtitles:{en:'I know that laugh. I cannot find the words for why it hurts.',zhHans:'我认得那笑声。我找不到词说清它为什么让我难受。'},tags:['decline','callback']}
];
