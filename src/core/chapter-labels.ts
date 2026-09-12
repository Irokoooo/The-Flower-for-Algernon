/** Player-facing labels for authored evidence; never expose internal IDs. */
const labels:Record<string,string>={
 'memory-study':'Memory study / 记忆实验', 'category-cue':'Category cue / 类别提示', 'recall-results':'Recall results / 回忆结果',
 'trial-cards':'Trial cards / 实验卡片','cue-retest':'Test again with a cue / 加上提示再测一次','prediction-desk':'Prediction notes / 预测笔记',
 'connection-notebook':'My notebook / 我的笔记本','prior-route-record':'Earlier route record / 先前的路线记录','observed-failed-run':'The interrupted run / 中断的试跑',
 'care-log':'Care log / 照护日志','dated-run-cards':'Dated run records / 带日期的试跑记录','repeated-hesitation':'Repeated hesitation / 重复迟疑','evidence-file':'Evidence folder / 证据档案',
 'algernon-summary':'Algernon’s procedure / 阿尔吉侬的手术摘要','charlie-summary':'My procedure / 我的手术摘要','results-stack':'Research results / 研究结果','contrary-run':'Contrary result / 相反的结果','draft-evidence':'Research draft / 研究草稿',
 'projected-slide':'Presentation slide / 会议投影片','research-notes':'Research notes / 研究笔记','slide-annotation':'Slide annotation / 投影片旁注'
};
export function chapterObjectLabel(id:string):string{return labels[id]??'Evidence / 证据';}
