import { _decorator, Collider2D, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

export enum RewardType {
    Two,
    Bomb
}

@ccclass('RewardItem')
export class RewardItem extends Component {
    @property
    speed: number = 100;

    @property
    rewardType: RewardType = RewardType.Two;

    collider2d: Collider2D = null;
    sprite: Sprite = null;

    protected onLoad(): void {
        this.collider2d = this.node.getComponent(Collider2D);
        this.sprite = this.node.getComponent(Sprite);
    }

    update(deltaTime: number) {
        let pos = this.node.position;
        this.node.setPosition(pos.x, pos.y - this.speed * deltaTime, pos.z);
        
        if (this.node.position.y < -1000) {
            this.node.destroy();
        }
    }

    public SetShowHide(show: boolean) {
        this.collider2d.enabled = show;
        this.sprite.enabled = show;
    }
}


