sap.ui.define([
    "sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/base/Log",
    'sap/ui/model/json/JSONModel',
	'sap/ui/core/Fragment',
    "sap/m/MenuItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/library",
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
    'sap/ui/model/BindingMode'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (MessageToast, Controller, Device, Log,  JSONModel, Fragment, MenuItem, Filter, FilterOperator, CoreLibrary, ChartFormatter, Format, BindingMode) {
        "use strict";

        var oTable,
    		ValueState = CoreLibrary.ValueState;
        return Controller.extend("sap.m.sample.SplitApp.C", {
            onInit: function (evt) {
                var oModel = new JSONModel(sap.ui.require.toUrl("sync4/c1/br2mm0002/model/data.json"));
	    		    
                this.getView().setModel(oModel, "toolBar");

                Device.orientation.attachHandler(this.onOrientationChange, this);
                oTable = this.byId("PurOrderTable"); // id를 사용하여 xml내 TABLE 정보를 가져옴
                oModel = this.getView().getModel();

                //트리맵 세팅
                Format.numericFormatter(ChartFormatter.getInstance());
                var formatPattern = ChartFormatter.DefaultPattern;
                // set explored app's demo model on this sample
                var oModel = new JSONModel(this.settingsModel);
                oModel.setDefaultBindingMode(BindingMode.OneWay);
                this.getView().setModel(oModel, "treemap");

                var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
                oVizFrame.setVizProperties({
                    plotArea: {
                        dataLabel: {
                            formatString:formatPattern.SHORTFLOAT_MFD2,
                            visible: true
                        }
                    },
                    legend: {
                        visible: true,
                        formatString:formatPattern.SHORTFLOAT,
                        title: {
                            visible: false
                        }
                    },
                });

                var oPopOver = this.getView().byId("idPopOver");
                oPopOver.connect(oVizFrame.getVizUid());
                oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
           },

           onItemSelect: function (oEvent) {
                var oItem = oEvent.getParameter("item");
                this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
            },

           onPress: function () {
                var oView = this.getView(),
                    oButton = oView.byId("button");

                if (!this._oMenuFragment) {
                    this._oMenuFragment = Fragment.load({
                        id: oView.getId(),
                        name: "sync4.c1.br2mm0002.view.Menu",
                        controller: this
                    }).then(function(oMenu) {
                        oMenu.openBy(oButton);
                        this._oMenuFragment = oMenu;
                        return this._oMenuFragment;
                    }.bind(this));
                } else {
                    this._oMenuFragment.openBy(oButton);
                }
            },
            onMenuAction: function(oEvent) {
                var oItem     = oEvent.getParameter("item"),
                    oBinding  = oTable.getBinding("rows"), //EntitySet 정보가 있는 속성 이름
                    lv_status = "",
                    oFilter   = null, 
                    aFilters  = [];   
                
                lv_status = oItem.getText()[1];
                console.log(lv_status);
                if (lv_status != 'X') 
                    {
                        oFilter = new Filter
                        (
                            {
                                path     : "Postatus", 
                                operator : FilterOperator.EQ, 
                                value1   : lv_status 
                            }
                        );

                        aFilters.push(oFilter); // 배열에 입력

                        // Get_EntitySet 메소드 호출
                        oBinding.filter(aFilters); // AirlineSet?$filter=Carrid eq 'AA
                        // oBinding.filter(new sap.ui.model.Filter("Postatus", sap.ui.model.FilterOperator.EQ, "0"));
                    }
                else{
                    var oBinding = oTable.getBinding("rows");
                    oBinding.filter([]); 
                }
                
                this.byId("textResult").setText("");
            },
            onSearch : function() {
                var oBinding  = oTable.getBinding("rows"), //EntitySet 정보가 있는 속성 이름
                    lv_Pono   = "",
                    oFilter   = null, 
                    aFilters  = [];   
                
                lv_Pono = this.byId("Pono").getValue();    
                console.log(lv_Pono)
                if (lv_Pono != '') // 검색어 입력 했을 경우 
                {
                    oFilter = new Filter
                    (
                        {
                            path     : "Pono", // Gateway에서 설정한 Property 명
                            operator : FilterOperator.Contains, // * 검색: 앞뒤 붙어서 감. 같은거면 EQ 
                            value1   : lv_Pono // select-options-low임 (Operator가 'BT'일 경우)
                        }
                    );

                    aFilters.push(oFilter); // 배열에 입력

                    // Get_EntitySet 메소드 호출
                    oBinding.filter(aFilters); 
                    
                }           
                else{
                    var oBinding = oTable.getBinding("rows");
                    oBinding.filter([]); 
                }
                this.byId("textResult").setText("");
            },
            handleChange: function (oEvent) {
                var oText  = this.byId("textResult"),
                    oDP    = oEvent.getSource(),
                    sValue = oEvent.getParameter("value"),
                    bValid = oEvent.getParameter("valid");

                this._iEvent++;
                oText.setText(sValue);

                if (bValid) {
                    oDP.setValueState(ValueState.None);
                } else {
                    oDP.setValueState(ValueState.Error);
                }

                var oBinding  = oTable.getBinding("rows"), //EntitySet 정보가 있는 속성 이름
                lv_date   = "",
                oFilter   = null, 
                aFilters  = [];   
            
                lv_date = this.byId("textResult").getText().replaceAll("-","");
                console.log(lv_date)
                if (lv_date != '') // 검색어 입력 했을 경우 
                {
                    oFilter = new Filter
                    (
                        {
                            path     : "Podate", // Gateway에서 설정한 Property 명
                            operator : FilterOperator.EQ, // * 검색: 앞뒤 붙어서 감. 같은거면 EQ 
                            value1   : lv_date // select-options-low임 (Operator가 'BT'일 경우)
                        }
                    );

                    aFilters.push(oFilter); // 배열에 입력

                    // Get_EntitySet 메소드 호출
                    oBinding.filter(aFilters); 
                    
                }           
                else{
                    var oBinding = oTable.getBinding("rows");
                    oBinding.filter([]); 
                }
            },
    
        });
    });
