import type { CognitionGraphModel } from '../cognition/contracts';
export const observations = {
  book: {en:'A big book. The words are very small.',zhHans:'一本大书。里面的字很小。'},
  paper:{en:'Some important paper. I hope they let me stay.',zhHans:'一张重要的纸。我希望他们让我留下。'},
  mouse:{en:'A little white mouse. They say he knows the way.',zhHans:'一只小白鼠。他们说它认得路。'},
};
export const testGraph: CognitionGraphModel = {
 nodes:[{id:'ink',x:25,y:30,label:{en:'Two dark shapes',zhHans:'两个深色形状'}},{id:'wings',x:75,y:65,label:{en:'Wings',zhHans:'翅膀'}}],
 edges:[{id:'butterfly',from:'ink',to:'wings',phases:['LOW','ASCENDING','PEAK','DECLINE'],meaning:{en:'Maybe a butterfly. Both sides look the same.',zhHans:'也许是一只蝴蝶。两边看起来一样。'}}],
};
export const machineGraph: CognitionGraphModel = {
 nodes:[{id:'lever',x:20,y:25,label:{en:'Lever',zhHans:'拉杆'}},{id:'gear',x:70,y:25,label:{en:'Gear',zhHans:'齿轮'},perceivedLabels:{DECLINE:{en:'I knew this…',zhHans:'我以前知道……'}}},{id:'roller',x:70,y:75,label:{en:'Roller',zhHans:'滚轴'},perceivedLabels:{DECLINE:{en:'…',zhHans:'……'}}},{id:'dough',x:20,y:75,label:{en:'Dough thickness',zhHans:'面团厚度'}}],
 edges:[{id:'lever-gear',from:'lever',to:'gear',phases:['ASCENDING','PEAK'],meaning:{en:'The lever turns the gear.',zhHans:'拉杆带动齿轮。'}},{id:'gear-roller',from:'gear',to:'roller',phases:['ASCENDING','PEAK'],meaning:{en:'The gear moves the rollers together.',zhHans:'齿轮让滚轴同时转动。'}},{id:'roller-dough',from:'roller',to:'dough',phases:['ASCENDING','PEAK'],meaning:{en:'The gap controls the thickness. I can do this.',zhHans:'间隙决定厚度。我能做到。'}}],
};
export const lines = {
 welcome:{en:'Charlie? Take your time. You can look around.',zhHans:'查理？不用着急。你可以先看看。'},
 test:{en:'What do you see?',zhHans:'你看见了什么？'},
 bakery:{en:'Charlie, three loaves for the counter. Take your time.',zhHans:'查理，拿三条面包到柜台上。不用着急。'},
 laughter:{en:'Everybody is laughing. I must have done something funny.',zhHans:'大家都在笑。我一定做了什么好玩的事。'},
 gain:{en:'The parts belong together. I can follow them now.',zhHans:'这些部件是相连的。现在我能理解了。'},
 success:{en:'I did it right. Why is he looking at me like that?',zhHans:'我做对了。他为什么那样看着我？'},
 return:{en:'The laugh was already there. So was that glance.',zhHans:'那笑声一直都在。那个眼神也是。'},
 decline:{en:'I know how this worked. I know that I knew.',zhHans:'我知道它曾经怎样运转。我知道自己曾经懂得。'},
};
