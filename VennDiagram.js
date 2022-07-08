var gen,ss,ss1,ss2,el,ss3;
define( ["qlik", "css!./VennDiagram.css"],
	function ( qlik, template ) {




  return {
    initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 3,
                    qHeight: 3300
                }]
            }
        },
    definition: {
		type: "items",
		component: "accordion",
		items: {
			dimensions: {
                    uses: "dimensions",
                    min: 2,
                    max: 2
                },
			measures: {
                    uses: "measures",
                    min: 0,
                    max: 1
                },
			appearancePanel:{
				uses: "settings",
				items:{
					Header1: {
						type: "items",
						label: "Text and Colors",
							items: {
								MyColorPicker:{
									ref: "color_1",
									component: "color-picker",
									type: "object",
									label: "1st Color",
									defaultValue: {
										color: "#000000",
										index: "1"
									}
							},
								MyColorPicker2:{
									ref: "color_2",
									component: "color-picker",
									type: "object",
									label: "2nd Color",
									defaultValue: {
										color: "#000000",
										index: "1"
									}
							},
								MyColorPicker3:{
									ref: "color_3",
									component: "color-picker",
									type: "object",
									label: "3rd Color",
									defaultValue: {
										color: "#000000",
										index: "1"
									}
							},
								MyFontSizeProp:{
									ref: "label_size",

									type: "number",
									label: "Label Font Size",
									defaultValue: 14
								},
								MyFontSizeProp2:{
									ref: "value_size",

									type: "number",
									label: "Values Font Size",
									defaultValue: 14
								},
								
								MyFontSizeProp3:{
									ref: "border_width",

									type: "number",
									label: "Border Width",
									defaultValue: 1
								}
					
						
						
					}
					}
				}
			}
		}
	
	
	},
    template: template,
    paint: function($element, layout) {
		
		$element.empty();
	
		function pixel(x){
			cWidth = c.offsetWidth;
			cHeight = c.offsetHeight;

			var	talesize = 20;
			var talestep = Math.min(cWidth,cHeight)/talesize;
			
			return x*talestep; 
		}
		
		
		
		var considerValue = true;
		var setList = [];
		function addItemInSet(setName,ItemName,ItemValue){
			var setId = setList.map(function (e) { return e.name; }).indexOf(setName);
			if(setId < 0){
				if(setList.length >= 3) return
				
				var setObject = {
					name:setName,
					itens:[]
				}
				
				setList.push(setObject);
				setId = setList.map(function (e) { return e.name; }).indexOf(setName);
				
			}
			
			var item = {
				name:ItemName,
				value:ItemValue
			};
			
			setList[setId].itens.push(item);
				
			
		}
		
		var Venn = [];
		
		function OnlySet(setId){
			var subSet = {
				alias:setId.toString(),
				itens:[],
				sum:function(){
					return this.itens.map(function (e) { return e.value; }).reduce(function(a, b) { return a + b; }, 0);
				},
				count:function(){
					return this.itens.length;
				},
				total:0
			};
			var setItens = JSON.parse(JSON.stringify(setList[setId].itens));
			
			var compareItensName = [];
			
			for(var i = 0; i < setList.length;i++){
				if(i != setId){
					compareItensName = compareItensName.concat(setList[i].itens.map(function (e) { return e.name; }));
					
					
				}
				
			}
			
			for(var i = 0; i < setItens.length;i++){
				if(!compareItensName.includes(setItens[i].name)){
					subSet.itens.push(setItens[i]);
				}
			
			}
			
			return subSet;
			
		
		}
		
		function Intersect2(setId1,setId2){
			var subSet = {
				alias:(setId1.toString()+setId2.toString()),
				itens:[],
				sum:function(){
					return this.itens.map(function (e) { return e.value; }).reduce(function(a, b) { return a + b; }, 0);
				},
				count:function(){
					return this.itens.length;
				},
				total:0
			};
			
			var setItens1 = JSON.parse(JSON.stringify(setList[setId1].itens));
			var ItensName1 = setList[setId1].itens.map(function (e) { return e.name; });
			var setItens2 = JSON.parse(JSON.stringify(setList[setId2].itens));
			var ItensName2 = setList[setId2].itens.map(function (e) { return e.name; });
			
			var compareItensName = [];
			
			for(var i = 0; i < setList.length;i++){
				if(i != setId1 && i != setId2){
					compareItensName = compareItensName.concat(setList[i].itens.map(function (e) { return e.name; }));
					
					
				}
				
			}
			
			
			for(var i = 0; i < setItens1.length;i++){
				if(!compareItensName.includes(setItens1[i].name) && ItensName2.includes(setItens1[i].name)){
					subSet.itens.push(setItens1[i]);
				}
			
			}
			
			for(var i = 0; i < setItens2.length;i++){
			
				if(considerValue){
					if(!compareItensName.includes(setItens2[i].name) && ItensName1.includes(setItens2[i].name)){
						subSet.itens.push(setItens2[i]);
					}
				}
				else{
					if(!compareItensName.includes(setItens2[i].name) && ItensName1.includes(setItens2[i].name)  && !subSet.itens.map(function (e) { return e.name; }).includes(setItens2[i].name)){
						subSet.itens.push(setItens2[i]);
					}
				}
				
				
			
			}
			
			return subSet;
			
			
		}
		
		function Intersect3(setId1,setId2,setId3){
			var subSet = {
				alias:(setId1.toString() + setId2.toString() + setId3.toString()),
				itens:[],
				sum:function(){
					return this.itens.map(function (e) { return e.value; }).reduce(function(a, b) { return a + b; }, 0);
				},
				count:function(){
					return this.itens.length;
				},
				total:0
			};
			
			var setItens1 = JSON.parse(JSON.stringify(setList[setId1].itens));
			var ItensName1 = setList[setId1].itens.map(function (e) { return e.name; });
			var setItens2 = JSON.parse(JSON.stringify(setList[setId2].itens));
			var ItensName2 = setList[setId2].itens.map(function (e) { return e.name; });
			var setItens3 = JSON.parse(JSON.stringify(setList[setId3].itens));
			var ItensName3 = setList[setId3].itens.map(function (e) { return e.name; });
			
			for(var i = 0; i < setItens1.length;i++){
				if(ItensName2.includes(setItens1[i].name) && ItensName3.includes(setItens1[i].name)){
					subSet.itens.push(setItens1[i]);
				}
			
			}
			
			
			
			for(var i = 0; i < setItens2.length;i++){
			
				if(considerValue){
					if(ItensName1.includes(setItens2[i].name) && ItensName3.includes(setItens2[i].name)){
						subSet.itens.push(setItens2[i]);
					}
				}
				else{
					if(ItensName1.includes(setItens2[i].name) && ItensName3.includes(setItens2[i].name)  && !subSet.itens.map(function (e) { return e.name; }).includes(setItens2[i].name)){
						subSet.itens.push(setItens2[i]);
					}
				}
				
				
			
			}
			
			for(var i = 0; i < setItens3.length;i++){
			
				if(considerValue){
					if(ItensName1.includes(setItens3[i].name) && ItensName2.includes(setItens3[i].name)){
						subSet.itens.push(setItens3[i]);
					}
				}
				else{
					if(ItensName1.includes(setItens3[i].name) && ItensName2.includes(setItens3[i].name)  && !subSet.itens.map(function (e) { return e.name; }).includes(setItens3[i].name)){
						subSet.itens.push(setItens3[i]);
					}
				}
				
				
			
			}
			
			return subSet;
			
			
		}
		function buildVenn(){
		
			if(setList.length == 2){
				Venn.push(OnlySet(0));
				Venn.push(OnlySet(1));
				
				Venn.push(Intersect2(0,1));
			}
			if(setList.length == 3){
				Venn.push(OnlySet(0));
				Venn.push(OnlySet(1));
				Venn.push(OnlySet(2));
				
				Venn.push(Intersect2(0,1));
				Venn.push(Intersect2(0,2));
				Venn.push(Intersect2(1,2));
				
				Venn.push(Intersect3(0,1,2));
				
			}
			
			for(var i = 0; i < Venn.length; i++){
				if(considerValue){
					Venn[i].total = Venn[i].sum();
				}
				else{
					Venn[i].total = Venn[i].count();
				}
			}
			
			
		
		}
		
		function drawCircles(){
			if(setList.length == 2){
				ctx.beginPath();
				ctx.lineWidth = layout.border_width;
				ctx.strokeStyle = layout.color_1.color;
	   			ctx.arc(pixel(10),pixel(9), pixel(6.5), 0, 2 * Math.PI);
       	   		ctx.stroke();
				
				ctx.beginPath();
				ctx.strokeStyle = layout.color_2.color;
	   			ctx.arc(pixel(16),pixel(9), pixel(6.5), 0, 2 * Math.PI);
       	   		ctx.stroke();
				
				ctx.lineWidth = 1;
			}
			
			if(setList.length == 3){
				ctx.beginPath();
				ctx.lineWidth = layout.border_width;
				ctx.strokeStyle = layout.color_1.color;
	   			ctx.arc(pixel(9),pixel(7), pixel(5.5), 0, 2 * Math.PI);
       	   		ctx.stroke();
				
				ctx.beginPath();
				ctx.strokeStyle = layout.color_2.color;
	   			ctx.arc(pixel(15),pixel(7), pixel(5.5), 0, 2 * Math.PI);
       	   		ctx.stroke();
				
				ctx.beginPath();
				ctx.strokeStyle = layout.color_3.color;
	   			ctx.arc(pixel(12),pixel(13.06), pixel(5.5), 0, 2 * Math.PI);
       	   		ctx.stroke();
				
				ctx.lineWidth = 1;
				
			}
		}
		
		function drawLabels(){
			if(setList.length == 2){
				ctx.fillStyle = layout.color_1.color;
				ctx.font = layout.label_size+"px Arial";
				ctx.fillText(setList[0].name,pixel(4.5),pixel(2));
				
				ctx.fillStyle = layout.color_2.color;
				ctx.font = layout.label_size+"px Arial";
				ctx.fillText(setList[1].name,pixel(17),pixel(2));
			}
			if(setList.length == 3){
				ctx.fillStyle = layout.color_1.color;
				ctx.font = layout.label_size+"px Arial";
				ctx.fillText(setList[0].name,pixel(3.5),pixel(1));
				
				ctx.fillStyle = layout.color_2.color;
				ctx.font = layout.label_size+"px Arial";
				ctx.fillText(setList[1].name,pixel(16),pixel(1));
				
				ctx.fillStyle = layout.color_3.color;
				ctx.font = layout.label_size+"px Arial";
				ctx.fillText(setList[2].name,pixel(17.3),pixel(16));
			
			}
		}
		
		function drawValues(){
			
			if(setList.length == 2){
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '0' })[0].total,
					pixel(7),
					pixel(9)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '1' })[0].total,	
					pixel(19),
					pixel(9)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '01' })[0].total,
					pixel(13),
					pixel(9)
				);
			}
			if(setList.length == 3){
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '0' })[0].total,
					pixel(8),
					pixel(6)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '1' })[0].total,	
					pixel(16),
					pixel(6)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '2' })[0].total,
					pixel(12),
					pixel(13.8)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '01' })[0].total,
					pixel(12),
					pixel(6)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '02' })[0].total,	
					pixel(9.5),
					pixel(11)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '12' })[0].total,	
					pixel(14.5),
					pixel(11)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '012' })[0].total,	
					pixel(12),
					pixel(9.5)
				);
			}
		
		}
		
		
		function draw(){
			
			drawCircles();
			drawLabels();
			drawValues();
		}
		
		

		
		function calculateVenn(matrix){
			for(var i = 0;i < matrix.length;i++){
				var rowValue;
				if(considerValue){
					rowValue = matrix[i][2].qNum
				}
				else{
					rowValue = 0;
				}
			
				addItemInSet(matrix[i][0].qText,matrix[i][1].qText,rowValue);
			
			}
			
			buildVenn();
			
			
			
			console.log('1');
			
		}
		
		
	
		var app;
		app = qlik.currApp(this);
		
		var venn_canvas = document.createElement("canvas");
		venn_canvas.setAttribute("class","venn_canvas_class");
		var hashId = Math.floor(Math.random() * 100000);
		venn_canvas.setAttribute("id","venn_canvas"+hashId);
		
		
		$element.append( venn_canvas );
		
		var c = document.getElementById("venn_canvas"+hashId);
	
		
		c.setAttribute("width",c.offsetWidth);
		c.setAttribute("height",c.offsetHeight);
		
		var ctx = c.getContext("2d");
		
		cWidth = c.offsetWidth;
		cHeight = c.offsetHeight;
		
		var	talesize = 20;
		var talestep = Math.min(cWidth,cHeight)/talesize;
		
		
		
		ss3 = layout.qHyperCube.qDataPages;
		var data = layout.qHyperCube.qDataPages[0].qMatrix;
		var label = layout.qHyperCube.qMeasureInfo;
		ss = data;
		
		if(data[0].length == 2){
			considerValue = false;
		}
		
	
		calculateVenn(data);
		
		draw();
		

		
		
	
	ss1 = setList;
	ss2 = Venn;
    }
  }

	} );
