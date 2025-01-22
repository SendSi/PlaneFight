import { _decorator, Component, director, Label, Node } from 'cc';
import { GameMgr } from './GameMgr';
const { ccclass, property } = _decorator;

@ccclass('ScoreUIView')
export class ScoreUIView extends Component {
    @property(Label)
    bombValueLabel: Label = null;

    @property(Label)
    lifeValueLabel: Label = null;

    @property(Label)
    scoreValueLabel: Label = null;

    @property(Node)
    btnStop: Node = null;
    @property(Node)
    btnPlay: Node = null;  

    protected onLoad(): void {
        this.scoreValueLabel.string = 'x0';
        this.bombValueLabel.string = 'x0';
    }

    protected start(): void {
        this.btnPlay.active = false;
        this.btnStop.active = true;
    }

    public SetBombUI(score: number) {
        this.bombValueLabel.string = "x" + score.toString();
    }

    public SetLifeUI(life: number) {
        this.lifeValueLabel.string = "x" + life.toString();
    }

    public SetPlaneScoreUI(score: number) {
        this.scoreValueLabel.string = score.toString();
    }

    public OnClickBtnStop() {
        this.btnPlay.active = true;
        this.btnStop.active = false;
        director.pause();
        GameMgr.inst().SetGameIsPaused(true);
    }

    public OnClickBtnPlay() {
        this.btnPlay.active = false;
        this.btnStop.active = true;
        director.resume();
        GameMgr.inst().SetGameIsPaused(false);
    }

   


}


