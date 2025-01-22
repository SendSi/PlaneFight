import { _decorator, Collider, Component, EventTouch, Input, input, instantiate, Node, PolygonCollider2D, Prefab, Vec2, Vec3, IContact2D, Animation, Contact2DType, Sprite } from 'cc';
import { BulletItem } from './BulletItem';
import { RewardItem, RewardType } from './RewardItem';
import { GameMgr } from './GameMgr';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

enum ShootType {
    One,
    Two
}

@ccclass('PlaneMgr')
export class PlaneMgr extends Component {

    public clamp(num: number, min: number, max: number) {
        if (num > max) {
            return max;
        }
        if (num < min) {
            return min;
        }
        return num;
    }
    public onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.MoveTouch, this)
    }

    collider: PolygonCollider2D = null;

    @property(Prefab)
    private bulletPre1: Prefab = null;

    @property(Prefab)
    private bulletPre2: Prefab = null;

    @property(Node)
    private bulletFather: Node = null;

    @property(Node)
    private bulletPos11: Node = null;

    @property(Node)
    private bulletPos21: Node = null;
    @property(Node)
    private bulletPos22: Node = null;

    @property
    shootType: ShootType = ShootType.One;

    inviTime: number = 1;//无敌时间
    twoBuffNum: number = 20;//双发buff持续 发数

    @property(Animation)
    ani: Animation = null;

    @property
    aniHit: string = "";

    @property
    aniDead: string = "";

    shootTimer: number = 0;
    @property
    shootRate: number = 0.5;

    bulletList_one: Array<Node> = new Array<Node>();
    bulletList_two: Array<Node> = new Array<Node>();


    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.MoveTouch, this);

        this.collider = this.getComponent(PolygonCollider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    public MoveTouch(event: EventTouch) {
        if (GameMgr.inst().GetGameIsPaused()) {
            return;
        }

        let obj = this.node.position;
        let pos = new Vec3(obj.x + event.getDeltaX(), obj.y + event.getDeltaY(), obj.z)

        pos.x = this.clamp(pos.x, -230, 230);
        pos.y = this.clamp(pos.y, -380, 150);

        this.node.setPosition(pos);
    }

    protected update(dt: number): void {
        if (GameMgr.inst().GetLife() <= 0) return;

        this.shootTimer += dt;
        if (this.shootTimer > this.shootRate) {
            this.shootTimer = 0;
            this.GenerateBullet(dt);
        }

        if (this.shootType == ShootType.Two && this.twoBuffNum <= 0) {
            this.shootType = ShootType.One; //buff时间没了 切换为单发           
        }

        if (this.inviTime > 0) {
            this.inviTime -= dt;
        }
    }

    GenerateBullet(dt: number) {
        if (this.shootType == ShootType.One) {
            this.checkAndGenerateBullet(this.bulletList_one, this.bulletPre1, this.bulletPos11);
        } else if (this.shootType == ShootType.Two && this.twoBuffNum > 0) {
            this.checkAndGenerateBullet(this.bulletList_two, this.bulletPre2, this.bulletPos21);
            this.checkAndGenerateBullet(this.bulletList_two, this.bulletPre2, this.bulletPos22);
            this.twoBuffNum--;
        }
    }

    checkAndGenerateBullet(bulletList, bulletPrefab, bulletPosition) {
        let isGenerate = true;
        for (let i = 0; i < bulletList.length; i++) {
            if (bulletList[i].worldPosition.y > 900) {
                isGenerate = false;
                bulletList[i].getComponent(BulletItem).SetShowANDPos(bulletPosition.worldPosition);
                break;
            }
        }

        if (isGenerate) {
            const go = instantiate(bulletPrefab);
            go.setParent(this.bulletFather);
            go.setWorldPosition(bulletPosition.worldPosition);
            bulletList.push(go);
        }
    }


    lastRewardItem: RewardItem = null;
    onBeginContact(selfCollider: PolygonCollider2D, otherCollider: Collider, contact: IContact2D) {
        let rewardScript = otherCollider.getComponent(RewardItem);
        if (rewardScript != null && rewardScript == this.lastRewardItem) {
            return;
        }
        this.lastRewardItem = rewardScript;
        if (rewardScript != null) {
            rewardScript.SetShowHide(false)
            this.OnBeginReward(rewardScript)
        } else {
            this.OnBeginEnemy()
        }
    }


    OnBeginReward(rewardScript: RewardItem) {
        if (rewardScript.rewardType == RewardType.Two) {
            this.twoBuffNum += 20;
            this.shootType = ShootType.Two;
            GameMgr.inst().PlaySoundIndex(7);
        } else if (rewardScript.rewardType == RewardType.Bomb) {
            GameMgr.inst().AddBomb();
            // AudioMgr.inst().PlaySound("bomb");
        }
    }

    public OnBeginEnemy() {
        if (this.inviTime > 0) {
            return;
        }
        GameMgr.inst().ReduceBomb();
        this.inviTime = 1;

        if (GameMgr.inst().GetLife() <= 0) {
            this.ani.play(this.aniDead);
            this.scheduleOnce(function () {
                GameMgr.inst().SetGameOver();
                this.node.destroy();
            }, 0.5);
        } else {
            this.ani.play(this.aniHit);
        }
    }

}


