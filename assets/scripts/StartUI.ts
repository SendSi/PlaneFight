import { _decorator, Component, director, Node, Scene } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartUI')
export class StartUI extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
    public OnClickStart(){
        director.loadScene("game");
    }
}


