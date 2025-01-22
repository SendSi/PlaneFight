import { _decorator, Component, director, Label, Node } from 'cc';
import { GameMgr } from './GameMgr';
const { ccclass, property } = _decorator;

@ccclass('OverUIView')
export class OverUIView extends Component {
    @property(Label)
    private txtHistory: Label = null;

    @property(Label)
    private txtCurrent: Label = null;

    public SetShowOverUI(history: number, current: number) {
        this.node.active = true;
        this.txtHistory.string = history.toString();
        this.txtCurrent.string = current.toString();
    }
    public SetHideOverUI() {
        this.node.active = false;
    }

    public ResetMethod() {
        director.loadScene(director.getScene().name);
        director.resume();
    }
    public QuitMethod() {

    }
}


