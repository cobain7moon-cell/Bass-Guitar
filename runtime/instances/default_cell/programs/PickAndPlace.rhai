// Bass 1.0 (UR5e) 示例程序：循环抓取与放置工艺 (Pick and Place)
let pick = Pose(-220.0, 460.0, 260.0, 0.0, 0.0, 180.0);
let place = Pose(-60.0, 520.0, 260.0, 0.0, 0.0, 180.0);
let approach_dz = 80.0;

Log("回安全原点");
MoveJ(HOME, #{ vel: 60 });

for cycle in 0..3 {
    Log(`开始第 ${cycle + 1} 轮搬运任务`);

    // 移动至拾取点上方逼近位
    let pick_approach = Offset(pick, 0, 0, approach_dz);
    MoveJ(pick_approach, #{ vel: 80 });

    // 直线下降至抓取高度并闭合夹爪
    MoveL(pick, #{ vel: 60 });
    DO(1, true);
    Wait(0.2);

    // 直线提升回过渡高度
    MoveL(pick_approach, #{ vel: 80 });

    // 移动至放置点上方逼近位
    let place_approach = Offset(place, 0, 0, approach_dz);
    MoveJ(place_approach, #{ vel: 80 });

    // 直线下降至放置高度并松开夹爪
    MoveL(place, #{ vel: 60 });
    DO(1, false);
    Wait(0.2);

    // 直线提升回过渡高度
    MoveL(place_approach, #{ vel: 80 });
}

Log("全部搬运任务完成，回原点");
MoveJ(HOME, #{ vel: 60 });
