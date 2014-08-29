//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Loop','Input'],[]));

/*
0:a,1:b,2:x,3:y,4:lb,5:rb,
6:lt,7:rt,8:back,9:start,10:lJoy,
11:rJoy,12:padUp,13:padDown,14:padLeft,15:padRight,

axe:
0:left horizontal (-1 = left) - 1:left vertical (-1 = up)
2:right horizontal (-1 = left) - 3:right vertical (-1 = up)
*/

Loop.updateController = function(){	//TOFIX bad name
	if(!navigator.getGamepads) return;
	var list = navigator.getGamepads();
	var con = list[0] || list[1] || list[2] || list[3];
	if(!con || !main.pref.controller) return;
	var but = con.buttons;
	if(!but[0]) return;	//not loaded properly
	var axe = con.axes;
	
	var p = Input.press;
	
	p.ability[4] = +but[4].pressed;	//lb, heal
	p.ability[5] = +but[10].pressed; //lJoy, dodge
	p.combo[0] = +but[6].pressed;
	
	p.move[0] = +(axe[0] > 0.4);
	p.move[2] = +(axe[0] < -0.4);
	p.move[1] = +(axe[1] > 0.4);
	p.move[3] = +(axe[1] < -0.4);
}








