import { _decorator, AudioClip, Component, director, Node } from 'cc';
import { ScoreUIView } from './ScoreUIView';
import { OverUIView } from './OverUIView';
import { EnemyMgr } from './EnemyMgr';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('GameMgr')
export class GameMgr extends Component {

    private static _inst: GameMgr = null;

    @property(ScoreUIView)
    private scoreUIViewScript: ScoreUIView = null;

    @property(OverUIView)
    private overUIViewScript: OverUIView = null;

    @property(EnemyMgr)
    private enemyMgrScript: EnemyMgr = null;

    @property([AudioClip])//0bg 1over 2bullet
    private audioClips: AudioClip[] = [];

    @property
    private historyScore: number = 0;

    public static inst() {
        return this._inst;
    }

    @property
    public bombNum: number = 3;
    @property
    public lifeNum: number = 3;//生命值


    public GetBomb() {
        return this.bombNum;
    }

    public AddBomb() {
        this.bombNum++;
        this.scoreUIViewScript.SetBombUI(this.bombNum);
        this.PlaySoundIndex(6);
    }


    public GetLife() {
        return this.lifeNum;
    }

    public ReduceBomb() {
        this.lifeNum--
        this.scoreUIViewScript.SetLifeUI(this.lifeNum);
        GameMgr.inst().PlaySoundIndex(9);
    }

    onLoad() {
        GameMgr._inst = this;
        this.overUIViewScript.SetHideOverUI();
    }

    protected start(): void {
        this.scoreUIViewScript.SetLifeUI(this.lifeNum);

        const value = localStorage.getItem("historyScore")
        if (value) {
            this.historyScore = parseInt(value);
        } else {
            localStorage.setItem("historyScore", "0");
        }

        AudioMgr.inst.play(this.audioClips[0], 0.1, true);
    }

    /** 1over    2bullet 3小飞机死  4中飞机死  5大飞机死 6获得炸弹 7获得双发 8使用炸弹 9受伤*/
    public PlaySoundIndex(index: number){
        AudioMgr.inst.playOneShot(this.audioClips[index], 0.7);
    }


    planeScore: number = 0;
    public PlaneAddScore(score: number) {
        this.planeScore += score;
        this.scoreUIViewScript.SetPlaneScoreUI(this.planeScore);
    }


    gameIsPaused: boolean = false;
    /* 暂停返回 true*/
    public GetGameIsPaused() {
        return this.gameIsPaused;
    }

    public SetGameIsPaused(isPaused: boolean) {
        this.gameIsPaused = isPaused;
    }

    /* 非暂停 且有血条 且有炸弹 true*/
    public GameCanBomb() {
        return (this.gameIsPaused == false && this.lifeNum > 0 && this.bombNum > 0);
    }

    public SetGameOver() {
        this.enemyMgrScript.StopGenerate();
        this.overUIViewScript.SetShowOverUI(this.historyScore, this.planeScore);
        this.PlaySoundIndex(1);

        if (this.planeScore > this.historyScore) {
            this.historyScore = this.planeScore;
            localStorage.setItem("historyScore", this.historyScore.toString());
        }
    }

    public UseBomb() {
        GameMgr.inst().PlaySoundIndex(8);
        this.bombNum--;
        this.scoreUIViewScript.SetBombUI(this.bombNum);    
    }

}


