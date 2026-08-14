/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GD1 05 POST /api/apply-coupon [read-only + compute]"], "isController": false}, {"data": [1.0, 500, 1500, "GD2 04 PUT /api/users/me [transactional]"], "isController": false}, {"data": [1.0, 500, 1500, "GD3 04 PUT /api/users/me [transactional]"], "isController": false}, {"data": [1.0, 500, 1500, "GD3 03 GET /api/orders/my-orders [read-heavy]"], "isController": false}, {"data": [1.0, 500, 1500, "GD1 03 GET /api/orders/my-orders [read-heavy]"], "isController": false}, {"data": [1.0, 500, 1500, "GD2 03 GET /api/orders/my-orders [read-heavy]"], "isController": false}, {"data": [1.0, 500, 1500, "GD1 02 GET /api/users/me [read-heavy]"], "isController": false}, {"data": [1.0, 500, 1500, "GD2 02 GET /api/users/me [read-heavy]"], "isController": false}, {"data": [1.0, 500, 1500, "GD1 04 PUT /api/users/me [transactional]"], "isController": false}, {"data": [1.0, 500, 1500, "GD3 02 GET /api/users/me [read-heavy]"], "isController": false}, {"data": [1.0, 500, 1500, "GD3 05 POST /api/apply-coupon [read-only + compute]"], "isController": false}, {"data": [1.0, 500, 1500, "GD1 01 POST /api/login [auth-heavy]"], "isController": false}, {"data": [1.0, 500, 1500, "GD3 01 POST /api/login [auth-heavy]"], "isController": false}, {"data": [1.0, 500, 1500, "GD1 04b GET /api/users/me [verify ghi]"], "isController": false}, {"data": [1.0, 500, 1500, "GD2 04b GET /api/users/me [verify ghi]"], "isController": false}, {"data": [1.0, 500, 1500, "GD3 04b GET /api/users/me [verify ghi]"], "isController": false}, {"data": [1.0, 500, 1500, "GD2 05 POST /api/apply-coupon [read-only + compute]"], "isController": false}, {"data": [1.0, 500, 1500, "GD2 01 POST /api/login [auth-heavy]"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2620, 0, 0.0, 1.7828244274809182, 0, 31, 2.0, 2.0, 3.0, 3.0, 6.268062546651611, 2.672148087612921, 2.2090640341202703], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GD1 05 POST /api/apply-coupon [read-only + compute]", 66, 0, 0.0, 2.121212121212123, 1, 3, 2.0, 3.0, 3.0, 3.0, 0.6412934694948356, 0.249224268706822, 0.26481442570226493], "isController": false}, {"data": ["GD2 04 PUT /api/users/me [transactional]", 218, 0, 0.0, 1.752293577981651, 1, 4, 2.0, 2.0, 2.0, 3.0, 4.213700324725529, 1.2180227501159735, 1.8561784830678831], "isController": false}, {"data": ["GD3 04 PUT /api/users/me [transactional]", 145, 0, 0.0, 1.7172413793103447, 1, 3, 2.0, 2.0, 2.0, 2.539999999999992, 0.6397896195237318, 0.18493918689357872, 0.28189006539091144], "isController": false}, {"data": ["GD3 03 GET /api/orders/my-orders [read-heavy]", 148, 0, 0.0, 1.5000000000000004, 1, 2, 1.5, 2.0, 2.0, 2.0, 0.6391266420804436, 0.1666472787455844, 0.22102820443199778], "isController": false}, {"data": ["GD1 03 GET /api/orders/my-orders [read-heavy]", 71, 0, 0.0, 1.7464788732394367, 1, 3, 2.0, 2.0, 2.3999999999999915, 3.0, 0.6588776807505637, 0.17179720777382865, 0.22764919867482067], "isController": false}, {"data": ["GD2 03 GET /api/orders/my-orders [read-heavy]", 234, 0, 0.0, 1.5427350427350421, 1, 4, 2.0, 2.0, 2.0, 2.0, 4.397339046115683, 1.1465718020633668, 1.5205041788814975], "isController": false}, {"data": ["GD1 02 GET /api/users/me [read-heavy]", 72, 0, 0.0, 1.6944444444444442, 1, 3, 2.0, 2.0, 2.0, 3.0, 0.636599145896146, 0.30207548175966614, 0.21498000128203995], "isController": false}, {"data": ["GD2 02 GET /api/users/me [read-heavy]", 239, 0, 0.0, 1.5230125523012554, 1, 3, 2.0, 2.0, 2.0, 3.0, 4.39217127630249, 2.085139954516218, 1.4843965358816502], "isController": false}, {"data": ["GD1 04 PUT /api/users/me [transactional]", 71, 0, 0.0, 1.9859154929577467, 1, 3, 2.0, 2.0, 3.0, 3.0, 0.659980107641826, 0.19077549986521533, 0.2905477457263964], "isController": false}, {"data": ["GD3 02 GET /api/users/me [read-heavy]", 151, 0, 0.0, 1.5165562913907287, 0, 3, 2.0, 2.0, 2.0, 2.4799999999999898, 0.6454756856576157, 0.3064782208061179, 0.2181711491070207], "isController": false}, {"data": ["GD3 05 POST /api/apply-coupon [read-only + compute]", 143, 0, 0.0, 1.7622377622377619, 1, 3, 2.0, 2.0, 2.0, 3.0, 0.6514183153320183, 0.2531924266357205, 0.2694876714528451], "isController": false}, {"data": ["GD1 01 POST /api/login [auth-heavy]", 74, 0, 0.0, 2.8648648648648636, 2, 31, 2.0, 3.0, 3.0, 31.0, 0.6325002564190229, 0.41428533080190777, 0.15997809219973333], "isController": false}, {"data": ["GD3 01 POST /api/login [auth-heavy]", 153, 0, 0.0, 2.2549019607843137, 1, 3, 2.0, 3.0, 3.0, 3.0, 0.648074414191559, 0.42486450135333187, 0.16391725905821655], "isController": false}, {"data": ["GD1 04b GET /api/users/me [verify ghi]", 71, 0, 0.0, 1.8732394366197187, 1, 3, 2.0, 2.0, 2.3999999999999915, 3.0, 0.6686758334902996, 0.3172954387596534, 0.22581053399886983], "isController": false}, {"data": ["GD2 04b GET /api/users/me [verify ghi]", 197, 0, 0.0, 1.477157360406091, 1, 2, 1.0, 2.0, 2.0, 2.0, 3.9297825653301417, 1.8657350264312786, 1.3281873379214042], "isController": false}, {"data": ["GD3 04b GET /api/users/me [verify ghi]", 144, 0, 0.0, 1.6041666666666663, 1, 3, 2.0, 2.0, 2.0, 3.0, 0.6393436072299107, 0.30359455958549225, 0.21614527834756317], "isController": false}, {"data": ["GD2 05 POST /api/apply-coupon [read-only + compute]", 183, 0, 0.0, 1.7377049180327873, 1, 4, 2.0, 2.0, 2.0, 3.1599999999999966, 4.04723991507431, 1.573026728646939, 1.6735857121925866], "isController": false}, {"data": ["GD2 01 POST /api/login [auth-heavy]", 240, 0, 0.0, 2.3125000000000013, 1, 3, 2.0, 3.0, 3.0, 3.0, 4.317245597308917, 2.8298547089456925, 1.0919595797880952], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2620, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
