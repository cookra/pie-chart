  Ext.define('CustomApp', {
     extend: 'Rally.app.App',
     componentCls: 'app',

     items: [
         {
         }
     ],
     launch: function(){
        this._makeStore();
     },
     _makeStore:function(){
        this._myStore = Ext.create('Rally.data.WsapiDataStore', {
           model: 'Test Case Result',
           fetch: true,
           autoLoad: true,
           listeners: {
                            load: this._onDataLoaded,
                            scope: this
            }
       });
     },
     _onDataLoaded: function(store, data) {
                    var records = [];
                    var verdictsGroups = ["Pass","Blocked","Error","Fail","Inconclusive"]

                    var passCount = 0;
                    var blockedCount = 0;
                    var errorCount = 0;
                    var failCount = 0;
                    var inconclusiveCount = 0;

                    Ext.Array.each(data, function(record) {

                        verdict = record.get('Verdict');

                        switch(verdict)
                        {
                            case "Pass":
                               passCount++;
                                break;
                            case "Blocked":
                                blockedCount++;
                                break;
                            case "Error":
                                errorCount++;
                                break;
                            case "Fail":
                                failCount++;
                                break;
                            case "Inconclusive":
                                inconclusiveCount++;
                        }
                    });
                    if (this.down('#myChart')) {
                                this.remove('myChart');
                    }
                    this.add(
                        {
                            xtype: 'rallychart',
                            height: 400,
                            storeType: 'Rally.data.WsapiDataStore',
                            store: this._myStore,
                            itemId: 'myChart',
                            chartConfig: {
                                chart: {
                                },
                                title: {
                                    text: 'TestCaseResults Verdict Counts',
                                    align: 'center'
                                },
                                tooltip: {
                                    //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' //did not resolve {point.percentage:.1f}%
                                    //from http://stackoverflow.com/questions/15907496/highcharts-pie-chart-ignores-percentagedecimals-tooltip-setting-and-has-floating
                                    formatter: function () {
                                       return this.point.name + ': <b>' + Highcharts.numberFormat(this.percentage, 1) + '%</b>';
                                        }
                                    //if comment out formatter, the tooltip by default will show numbers, not %
                                },
                                plotOptions : {
                                     pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: true,
                                            color: '#000000',
                                            connectorColor: '#000000',
                                            //format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                        }
                                    }
                                }
                            },            
                            chartData: {
                                categories: verdict, 
                                series: [ 
                                    {   
                                        type: 'pie',
                                        name: 'Verdicts',
                                        data: [
                                               ['Pass', passCount],
                                               ['Blocked',blockedCount],
                                                ['Error',errorCount],
                                                ['Fail',failCount],
                                                ['Inconclusive', inconclusiveCount]
                                              ]
                                    }
                                ]
                            }
                        }
                    );
                    this.down('#myChart')._unmask(); 
                }
     
 });
