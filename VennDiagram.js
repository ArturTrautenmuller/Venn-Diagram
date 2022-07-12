var gen,ss,ss1,ss2,el,ss3,ss4,ss5;
define( ["qlik", "css!./VennDiagram.css"],
	function ( qlik, template ) {




  return {
    initialProperties: {
			
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
					qTop:0,
					qLeft:0,
                    qWidth: 3,
                    qHeight: 3300
                }
				]
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
			addons: { 

    			 uses: "addons", 

   				  items: { 

       				   dataHandling: { 

           			    uses: "dataHandling" 

         			 }

    			 }

			} ,   
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
								},
								MySwitchProp2: {
									type: "boolean",
									component: "switch",
									label: "Background Color",
									ref: "use_background",
									options: [{
										value: true,
										label: "Yes"
									}, {
										value: false,
										label: "No"
									}],

									defaultValue: false
								},
								MySwitchProp: {
									type: "boolean",
									component: "switch",
									label: "Use Mean in Itersections",
									ref: "mean",
									options: [{
										value: true,
										label: "Yes"
									}, {
										value: false,
										label: "No"
									}],

									defaultValue: false
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
		
		function pixelX(x){
			cWidth = c.offsetWidth;
			cHeight = c.offsetHeight;

			var	talesize = 20;
			var talestep = Math.min(cWidth,cHeight)/talesize;
			
			translate = Math.max(0,cWidth - cHeight)/2;
			
			
			return x*talestep + translate - 30; 
		}
		
		function pixelY(x){
			cWidth = c.offsetWidth;
			cHeight = c.offsetHeight;

			var	talesize = 20;
			var talestep = Math.min(cWidth,cHeight)/talesize;
			
			translate = Math.max(0,cHeight - cWidth)/2;
			
			
			return x*talestep + translate; 
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
					if(layout.mean){
						Venn[i].total = Venn[i].sum()/Venn[i].alias.length;
					}
					else{
						Venn[i].total = Venn[i].sum();
					}
					
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
	   			ctx.arc(pixelX(10),pixelY(9), pixel(6.5), 0, 2 * Math.PI);
       	   		ctx.stroke();
				if(layout.use_background){
					ctx.globalAlpha = 0.1;
					ctx.fillStyle = layout.color_1.color;
					ctx.fill();
					ctx.globalAlpha = 1;
				}
				
				ctx.beginPath();
				ctx.strokeStyle = layout.color_2.color;
	   			ctx.arc(pixelX(16),pixelY(9), pixel(6.5), 0, 2 * Math.PI);
       	   		ctx.stroke();
				if(layout.use_background){
					ctx.globalAlpha = 0.1;
					ctx.fillStyle = layout.color_2.color;
					ctx.fill();
					ctx.globalAlpha = 1;
				}
				
				ctx.lineWidth = 1;
			}
			
			if(setList.length == 3){
				ctx.beginPath();
				ctx.lineWidth = layout.border_width;
				ctx.strokeStyle = layout.color_1.color;
	   			ctx.arc(pixelX(9),pixelY(7), pixel(5.5), 0, 2 * Math.PI);
       	   		ctx.stroke();
				if(layout.use_background){
					ctx.globalAlpha = 0.1;
					ctx.fillStyle = layout.color_1.color;
					ctx.fill();
					ctx.globalAlpha = 1;
				}
				
				ctx.beginPath();
				ctx.strokeStyle = layout.color_2.color;
	   			ctx.arc(pixelX(15),pixelY(7), pixel(5.5), 0, 2 * Math.PI);
       	   		ctx.stroke();
				if(layout.use_background){
					ctx.globalAlpha = 0.1;
					ctx.fillStyle = layout.color_2.color;
					ctx.fill();
					ctx.globalAlpha = 1;
				}
				
				ctx.beginPath();
				ctx.strokeStyle = layout.color_3.color;
	   			ctx.arc(pixelX(12),pixelY(13.06), pixel(5.5), 0, 2 * Math.PI);
       	   		ctx.stroke();
				if(layout.use_background){
					ctx.globalAlpha = 0.1;
					ctx.fillStyle = layout.color_3.color;
					ctx.fill();
					ctx.globalAlpha = 1;
				}
				
				ctx.lineWidth = 1;
				
			}
		}
		
		function drawLabels(){
			if(setList.length == 2){
				ctx.fillStyle = layout.color_1.color;
				ctx.font = layout.label_size+"px Arial";
				ctx.fillText(setList[0].name,pixelX(4.5),pixelY(2));
				
				ctx.fillStyle = layout.color_2.color;
				ctx.font = layout.label_size+"px Arial";
				ctx.fillText(setList[1].name,pixelX(17),pixelY(2));
			}
			if(setList.length == 3){
				ctx.fillStyle = layout.color_1.color;
				ctx.font = layout.label_size+"px Arial";
				ctx.fillText(setList[0].name,pixelX(3.5),pixelY(1));
				
				ctx.fillStyle = layout.color_2.color;
				ctx.font = layout.label_size+"px Arial";
				ctx.fillText(setList[1].name,pixelX(16),pixelY(1));
				
				ctx.fillStyle = layout.color_3.color;
				ctx.font = layout.label_size+"px Arial";
				ctx.fillText(setList[2].name,pixelX(17.3),pixelY(16));
			
			}
		}
		
		function drawValues(){
			
			if(setList.length == 2){
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '0' })[0].total,
					pixelX(7),
					pixelY(9)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '1' })[0].total,	
					pixelX(19),
					pixelY(9)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '01' })[0].total,
					pixelX(13),
					pixelY(9)
				);
			}
			if(setList.length == 3){
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '0' })[0].total,
					pixelX(8),
					pixelY(6)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '1' })[0].total,	
					pixelX(16),
					pixelY(6)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '2' })[0].total,
					pixelX(12),
					pixelY(13.8)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '01' })[0].total,
					pixelX(12),
					pixelY(6)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '02' })[0].total,	
					pixelX(9.5),
					pixelY(11)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '12' })[0].total,	
					pixelX(14.5),
					pixelY(11)
				);
				
				ctx.fillStyle = '#000000';
				ctx.font = layout.value_size+"px Arial";
				ctx.textAlign = "center";  
				ctx.fillText(
					Venn.filter(function (x) { return x.alias == '012' })[0].total,	
					pixelX(12),
					pixelY(9.5)
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
					rowValue = matrix[i][2]
				}
				else{
					rowValue = 0;
				}
			
				addItemInSet(matrix[i][0],matrix[i][1],rowValue);
			
			}
			
			buildVenn();
			
			
			
			console.log('1');
			
		}
		
		var TotalData = [];
		var lastrow = 0, me = this;
     //loop through the rows we have and render
     this.backendApi.eachDataRow( function ( rownum, row ) {
                lastrow = rownum;
				//console.log("rownum: "+rownum);
			var newdata = [];

			$.each( row, function ( key, cell ) {
				if ( cell.qIsOtherCell ) {
					cell.qText = this.backendApi.getDimensionInfos()[key].othersLabel;
				}
				newdata.push(!isNaN( cell.qNum ) ? parseInt(cell.qText, 10) : cell.qText);
			} );
			TotalData.push(newdata);
     });
	// var rowcount = this.backendApi.getRowCount();
     if(this.backendApi.getRowCount() > lastrow +1){
             //we havent got all the rows yet, so get some more, 1000 rows
			 console.log("rownum: "+lastrow);
              var requestPage = [{
                    qTop: lastrow + 1,
                    qLeft: 0,
                    qWidth: 3, //should be # of columns
                    qHeight: Math.min( 1000, this.backendApi.getRowCount() - lastrow )
                }];
               this.backendApi.getData( requestPage ).then( function ( dataPages ) {
                        //when we get the result trigger paint again
						/*var venn_canvas = document.createElement("canvas");
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
						
						
						ctx.fillStyle = '#000000';
						ctx.font = layout.value_size+"px Arial";
						ctx.textAlign = "center";  
						ctx.fillText(
							lastrow+"/"+rowcount,	
							pixel(10),
							pixel(10)
						);*/
                        me.paint( $element,layout);
               } );
     }
	 else{
	 	console.log(TotalData);
		ss4 = TotalData;
	
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
		
		
		
		
		
		
		
		//var data = layout.qHyperCube.qDataPages[0].qMatrix;
	//	var label = layout.qHyperCube.qMeasureInfo;
		
		/*qtdRows = this.backendApi.getRowCount();
		maxPage = Math.floor((qtdRows-3300)/1);
		console.log(maxPage);
		
		for(var i = 0; i <= maxPage;i++){
			requestPage = [{
				qTop : 4000,
				qLeft : 0,
				qWidth : 3, 
				qHeight : 100
			}];
			
			console.log(i);
			try{
				dataPage = this.backendApi.getData(requestPage);
				dataPage.then(function(a) {
  					 data = data.concat(a[0].qMatrix);
					 console.log(data);
				});
				//ss5 = dataPage.$$state.value[0].qMatrix;
				//data = data.concat(dataPage.$$state.value[0].qMatrix);
				console.log(dataPage);
			}
			catch(err){
				console.log(err.message);
			}
			
			
		}
		*/
		
		
		
		
		
		//ss = data;
		

		if(TotalData[0].length == 2){
			considerValue = false;
		}
		
	
		calculateVenn(TotalData);
		
		if(setList.length < 2){
									
			ctx.fillStyle = '#8a8a8a';
			ctx.font = "18px Arial";
			ctx.textAlign = "center";  
			ctx.fillText(
					"Must contain at least 2 Sets",	
					pixelX(10),
					pixelY(10)
						);
		
		
		}
		
		draw();
		

		
		
	
	ss1 = setList;
	ss2 = Venn;
		}
    }
  }

	} );
