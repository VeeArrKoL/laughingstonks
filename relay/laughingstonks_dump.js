// laughingstonks
// by VeeArr (#2045369)

const kol = require("kolmafia");
const LSJ = require("relay/relay_laughingstonks.js");

module.exports.main = function main(){
	let output="";
	
	output+=handleDump();
	
	let page="<html><head><title>laughingstonks data dump</title></head><body><center>\n"+output+"</center></body></html>";
	
	kol.write(page);
}

function handleDump(){
	let rv="<style>table{border-spacing:0px} tr:nth-child(even){background-color:#FFFFFF} tr:nth-child(odd){background-color:#DDDDDD} td{padding:2px 5px}</style>";
	
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
			tables+=LSJ.buildTable(clazz.classId,pathData.pathId,1,4);
		}
		if(w<6){
			toc+="<td colspan='"+(6-w)+"'></td>";
		}
		toc+="</tr>";
	}
	toc+="</table><br/>\n";
	rv+=toc+tables;
		
	return rv;
}

function getClassPathCombos(){
	rv=[];
				
	for(path of [{id:0,name:"Unrestricted"}, ...Path.all()]){
		let pathData={pathName:path.name,pathId:path.id,classes:[]};
		for(clazz of Class.all()){
			if(clazz.path.id==path.id){
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
