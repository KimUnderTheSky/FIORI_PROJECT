sap.ui.define([
    "sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/base/Log",
    'sap/ui/model/json/JSONModel',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (MessageToast, Controller, Device, Log,  JSONModel) {
        "use strict";
    
        var oTable, sVendor, sMatcode;

        return Controller.extend("sap.m.sample.SplitApp.C", {
    
            onInit: function () {
                var oModel = new JSONModel(sap.ui.require.toUrl("sync4/c1/br2mm0001/model/data.json"));
			    this.getView().setModel(oModel, "toolBar");

                this.getSplitAppObj().setHomeIcon({
                    'phone': 'phone-icon.png',
                    'tablet': 'tablet-icon.png',
                    'icon': 'desktop.ico'
                });
    
                Device.orientation.attachHandler(this.onOrientationChange, this);

                oTable = this.byId("CheckList");
            },
    
            onItemSelect: function (oEvent) {
                var oItem = oEvent.getParameter("item");
                this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
            },

            onExit: function () {
                Device.orientation.detachHandler(this.onOrientationChange, this);
            },
    
            onOrientationChange: function (mParams) {
                var sMsg = "Orientation now is: " + (mParams.landscape ? "Landscape" : "Portrait");
                MessageToast.show(sMsg, { duration: 5000 });
            },
    
            onPressNavToDetail: function () {
                this.getSplitAppObj().to(this.createId("detailDetail"));
            },
    
            onPressDetailBack: function () {
                this.getSplitAppObj().backDetail();
                var oBinding = oTable.getBinding("rows");
                oBinding.filter([]); 
            },
    
            onPressMasterBack: function () {
                this.getSplitAppObj().backMaster();
            },
    
            onPressGoToMaster: function (oEvent) {
                sVendor = oEvent.getSource().getTitle();
                this.getSplitAppObj().toMaster(this.createId(sVendor));
            },


            onListItemPress: function (oEvent) {
                
                var oSplitApp =  this.byId("SplitAppDemo");

                var oSelectedItem = oEvent.getParameter("listItem");
                sMatcode = oSelectedItem.getTitle();        // Matcode를 가져옵니다.

                var sTitle    =  oEvent.getParameter("listItem").getCustomData()[0].getValue();

                try {
                    this._createDetailPage(sTitle);
                } catch (error) {
                    alert(error.name);
                }

            },
    
            onPressModeBtn: function (oEvent) {
                var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();
    
                this.getSplitAppObj().setMode(sSplitAppMode);
                MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, { duration: 5000 });
            },
    
            getSplitAppObj: function () {
                var result = this.byId("SplitAppDemo");
                if (!result) {
                    Log.info("SplitApp object can't be found");
                }
                return result;
            },

            // 페이지 생성
            _createDetailPage: function (sTitle) {
                // 1. 데이터 불러오기
                var oModel     = this.getView().getModel(),
                    lv_Vendor  = sVendor,
                    lv_Matcode = sMatcode;

                    oModel.read("/CheckSet(Vencode='"+lv_Vendor+"',Matcode='"+lv_Matcode+"')", {
                        success: function(oData2){
                            // 데이터 세팅
                            var lModel = new JSONModel(oData2);
                            this.getView().setModel(lModel, "CheckRecord");

                            // 페이지 정보 불러오기
                            var oSplitApp = this.getView().byId("SplitAppDemo");
                            var oDetailPage = oSplitApp.getDetailPage(this.createId("dynamicDetail"));

                            // 페이지 생성
                            if (!oDetailPage) {
                                oDetailPage = sap.ui.view({
                                    id: this.createId("dynamicDetail"),
                                    viewName: "sync4.c1.br2mm0001.view.DynamicDetail",
                                    type: sap.ui.core.mvc.ViewType.XML
                                });

                                oSplitApp.addDetailPage(oDetailPage);
                            }

                            oSplitApp.toDetail(oDetailPage.getId());

                            // 파이 차트에 사용할 데이터 생성
                            var aData = [
                                { Status: "합격수량", Quantity: oData2.TotalPinquan },
                                { Status: "불합격수량", Quantity: oData2.TotalFinquan }
                            ];

                            // JSONModel 생성 및 설정
                            var oPieModel = new JSONModel(aData);
                            // oView.setModel(oPieModel, "PieModel");
                            this.getView().setModel(oPieModel, "PieModel");

                            // VizFrame에 모델 설정
                            var oVizFrame = this.getView().byId("pieChart");
                            oVizFrame.setModel(oPieModel);
                        }.bind(this),
                        error: function(error){
                            console.log(error.statusCode)
                            if(error.statusCode === '404'){
                                MessageToast.show('해당 자재 정보가 없습니다.', { duration: 5000 });
                            }

                        }
                    });
                
            
            },
    
        });
    });