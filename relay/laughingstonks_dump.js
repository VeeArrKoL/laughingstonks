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
	
	let toc="<h2><a href='https://github.com/VeeArrKoL/laughingstonks'>laughingstonks</a></h2><a name='toc'/><table><tr style='background-color:#FFFFFF; vertical-align:top'><td><table>\n";
	let tables="";
	let idx=0;
	let i=0;
	let combos=getClassPathCombos();
	for(pathData of combos){
		toc+="<tr><td>"+pathData.pathName+"</td>\n";
		let w=0;
		for(clazz of pathData.classes){
			idx++;
			w++;
			let abbrClassName=clazz.className.match(/\b\S/g).join("").toUpperCase();
			toc+="<td><a href='#a"+idx+"'>"+abbrClassName+"</a></td>";
			tables+="<h3><a name='a"+idx+"'/><b>"+pathData.pathName+" / "+clazz.className+"</b> <a style='text-decoration:none' href='#toc'>&#10548;</a></h3>";
			tables+=LSJ.buildTable(clazz.classId,pathData.pathId,1,4);
		}
		if(w<6){
			toc+="<td colspan='"+(6-w)+"'></td>";
		}
		toc+="</tr>";
		i++;
		if(i==Math.ceil(combos.length/2)){
			toc+="</table></td><td><table>";
		}
	}
	toc+="</table></td></tr></table>\n";
	rv+=toc+"<br/><hr/><br/>\n"+tables;
		
	return rv;
}

function getClassPathCombos(){
	rv=[];
	
	let nextId=Path.all().sort((a,b)=>b.id-a.id)[1].id+1;
				
	for(path of [{id:0,name:"Unrestricted"},{id:nextId,name:"&lt;next path: ID #"+nextId+"&gt;"}, ...Path.all()]){
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
