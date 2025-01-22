import { _decorator, Animation, Component, Collider, Contact2DType, PolygonCollider2D, IContact2D } from 'cc';
import { BulletItem } from './BulletItem';
import { GameMgr } from './GameMgr';

const { ccclass, property } = _decorator;

@ccclass('EnemyItem')
export class EnemyItem extends Component {
    @property
    speed: number = 300;

    @property
    hp: number = 1;

    @property(Animation)
    ani: Animation = null;

    @property
    aniHit: string = "";

    @property
    aniDead: string = "";

    @property
    enemyType: number = 0;

    @property
    addScore: number = 10;

    collider: PolygonCollider2D = null;

    protected start(): void {
        this.collider = this.getComponent(PolygonCollider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: PolygonCollider2D, otherCollider: Collider, contact: IContact2D) {
        let bulletScript = otherCollider.getComponent(BulletItem);
        if (bulletScript != null) { //撞到子弹才会减血
            bulletScript.SetShowHide(false);//子弹不显示了

            this.hp--;

            if (this.hp <= 0) {
                this.SetDeadShow();
            } else {
                this.ani.play(this.aniHit);
            }
        }
    }

    private SetDeadShow() {
        this.ani.play(this.aniDead);
        this.collider.enabled = false;
        this.scheduleOnce(function () {
            this.node.destroy();
        }, 0.5);
        GameMgr.inst().PlaneAddScore(this.addScore);

        GameMgr.inst().PlaySoundIndex(3 + this.enemyType);
    }

    update(deltaTime: number) {
        if (this.hp > 0) {
            let go = this.node.position;
            this.node.setPosition(go.x, go.y - deltaTime * this.speed, go.z);
        }

        if (this.node.position.y < -1000) {
            this.hp = 0;
            this.node.destroy();
        }
    }

    /***设置死亡，用于炸弹爆炸后设置敌机死亡 */
    public SetDeadForUseBomb() {
        if (this.hp > 0) {
            this.SetDeadShow();
        }
    }
}


