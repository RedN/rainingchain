
/*
0 - dont have
1 - have
2 - start with
3 - highway
4 - block

*/

initPassiveGrid = function(){
		
	passiveGrid = [
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],'balancedAtk',2,2,2,2,['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],2,2,2,2,['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],2,2,2,2,['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],2,2,2,2,['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],
	];
	
	//by default, each stat has a 100 count.
	for(var i = 0 ; i < passiveGrid.length ; i++){
		for(var j = 0 ; j < passiveGrid[i].length ; j++){
			if(typeof passiveGrid[i][j] === 'object'){
				var stat = passiveGrid[i][j][0];
				var value = passiveGrid[i][j][1];
				stat = randomAttribute();
				passiveGrid[i][j] = {'stat':stat,'value':value,'count':100};
			}
			if(typeof passiveGrid[i][j] === 'string'){
				passiveGrid[i][j] = {'type':'custom','value':passiveGrid[i][j],'count':100};
			}
		}
	}
	
	//increase count depending on player popularity
	db.account.find({},{_id:0,passive:1},function(err,info){ if(err) throw err;
		for(var i = 0 ; i < info.length ; i++){
			for(var j = 0 ; j < info[i].passive.length ; j++){
				for(var k = 0 ; k < info[i].passive[j].length ; k++){
					if(info[i].passive[j][k] == '1'){
						passiveGrid[j][k].count++;
					}
				}
			}
		}
		initPassive();
		updatePassiveValue();
	});


}

randomAttribute = function(){
	var array = Object.keys(statDb);
	return array[Math.floor(Math.random()*array.length)]
}





defaultPassive = function(){ 
	return [
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000222200000000',
		'00000000222200000000',
		'00000000222200000000',
		'00000000222200000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
	];
}

//when palyer wants to add a passive
selectPassive = function(key,ii,jj){
	var main = mainList[key];
	if(main.passivePt === 0){ Chat.add(key,"You don't have any Passive Points to use."); return;}
	if(main.passive[ii][jj] === '1'){ Chat.add(key,"You already have this passive.");	return;}
	if(!testPassive(main.passive,ii,jj)){Chat.add(key,"You can't choose this passive yet.");	return;}
	
	main.passivePt--;
	main.passive[ii] = main.passive[ii].slice(0,jj) + '1' + main.passive[ii].slice(jj+1);
	Mortal.permBoost(key,'Passive',convertPassive(main.passive));
}

//convert the list of passive owned by player into actual boost.
convertPassive = function(p){
	var temp = [];
	for(var i = 0 ; i < passiveGrid.length ; i++){
		for(var j = 0 ; j < passiveGrid[i].length ; j++){
			if(p[i][j] == '1' && typeof passiveGrid[i][j] === 'object'){
				if(passiveGrid[i][j].stat){
					temp.push({'type':'base','value':passiveGrid[i][j].value,'stat':passiveGrid[i][j].stat});
				}
				if(passiveGrid[i][j].type === 'custom'){
					temp.push({'type':'custom','value':passiveGrid[i][j].value});
				}
			}
		}
	}
	temp = compilePermBoost(temp);
	return temp;
}






updatePassiveValue = function(){
	for(var i = 0 ; i < passiveGrid.length ; i++){
		for(var j = 0 ; j < passiveGrid[i].length ; j++){
			if(passiveGrid[i][j].stat){
				passiveGrid[i][j].value *= passiveGrid.average / passiveGrid[i][j].count;
			}
		}
	}
}

//test if player can choose a certain passive
testPassive = function(passive,i,j){
	var n = [Math.max(0,i-1),j];
	var s = [Math.min(passiveGrid.length-1,i+1),j];
	var w = [i,Math.max(0,j-1)];
	var e = [i,Math.min(passiveGrid[i].length-1,j+1)];
	var pos = [n,s,w,e];
	
	for(var i in pos){
		var p = passive[pos[i][0]][pos[i][1]];
		if(p === '1' || p === '2'){
			return true;
		}
	}
	return false;	
}


initPassive = function(){
	passiveGrid.min = findMin(passiveGrid,function(a){ return findMin(a,function(b){ return b.count || 1/0; })});  
	passiveGrid.max = findMax(passiveGrid,function(a){ return findMax(a,function(b){ return b.count || -1/0; })});  
	passiveGrid.sum = 0;
	passiveGrid.option = 0;
	for(var i = 0 ; i < passiveGrid.length ; i++){
		for(var j = 0 ; j < passiveGrid[i].length ; j++){
			if(typeof passiveGrid[i][j] === 'object'){
				passiveGrid.sum += passiveGrid[i][j].count;
				passiveGrid.option++;
			}	
		}
	}
	passiveGrid.average = passiveGrid.sum / passiveGrid.option;
}































































