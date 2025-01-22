import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BgMgr')
export class BgMgr extends Component {


    @property(Node)
    private target1: Node = null;

    @property(Node)
    private target2: Node = null;

    @property
    private speed: number = 100;

    update(deltaTime: number) {
        let ta1 = this.target1.position;
        this.target1.setPosition(ta1.x, ta1.y - this.speed * deltaTime, ta1.z);
        let ta2 = this.target2.position;
        this.target2.setPosition(ta2.x, ta2.y - this.speed * deltaTime, ta2.z);

        let b1 = this.target1.position;
        let b2 = this.target2.position;
        if (b1.y <= -821) {
            this.target1.setPosition(b1.x, b2.y + 821, b1.z);
        }
        if (b2.y <= -821) {
            this.target2.setPosition(b2.x, b1.y + 821, b2.y);
        }
    }

}


