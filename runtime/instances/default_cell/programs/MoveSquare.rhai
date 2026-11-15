// Bass 1.0 (UR5e) 示例程序：笛卡尔空间方形直线轨迹 (MoveL)
let p1 = Pose(-220.0, 420.0, 340.0, 0.0, 0.0, 180.0);
let p2 = Pose(-220.0, 560.0, 340.0, 0.0, 0.0, 180.0);
let p3 = Pose(-80.0,  560.0, 340.0, 0.0, 0.0, 180.0);
let p4 = Pose(-80.0,  420.0, 340.0, 0.0, 0.0, 180.0);

Log("回安全原点");
MoveJ(HOME, #{ vel: 60 });

Log("接近起始角点 P1");
MoveJ(p1, #{ vel: 60 });
DO(1, true);

Log("开始 120mm/s 直线正方形轨迹");
MoveL(p2, #{ vel: 120 });
MoveL(p3, #{ vel: 120 });
MoveL(p4, #{ vel: 120 });
MoveL(p1, #{ vel: 120 });

DO(1, false);
Wait(0.3);
MoveJ(HOME, #{ vel: 60 });
