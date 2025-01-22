import { _decorator, Component, Game, Input, input, instantiate, math, Node, Prefab } from 'cc';
import { GameMgr } from './GameMgr';
import { EnemyItem } from './EnemyItem';
const { ccclass, property } = _decorator;

@ccclass('EnemyMgr')
export class EnemyMgr extends Component {
    @property
    private enemySpeedTime0: number = 0.5;
    @property
    private enemySpeedTime1: number = 2.5;
    @property
    private enemySpeedTime2: number = 10.5;

    @property
    private rewardSpeedTime: number = 2.5;

    @property(Prefab)
    rewardPre1: Prefab = null;
    @property(Prefab)
    rewardPre2: Prefab = null;

    @property(Prefab)
    enemy0: Prefab = null;

    @property(Prefab)
    enemy1: Prefab = null;

    @property(Prefab)
    enemy2: Prefab = null;

    @property(Node)
    fatherNode: Node = null;

    start() {
        this.schedule(this.GenerateEnemy0, this.enemySpeedTime0);
        this.schedule(this.GenerateEnemy1, this.enemySpeedTime1);
        this.schedule(this.GenerateEnemy2, this.enemySpeedTime2);

        this.schedule(this.GenerateRewardRandom, this.rewardSpeedTime);

        input.on(Input.EventType.TOUCH_END, this.OnTouchEnd, this);
    }

    oldTouchTime: number = 0;
    OnTouchEnd() {
        if (GameMgr.inst().GameCanBomb() == false) {
            console.log('暂停 没血条 没炸弹');
            return;
        }

        let currentTime = Date.now();
        if (currentTime - this.oldTouchTime < 200) {
            console.log('touch end  ' + currentTime);
            this.oldTouchTime = 0;
            GameMgr.inst().UseBomb();
            this.UseBomb();
        } else {
            this.oldTouchTime = currentTime;
        }
    }

    UseBomb() {
        for (let i = 0; i < this.arrEnemyList.length; i++) {
            let item = this.arrEnemyList[i];
            item.SetDeadForUseBomb();          
        }
        this.arrEnemyList=[];//清空数组
    }


    public StopGenerate() {
        this.unschedule(this.GenerateEnemy0);
        this.unschedule(this.GenerateEnemy1);
        this.unschedule(this.GenerateEnemy2);

        this.unschedule(this.GenerateRewardRandom);
    }


    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_END, this.OnTouchEnd, this);
        this.StopGenerate();
    }

    GenerateEnemy0() {
        this.GenerateGo(this.enemy0, -215, 215, 460, true);
    }

    GenerateEnemy1() {
        this.GenerateGo(this.enemy1, -200, 200, 500, true);
    }

    GenerateEnemy2() {
        this.GenerateGo(this.enemy2, -155, 155, 550, true);
    }

    GenerateRewardRandom() {
        const index = math.randomRangeInt(0, 2);
        let pre = (index == 0 ? this.rewardPre1 : this.rewardPre2);

        this.GenerateGo(pre, -205, 205, 460, false);
    }


    arrEnemyList: EnemyItem[] = [];

    GenerateGo(prefab, minX, maxX, posY, isEnemy) {
        const go = instantiate(prefab);
        go.setParent(this.fatherNode);
        const posX = math.randomRange(minX, maxX);
        go.setPosition(posX, posY, 0);

        if (isEnemy) {
            let item = go.getComponent(EnemyItem);
            this.arrEnemyList.push(item);
        }
    }


}


