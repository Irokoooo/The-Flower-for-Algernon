import type { CognitionGraphModel } from './contracts';
export const BAKERY_GRAPH: CognitionGraphModel = {
  nodes: [
    { id: 'laughter', x: 15, y: 25, label: { en: 'Laughter', zhHans: '笑声' } },
    { id: 'flour', x: 80, y: 25, label: { en: 'Flour on my sleeve', zhHans: '袖口上的面粉' } },
    { id: 'glance', x: 50, y: 80, label: { en: 'A quick glance', zhHans: '匆匆一瞥' } },
  ],
  edges: [
    { id: 'flour-laughter', from: 'flour', to: 'laughter', phases: ['LOW','ASCENDING','PEAK','DECLINE'], meaning: { en: 'They laugh when I brush my sleeve.', zhHans: '我拍袖口时，他们笑了。' } },
    { id: 'glance-laughter', from: 'glance', to: 'laughter', phases: ['ASCENDING','PEAK'], meaning: { en: 'They look at one another before laughing.', zhHans: '他们先互相看了一眼，然后才笑。' } },
    { id: 'glance-flour', from: 'glance', to: 'flour', phases: ['PEAK'], meaning: { en: 'Someone noticed before I did, and stayed silent.', zhHans: '有人比我先注意到，却没有提醒我。' } },
  ],
};
