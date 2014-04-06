/*
methodPreDb:Array = raw values
methodDb:Object = all methods, no boost
methodList:Object = boost taking into consideration



visibleLevel: vis lvl for each method is predefined when making db, 
		ppl can change vis level at top, only affect the main table
		
excludeList: list of methods used when making table99, can be changed by clicking use checkbox

*/

/*
hard to buy or sell
custom exp and lvl
restriction (once per week loom)
bonus urn outfit
category of methods ( hide some)
include or exclude from 1-99
multiple links (sc guide)
*/

function generateUseList(){
	var array = [];
	for(var i in methodList){
		if(visibleLevel >= methodList[i].hide){
			array.push({'id':methodList[i].id});
		}
	}
	return array;
}

function generateUseList99(){
	var array = [];
	for(var i in methodList){
		if(!excludeList[methodList[i].id]){
			array.push({'id':methodList[i].id});
		}
	}
	return array;
}

//Update
function update(){
	updateInput();
	
	updateTable();
	updateTable99();
}

function updateTable(){
	var use = generateUseList();

	var content = generateContent(headerWanted,use);
	content = sortContent(content,headerWanted.indexOf(sortBy),sortSign);
	drawTable(divTable,headerWanted,content);
	if(minimizeTable){ minTable(divTable);}
}

function updateTable99(array){
	var use = generateUseList99();
	
	var best99 = findBest99(startExp,endExp,use);
	var content99 = generateContent(headerWanted99,best99);
	content99 = sortContent(content99,headerWanted99.indexOf('Level'),1);
	
	var sum99 = generateSum(headerWanted99,content99);
	
	drawTable(divTable99,headerWanted99,content99,sum99);
	if(minimizeTable){ minTable(divTable99);}
}

function findBest99(s,e,ar){
	var startLvl = getLvlViaExp(s);
	var diffS = s - lvlList[startLvl];
	
	var endLvl = getLvlViaExp(e); 
	var diffE = e - lvlList[endLvl];
	
	var best = [];
	
	var array = generateContent(['Id','Level','Time/1M Exp'],ar);
	array = sortContent(array,2,1);
		
	for(var i = 0; i < array.length ; i++){
		for(var j = 0; j < array[i].length ; j++){
			array[i][j] = array[i][j].replace(/<[^>]*>/g,'');
			array[i][j] = array[i][j].trim();
		}
		array[i][1] = +array[i][1]; 
	}	
	
	var lastlvl = endLvl+1;
	var safe = 0;
	while(lastlvl > startLvl && safe < 10000){	safe++;
		for(var i = 0; i < array.length ; i++){
			if(array[i][1] < lastlvl){ 
				best.unshift(+i); 
				lastlvl = array[i][1]; 
				break;
			}
		}
	}
	
	var list = [];
	for(var i = 0 ; i < best.length ; i++){
		var nextLevel = Math.min(endLvl,99);
		if(best[i+1] !== undefined){ nextLevel = array[best[i+1]][1]; }	

		list.push({'id':array[best[i]][0],'exp':expBetweenLvl(Math.max(startLvl,array[best[i]][1]),nextLevel)});
	}
	if(list){
		list[0].exp -= diffS;
		list[list.length-1].exp += diffE;
	}
	
	return list;
}



function generateContent(headWant,selectedMethods){
	var array = []
	
	//Prepare list of method
	var list = [];
	for(var i in selectedMethods){
		for(var j in methodList){
			if(selectedMethods[i].id == methodList[j].id){ 
				list.push(methodList[j]); 
				break;
			}
		}
	}
	
	//Generate info
	for(var i in list){ 
		var m = list[i];
		
	
	//
	
	//expT	
		var xpWanted = 1; if(selectedMethods[i].exp){ xpWanted = selectedMethods[i].exp; }
		var RexpT = xpWanted;
		var FexpT = formatNum(round(xpWanted,0));
		
	//actionPh		
		var RactionPh = m.actionPh;
		var FactionPh = formatNum(round(RactionPh,0));
		
		if(m.actionPhRange){
			FactionPh = formatNum(round(m.actionPhRange[0],0)) + '-' + formatNum(round(m.actionPhRange[1],0));
		}
		
		
	//name
		var Rname = m.name;
		var IHname = itemDb[m.icon].image;
		
		var Tname = '';
		var IEname = '  ';
		
		if(m.warn.buy){ IEname += IMG['buy'+m.warn.buy]; }
		if(m.warn.sell){ IEname += IMG['sell'+m.warn.sell];}
		
		
		
		var Fname = IHname + ' <span title="' + Tname + '" style="border-bottom: 3px solid">' + Rname + '</span>' + IEname;
		
	//id
		var Fid = m.id;
		
		
	//exlude
		var Rexclude = '';
		if(excludeList[m.id]){ Rexclude = 'checked'; }
		var Texclude = 'Exclude this method from the Level 1-99 Table.';
		var Fexclude = '<input onchange="excludeList[\'' + m.id + '\'] = !excludeList[\'' + m.id + '\']; update();" type="checkbox" title="'+ Texclude +'" class="excludeInput" value="' + m.id + '"' + Rexclude + '>';
	
	//expPaP
		var RexpPaP = IMG[skill] + ' ' + formatNum(round(m.expPa[0],0)) + ' ' + skill + ' Exp' + '<br>';
		for(var j in m.expPa[1]){ RexpPaP += IMG[j] + ' ' + formatNum(round(m.expPa[1][j],0)) + ' ' + j + ' Exp' + '<br>';}
		var FexpPaP = RexpPaP.slice(0,-4); //aka remove last <br>
		
	//expPa	
		var totalExpPa = m.expPa[0];
		for(var j in m.expPa[1]){ totalExpPa += m.expPa[1][j]; }
		
		var RexpPa = round(m.expPa[0],2);
		var TexpPa = convertLight(FexpPaP) + '\r\n = ' + totalExpPa + ' Total Exp';
		var FexpPa	= '<span title="' + TexpPa + '">' + RexpPa + '</span>';
		
	//expPhP
		var RexpPhP = IMG[skill] + ' ' + formatNum(round(m.expPa[0]*RactionPh,-3)) + ' ' + skill + ' Exp/H' + '<br>';
		for(var j in m.expPa[1]){ RexpPhP += IMG[j] + ' ' + formatNum(round(m.expPa[1][j]*RactionPh,-3)) + ' ' + j + ' Exp/H' + '<br>';}
		var FexpPhP = RexpPhP.slice(0,-4); //aka remove last <br>
		
	//expPh	
		var RexpPh = m.expPa[0]*RactionPh;
		var TexpPh = convertLight(FexpPhP);
		var FexpPh	= '<span title="' + TexpPh + '">' + formatNum(round(RexpPh,-3)) + '</span>';	
		
	//gpPa
		var inputGp = 0; for(var j in m.input){inputGp += GEP[j] * m.input[j];}
		var outputGp = 0; for(var j in m.output){outputGp += GEP[j] * m.output[j];}
		
		var RgpPa = outputGp-inputGp;
		var TgpPa = outputGp + ' - ' + inputGp;
		var FgpPa = '<span title="' + TgpPa + '">' + COIN+ colorSign(formatNum(round(RgpPa,0))) + '</span>';
		
	//gpPe	
		var RgpPe = RgpPa/RexpPa;
		var TgpPe = formatNum(RgpPa) + ' Gp / ' + formatNum(RexpPa) + ' Exp'
		var FgpPe = '<span title="' + TgpPe + '">' + COIN+ colorSign(formatNum(round(RgpPe,2))) + '</span>';	
	
	//gpPh	
		var RgpPh = RgpPa*RactionPh;
		var FgpPh = COINS+ colorSign(formatNum(round(RgpPh,-3)));
		
	//FgpPm
		var RgpPm = MILLION*RgpPe;
		var FgpPm = COINS+ colorSign(formatNum(round(RgpPm,-3)));
	
	//timeGpPm
		var RtimeGpPm = -RgpPm/RincomePh;
		var FtimeGpPm = convertTime(RtimeGpPm,2);
	
	//timeExpPm
		var RtimeExpPm = MILLION/RexpPh;
		var FtimeExpPm = convertTime(RtimeExpPm,2);
	
	//timePm
		var RtimePm = RtimeGpPm + RtimeExpPm
		var TtimePm = 'Gp: ' + convertTime(RtimeGpPm,2) + ' + Exp: ' + convertTime(RtimeExpPm,2)
		var FtimePm = '<span title="' + TtimePm + '">' + convertTime(RtimePm,2) + '</span>';		

	//inputItem
		var RinputItem = '';	
		for(var j in m.input){	
			var image = IMG[j];
			if(itemDb[j].buy){ 
				var str = ' style="border:2px solid ' + warnColor[itemDb[j].buy] + '" title="This item may be hard to buy."';
				image = image.insertAt(4,str);
			}
			var amm = m.input[j];
			if(amm < 0.1){ amm = '1/' + Math.round(1/amm) } else { amm = round(amm,2); }
			RinputItem += image + '<span title="' + formatNum(Math.round(itemDb[j].price)) + ' Gp' + '">' + '  x' + amm + ' ' + itemDb[j].name + '</span><br>';
		}
		var FinputItem = RinputItem.slice(0,-4); //aka remove last <br>
	
	//outputItem
		var RoutputItem = ''; 
		for(var j in m.output){	
			var image = IMG[j];
			if(itemDb[j].sell){ 
				var str = ' style="border:2px solid ' + warnColor[itemDb[j].sell] + '" title="This item may be hard to sell."';
				image = image.insertAt(4,str);
			}
			var amm = m.output[j];
			if(amm < 0.1){ amm = '1/' + Math.round(1/amm) } else { amm = round(amm,2); }
			RoutputItem += image + '<span title="' + formatNum(Math.round(itemDb[j].price)) + ' Gp' + '">' + '  x' + amm + ' ' + itemDb[j].name + '</span><br>';
		}
		
		var FoutputItem = RoutputItem.slice(0,-4); //aka remove last <br>

	//Req
		var Rreq = ''; for(var j in m.req.lvl){Rreq += IMG[j] + ' Level ' + m.req.lvl[j] + ' ' + j  + '<br>';}
		for(var j in m.req.quest){ Rreq += QUEST + m.req.quest[j];}
		var Freq = Rreq.slice(0,-4); //aka remove last <br>
	
	//lvl
		var Rlvl = m.lvl;
		var Tlvl = convertLight(Freq);
		var Flvl = '<span title="' + Tlvl + '">' + Rlvl + '</span>';	
	
	//Gp/Exp+
		var totalExpPa = m.expPa[0];
		for(var j in m.expPa[1]){ totalExpPa += m.expPa[1][j]; }
		
		var RgpPeP = RgpPa / totalExpPa;
		var TgpPeP = TexpPa;
		var FgpPeP =  '<span title="' + TgpPeP + '">' + COIN+ colorSign(formatNum(round(RgpPeP,2))) + '</span>';	
		
			
	//Video
		if(m.video){
			if(typeof m.video == 'number' || typeof m.video == 'string' ){
				var time = Math.floor(m.video/60) + ':' + m.video%60;
			} else {var time = Math.floor(m.video.time/60) + ':' + m.video.time%60;	}
			
			var Rvideo = time;
			var Fvideo = '<span style="cursor:pointer" onmouseup="setYoutube(\'' + m.video + '\')' + '" >@' + Rvideo + '</span>'
		} else { var Rvideo = ''; var Fvideo = ''; }
		
		
		
//LEVEL 99//
	
	//actionT
		var RactionT = RexpT / RexpPa;
		var FactionT = formatNum(round(RactionT,0));
		
	//expTP
		var RexpTP = IMG[skill] + ' ' + formatNum(round(RexpT,0)) + ' ' + skill + ' Exp' + '<br>';
		for(var j in m.expPa[1]){ 
			var expOtherSkill = RexpT * m.expPa[1][j]/ RexpPa;
			RexpTP += IMG[j] + ' ' + formatNum(round(expOtherSkill,0)) + ' ' + j + ' Exp' + '<br>';
		}
		var FexpTP = RexpTP.slice(0,-4); //aka remove last <br>
	
	//inputItemT
		var RinputItemT = '';	
		for(var j in m.input){	
			var image = IMG[j];
			if(itemDb[j].buy){ 
				var str = ' style="border:2px solid ' + warnColor[itemDb[j].buy] + '" title="This item may be hard to buy."';
				image = image.insertAt(4,str);
			}
			RinputItemT += image + '  x' + formatNum(round(m.input[j]*RactionT,0)) + ' ' + itemDb[j].name + '<br>';
			
		}
		var TinputItemT = convertLight(RinputItem);
		var FinputItemT = '<span title="' + TinputItemT + '">' + RinputItemT.slice(0,-4) + '</span>';	
	
	//outputItemT
		var RoutputItemT = ''; 
		for(var j in m.output){ 
			var image = IMG[j];
			if(itemDb[j].sell){ 
				var str = ' style="border:2px solid ' + warnColor[itemDb[j].sell] + '" title="This item may be hard to sell."';
				image = image.insertAt(4,str);
			}
			RoutputItemT += image + '  x' + formatNum(round(m.output[j]*RactionT,0)) + ' ' + itemDb[j].name + '<br>';
		}
		
		var ToutputItemT = convertLight(RoutputItem);
		var FoutputItemT = '<span title="' + ToutputItemT + '">' + RoutputItemT.slice(0,-4) + '</span>';	
	
	//gpT
		var RgpT = RexpT*RgpPe;
		var FgpT = COINS+ colorSign(formatNum(round(RgpT,-3)));
	
	//timeGpT
		var RtimeGpT = -RgpT/RincomePh;
		var FtimeGpT = convertTime(RtimeGpT,2);
	
	//timeExpT
		var RtimeExpT = RexpT/RexpPh;
		var FtimeExpT = convertTime(RtimeExpT,2);
	
	//timeT
		var RtimeT = RtimeGpT + RtimeExpT
		var TtimeT = 'Gp: ' + convertTime(RtimeGpT,2) + ' + Exp: ' + convertTime(RtimeExpT)
		var FtimeT = '<span title="' + TtimeT + '">' + convertTime(RtimeT) + '</span>';		

		
		
		
		////CONCLUSION////
		
		var head = {
			'X':Fexclude,
			'Method':Fname,
			'Wikia':'<a href="' + m.wikia +'">Wikia</a>',
			'Exp/Action':FexpPa,
			'Exp+/Action':FexpPaP,
			'Exp/H':FexpPh,
			'Exp+/H':FexpPhP,
			'Gp/Action':FgpPa,
			'Gp/Exp':FgpPe,
			'Gp/Exp+':FgpPeP,
			'Gp/H':FgpPh,
			'Action/H':FactionPh,
			'Input':FinputItem,
			'Output':FoutputItem,
			'Level':Flvl,
			'Requirements':Freq,
			'Video':Fvideo,
			
			
			//For Main Only
			'Gp/1M Exp':FgpPm,
			'Time For Gp/1M Exp':FtimeGpPm,
			'Time For Exp/1M Exp':FtimeExpPm,
			'Time/1M Exp':FtimePm,
			
		
			//For 99 Only
			'Total Action':FactionT,
			'Total Exp':FexpT,
			'Total Exp+':FexpTP,
			'Total Input':FinputItemT,
			'Total Output':FoutputItemT,
			'Total Gp':FgpT,
			'Total Time For Gp':FtimeGpT,
			'Total Time For Exp':FtimeExpT,		
			'Total Time':FtimeT,
			
			//Private
			'Id':Fid,
			
		};
		
		var index = array.push([])-1;
		for(var j = 0 ; j < headWant.length ; j++){
			array[index][j] = head[headWant[j]];		
		}
		
		
		array[index].method = m;
		
		
		array[index].base = {
			'Rname':Rname,
			'RexpPa':RexpPa,
			'RexpPaP':RexpPaP,
			'RexpPh':RexpPh,
			'RexpPhP':RexpPhP,
			'RgpPa':RgpPa,
			'RgpPe':RgpPe,
			'RgpPeP+':RgpPeP,
			'RgpPh':RgpPh,
			'RactionPh':RactionPh,
			'RinputItem':RinputItem,
			'RoutputItem':RoutputItem,
			'Rlvl':Rlvl,
			'Rreq':Rreq,
			'Rvideo':Rvideo,
			
			
			//For Main Only
			'RgpPm':RgpPm,
			'RtimeGpPm':RtimeGpPm,
			'RtimeExpPm':RtimeExpPm,
			'RtimePm':RtimePm,
			
		
			//For 99 Only
			'RactionT':RactionT,
			'RexpT':RexpT,
			'RexpTP+':RexpTP,
			'RinputItemT':RinputItemT,
			'RoutputItemT':RoutputItemT,
			'RgpT':RgpT,
			'RtimeGpT':RtimeGpT,
			'RtimeExpT':RtimeExpT,		
			'RtimeT':RtimeT,
			
			//From methods
			'expPa':m.expPa,
			'inputItem':m.input,
			'outputItem':m.output,
			
			
		}
		
		
		
		
		
	}
	
	return array;
}


function sortContent(array,by,sign){
	array.sort(function(a,b){
		if(by == -1){ by = 0; }
		
		a = convertForSorting(a[by]);
		b = convertForSorting(b[by]);
		
		if(a < b){ return -1 * sign; }
		if(a > b){ return 1 * sign; }
		
		return 0;
	});
	return array;
}

function drawTable(table,head,body,sum){
	var string = '<table id="table">';
	
	//Header
	
	string += '<tr>';
	for(var i = 0; i < head.length ; i++){
		var str = '';
		if(table == divTable){ str = 'onmouseup="changeSort(\'' + head[i] + '\')' + '"'; }
		string += '<td ' + str + ' >' + head[i] + '</td>';
	}
	string += '</tr>';
	
	//Content
	for(var i = 0; i < body.length ; i++){
		string += '<tr>';
		for(var j = 0 ; j < body[i].length ; j++){
			string += '<td>' + body[i][j] + '</td>';
		}
		string += '</tr>';
	}
		
	if(sum){
		string += '<tr>';
		for(var i = 0; i < head.length ; i++){
			string += '<td> --- </td>'; 
		}
		string += '</tr>';
	
		string += '<tr>';
		for(var i = 0; i < sum.length ; i++){
			string += '<td>' + sum[i] + '</td>';
		}
		string += '</tr>';
	}


	string += '</table>';

	table.innerHTML = string;

	
}

function generateSum(head,array,complexe){
	var sum = [];
	
	
	for(var i = 0 ; i < head.length ; i++){
		if(head[i] == 'Method'){ if(!complexe){sum.push('Sum / Average'); } else {
			var str = array[0].base['Rname'];
			sum.push(str); 
			
			
			
			
		}}
		
		if(head[i] == 'Video'){ if(!complexe){ sum.push('');  } else {
			var str = array[0].base['Rvideo'];			
		}}
		
	
		if(head[i] == 'Level'){ if(!complexe){ sum.push('');  } else {
			
			
		}}
		
		if(head[i] == 'Requirements'){ if(!complexe){ sum.push('');  } else {
			
			
		}}
		
		if(head[i] == 'Action/H'){ if(!complexe){ sum.push('');  } else {
			
			
		}}
		
		
		if(head[i] == 'Exp/Action'){ if(!complexe){ sum.push('');  } else {
			
			
		}}
		
		if(head[i] == 'Total Input'){ if(!complexe){ sum.push('');  } else {
			
			
		}}
		
		if(head[i] == 'Total Output'){ if(!complexe){ sum.push('');  } else {
			
			
		}}
		
		if(head[i] == 'X'){ if(!complexe){ sum.push('X');  } else {
			
			
		}}	
		
		if(head[i] == 'Total Action'){ 
			var temp = 0;for(var j = 0 ; j < array.length ; j++){temp += array[j].base['RactionT'];}
			sum.push(formatNum(round(temp,0)));
		}
		
		if(head[i] == 'Total Time For Exp'){ 
			var temp = 0;for(var j = 0 ; j < array.length ; j++){temp += array[j].base['RtimeExpT'];	}
			sum.push(formatNum(round(temp,2)));
		}
		
		if(head[i] == 'Total Time For Gp'){ 
			var temp = 0;for(var j = 0 ; j < array.length ; j++){temp += array[j].base['RtimeGpT'];}
			sum.push(formatNum(round(temp,2)));
		}
		
		if(head[i] == 'Total Time'){ 
			var temp = 0;for(var j = 0 ; j < array.length ; j++){temp += array[j].base['RtimeT'];}
			sum.push(formatNum(round(temp,2)));
		}
		
		if(head[i] == 'Total Exp'){ 
			var temp = 0;for(var j = 0 ; j < array.length ; j++){temp += array[j].base['RexpT'];}
			sum.push(formatNum(round(temp,0)));
		}
		
		if(head[i] == 'Total Gp'){ 
			var temp = 0;for(var j = 0 ; j < array.length ; j++){temp += array[j].base['RgpT'];}
			sum.push(COINS + colorSign(formatNum(round(temp,-3))));
		}
	
		if(head[i] == 'Exp/H'){ 
			var temp = 0; for(var j = 0 ; j < array.length ; j++){temp += array[j].base['RexpT'];}
			var temp1 = 0;	for(var j = 0 ; j < array.length ; j++){temp1 += array[j].base['RtimeExpT'];	}
			sum.push(formatNum(round(temp/temp1,-3)));
		}
		if(head[i] == 'Gp/H'){ 
			var temp = 0; for(var j = 0 ; j < array.length ; j++){temp += array[j].base['RgpT'];}
			var temp1 = 0;	for(var j = 0 ; j < array.length ; j++){temp1 += array[j].base['RtimeExpT'];	}
			sum.push(COINS + colorSign(formatNum(round(temp,-3))));
		}
		
		if(head[i] == 'Gp/Exp'){ 
			var temp = 0; for(var j = 0 ; j < array.length ; j++){temp += array[j].base['RgpT'];}
			var temp1 = 0;	for(var j = 0 ; j < array.length ; j++){temp1 += array[j].base['RexpT'];	}
			sum.push(COIN + colorSign(formatNum(round(temp/temp1,2))));
		}		
		
		if(head[i] == 'Total Exp+'){ 
			var str = '';
			var exp = {}; for(var j in skillList){ exp[skillList[j]] = 0; }
			var mainExp = 0; for(var j = 0 ; j < array.length ; j++){mainExp += array[j].base['RexpT'];}
			exp[skill] = mainExp;
			
			for(var j = 0 ; j < array.length ; j++){
				var info = array[j].base['expPa'][1];	
				if(info){for(var k in info){	exp[k] += info[k] * array[j].base['RactionT'];}	}
			}
			
			for(var j in exp){if(exp[j]){str += IMG[j] + ' ' + formatNum(round(exp[j],0)) + ' ' + j + ' Exp' + '<br>';}}
			
			sum.push(str);
		}
		
		
		
		if(head[i] == 'Gp/Exp+'){ 
			var temp = 0; for(var j = 0 ; j < array.length ; j++){temp += array[j].base['RgpT'];}
			
			
			var total = 0;
			for(var j = 0 ; j < array.length ; j++){total += array[j].base['RexpT'];}
			
			for(var j = 0 ; j < array.length ; j++){
				var info = array[j].base['expPa'][1];	
				if(info){for(var k in info){ total += info[k] * array[j].base['RactionT'];}	}
			}
			
			sum.push(COIN + colorSign(formatNum(round(temp/total,2))));
		}
		
		
		
		
		
	
	}

	return sum;
}










