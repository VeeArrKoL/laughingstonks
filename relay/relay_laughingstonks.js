// laughingstonks
// by VeeArr (#2045369)

const kol = require("kolmafia");
const LS = require("laughingstonks.ash");

const MY_FILENAME="./relay_laughingstonks.js";
const MAX_DAYS=4;

module.exports.main = function main(){
	let output="";
	
	let fields=kol.formFields();
	let config=parseConfig(fields);
	
	if(!config.dumpAll){
		output+=handleSearchBar(config);
	}
	output+=handleSearch(config);
	
	let page="<html><head><title>laughingstonks</title></head><body><center>\n"+output+"</center></body></html>";
	
	kol.write(page);
}

function parseConfig(fields){
	let classId=kol.myClass().id;
	if("classId" in fields){
		classId=parseInt(fields["classId"]);
	}
	
	let pathId=kol.myPathId();
	if("pathId" in fields){
		pathId=parseInt(fields["pathId"]);
	}
	
	let maxDaysDisplayed=getMaxDaysDisplayed();
	let daycountMin=1;
	let daycountMax=MAX_DAYS;
	if(maxDaysDisplayed<MAX_DAYS){
		daycountMin=kol.myDaycount();
		if("daycountMin" in fields){
			daycountMin=parseInt(fields["daycountMin"]);
		}
		
		let daycountMaxHardCap=Math.min(MAX_DAYS,daycountMin+maxDaysDisplayed-1);
		daycountMax=daycountMaxHardCap;
		if("daycountMax" in fields){
			daycountMax=parseInt(fields["daycountMax"]);
		}
		daycountMax=Math.max(daycountMin,Math.min(daycountMax,daycountMaxHardCap));
	}
	
	let dumpAll=false;
	if("dumpAll" in fields && fields["dumpAll"]=="true"){
		dumpAll=true;
	}
	
	return {classId,pathId,daycountMin,daycountMax,dumpAll};
}

function handleSearchBar(config){
	let rv="";
	rv+="<form action='"+MY_FILENAME+"'>";
	rv+="<input type='hidden' name='relay' value='true'/>";
	
	rv+="Class: <select name='classId'>";
	let classListing=[];
	for(clazz of Class.all()){
		classListing.push({id:clazz.id,name:kol.toString(clazz)});
	}
	classListing.sort((a,b)=>a.id-b.id);
	for(clazz of classListing){
		rv+="<option value='"+clazz.id+"'"+(clazz.id==config.classId?" selected":"")+">"+clazz.name+"</option>";
	}
	rv+="</select><br/>";
	
	rv+="Path: <select name='pathId'>";
	let pathListing=[];
	let maxId=0;
	for(path of Path.all()){
		pathListing.push({id:path.id,name:path.name});
		if(path.id<200){
			maxId=Math.max(maxId,path.id);
		}
	}
	pathListing.push({id:0,name:"Unrestricted"});
	pathListing.push({id:maxId+1,name:"&lt;next path&gt;"});
	pathListing.sort((a,b)=>a.id-b.id);
	for([idx,path] in pathListing){
		rv+="<option value='"+path.id+"'"+(path.id==config.pathId?" selected":"")+">"+path.name+"</option>";
	}
	rv+="</select><br/>";
	
	if(getMaxDaysDisplayed()<MAX_DAYS){
		rv+="Days: <select name='daycountMin'>";
		for(d=1;d<=MAX_DAYS;d++){
			rv+="<option value='"+d+"'"+(d==config.daycountMin?" selected":"")+">"+d+"</option>";
		}
		rv+="</select> - <select name='daycountMax'>";
		for(d=1;d<=MAX_DAYS;d++){
			rv+="<option value='"+d+"'"+(d==config.daycountMax?" selected":"")+">"+d+"</option>";
		}
		rv+="</select><br/>";
	}
	
	rv+="<br/><button type='submit' name='action' value='search'>Search</button></form>";
	
	return rv+"\n";
}

function handleSearch(config){
	let rv="<style>table{border-spacing:0px} tr:nth-child(even){background-color:#FFFFFF} tr:nth-child(odd){background-color:#DDDDDD} td{padding:2px 5px}</style>";
	
	if(config.dumpAll){
		toc="<a name='toc'/><table>";
		tables="";
		idx=0;
		for(pathData of getClassPathCombos()){
			toc+="<tr><td>"+pathData.pathName+"</td>";
			let w=0;
			for(clazz of pathData.classes){
				idx++;
				w++;
				let abbrClassName=clazz.className.match(/\b\S/g).join("").toUpperCase();
				toc+="<td><a href='#a"+idx+"'>"+abbrClassName+"</a></td>";
				tables+="<a name='a"+idx+"'/><b>"+pathData.pathName+" / "+clazz.className+"</b> <a href='#toc'>&uarr;</a><br/>";
				tables+=buildTable(clazz.classId,pathData.pathId,1,4);
			}
			if(w<6){
				toc+="<td colspan='"+(6-w)+"'></td>";
			}
			toc+="</tr>";
		}
		toc+="</table><br/>\n";
		rv+=toc+tables;
	}else{
		rv+="<b>Results:</b><br/><br/>";
		rv+=buildTable(config.classId,config.pathId,config.daycountMin,config.daycountMax);
	}
	return rv;
}

function buildTable(classId,pathId,daycountMin,daycountMax){
	rv="<table><tr style='background-color:#FFFFFF'>";
	for(day=daycountMin;day<=daycountMax;day++){
		rv+="<th>Day "+day+"</th>";
	}
	rv+="</tr><tr>\n";
	for(day=daycountMin;day<=daycountMax;day++){
		rv+="<td style='vertical-align:top'>";
		rv+=buildTableForDay(classId,pathId,day);
		rv+="</td>\n";
	}
	rv+="</tr></table><br/>\n";
	return rv;
}

const ADV_ICONS={"classic banana":"bigglasses","antique watermelon":"strboost","quince":"dinseybrain"};

function buildTableForDay(classId,pathId,day){
	let maxF=500;
	let maxFP=kol.getProperty("laughingstonks_maxFights");
	if(maxFP!=""){
		maxF=parseInt(maxFP);
	}
	
	let results=LS.laughingStockDrops(classId,pathId,day,maxF);
	
	let rv="<table>";
	rv+="<tr><th>Fight #</th><th colspan=2>Drop</th></tr>";
	for([fight,drop] in results){
		let dropName=drop.name;
		let isAdv=false;
		let icon="";
		if(dropName in ADV_ICONS){
			isAdv=true;
			icon="<img src='images/itemimages/"+ADV_ICONS[dropName]+".gif'/>";
		}
		rv+="<tr"+(isAdv?" style='font-weight:bold'":"")+"><td style='text-align:right'>"+fight+"</td><td>"+dropName+"</td><td>"+icon+"</td></tr>";
	}
	rv+="</table>";
	
	return rv;
}

function getMaxDaysDisplayed(){
	let maxDaysDisplayed=4;
	let maxDaysDisplayedP=kol.getProperty("laughingstonks_maxDaysDisplayed");
	if(maxDaysDisplayedP!=""){
		maxDaysDisplayed=parseInt(maxDaysDisplayedP);
	}
	return Math.min(maxDaysDisplayed,MAX_DAYS);
}

function getClassPathCombos(){
	rv=[];
				
	for(path of [Path.get("none"), ...Path.all()]){
		let pathName=path.id==0?"Unrestricted":path.name;
		let pathData={pathName,pathId:path.id,classes:[]};
		for(clazz of Class.all()){
			if(clazz.path==path){
				pathData.classes.push({classId:clazz.id,className:kol.toString(clazz)});
			}
		}
		if(pathData.classes.length==0){
			for(i=1;i<=6;i++){
				clazz=kol.toClass(i);
				pathData.classes.push({classId:clazz.id,className:kol.toString(clazz)});
			}
		}
		pathData.classes.sort((a,b)=>a.classId-b.classId);
		rv.push(pathData);
	}
	
	rv.sort((a,b)=>a.pathId-b.pathId);
	return rv;
}
