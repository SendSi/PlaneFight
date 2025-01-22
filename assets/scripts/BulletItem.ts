import { _decorator, Collider, Collider2D, Component, Node, Sprite } from 'cc';
import { GameMgr } from './GameMgr';
const { ccclass, property } = _decorator;

@ccclass('BulletItem')
export class BulletItem extends Component {
    @property
    speed: number = 100;

    sprite: Sprite = null;
    collider: Collider2D = null;
    protected onLoad(): void {
        this.sprite = this.getComponent(Sprite);
        this.collider = this.getComponent(Collider2D);
    }

    protected start(): void {
        GameMgr.inst().PlaySoundIndex(2);
    }

    update(deltaTime: number) {
        let pos = this.node.position;
        this.node.setPosition(pos.x, pos.y + deltaTime * this.speed, pos.z);
    }

    public SetShowHide(isShow: boolean) {
        this.sprite.enabled = isShow;
        this.collider.enabled = isShow;
    }

    public SetShowANDPos(worldPosition) {
        GameMgr.inst().PlaySoundIndex(2);
        this.node.setWorldPosition(worldPosition);
        this.SetShowHide(true);
    }

}


