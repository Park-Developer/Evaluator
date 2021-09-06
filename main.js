class Home {
    constructor() {

        this.home_Button = document.querySelector(".home_Btn");
        this.is_home = true;
        this.Home_taskList_Storage = "HOME_TASK_INFO";
        this.Month_Time_Storage = "Month_Statics";
        this.Task_HistoryList = [];

        // Button Event Setting
        this.home_Button.addEventListener("click", () => {
            // task list 존재 유무 확인
            let timer_storage = JSON.parse(localStorage.getItem(this.Home_taskList_Storage));
            if (timer_storage.length > 0) {
                if (this.is_home == true) {
                } else {
                    this.is_home = true;
                }
                location.href = "./task/task.html";
            } else {
                alert("No Task!");
                /*
                ############## Needed to to! ###############
                */
            }
        });

    }
    make_dataObjName(start_date) {
        // Info : Get date obj from start_date
        //try1: {start_date: "2021. 7. 30. 오후 10:40:33", recorded_time: 1}
        let dateAry = start_date.split('.');
        let year = dateAry[0];
        let month = dateAry[1];
        let day = dateAry[2];

        if (month.length == 1) {
            month = "0" + month;
        }
        if (day.length == 1) {
            day = "0" + day;
        }

        let datename = (year + month + day);

        return datename;
    }

    update_MonthStorage() {
        let month_storage = JSON.parse(localStorage.getItem(this.Month_Time_Storage));
        if (month_storage == null) {
            localStorage.setItem(this.Month_Time_Storage, JSON.stringify([]));
        }


    }

    calc_Eachtask_performtime(Home_taskStorage) {
        let Home_taskList = JSON.parse(localStorage.getItem(Home_taskStorage));
        let taskObj;

        let result_obj;

    }


    task_search(Home_taskStorage) {
        let Home_taskList = JSON.parse(localStorage.getItem(Home_taskStorage));
        let Task_Obj;
        let task_name;
        let task_detail_lists;
        let detail_listNum;
        let taskObj;
        let today_hist;
        let try_namelist;
        let try_name;

        let try_start_date;
        let try_recordedTime;


        let dateObjName;

        let result_Object = { // Return Format
            /*
            date1:{
                date_total:Integer,
                
                date_detail_taskName1:Integer   
                ...
                date_detail_taskName2:Integer   
                date_detail_taskName3:Integer   
            },
            */
        };

        for (let task_idx = 0; task_idx < Home_taskList.length; task_idx++) {
            Task_Obj = Home_taskList[task_idx]; // home task Selection

            // home task Info
            task_name = Task_Obj.dash_boardInfo.task_name;
            task_detail_lists = Task_Obj.tableInfo.task_detail_lists;
            detail_listNum = task_detail_lists.length;

            let tempObj = new Object(); // for make New object

            let temp_total = 0;
            let temp_recorded = 0;


            // Searching Detail Tasks
            for (let i = 0; i < detail_listNum; i++) {
                taskObj = task_detail_lists[i];

                today_hist = taskObj.timer_info.today_history;
                try_namelist = Object.keys(today_hist);

                if (try_namelist.length > 0) { // today history가 있는경우에만 수행
                    for (let j = 0; j < try_namelist.length; j++) {
                        try_name = try_namelist[j];
                        if (today_hist[try_name].start_date != undefined) {
                            try_start_date = today_hist[try_name].start_date;
                            try_recordedTime = today_hist[try_name].recorded_time;
                            dateObjName = this.make_dataObjName(try_start_date);

                            if ((dateObjName in result_Object) == true) {// DataObj 객제 유무 확인
                                temp_total = result_Object[dateObjName]["date_total"];

                                if (result_Object[dateObjName][task_name] == undefined) {
                                    result_Object[dateObjName][task_name] = try_recordedTime;
                                } else {
                                    temp_recorded = result_Object[dateObjName][task_name]; // task 시간

                                    temp_recorded = temp_recorded + try_recordedTime;
                                    result_Object[dateObjName][task_name] = temp_recorded;
                                }

                                temp_total = temp_total + try_recordedTime;
                                result_Object[dateObjName]["date_total"] = temp_total;

                            } else {
                                tempObj["date_total"] = try_recordedTime;
                                tempObj[task_name] = try_recordedTime;

                                result_Object[dateObjName] = tempObj;
                            }
                        }
                        //
                    }
                }
            }
        }



        return result_Object;
    }
    calc_thisMonth_perform() {
        let today = new Date();
        let this_year = today.getFullYear();      // 년도
        let this_month = today.getMonth() + 1;  // 월
        let this_date = today.getDate();        // 날짜
        let this_day = today.getDay();           // 요일

    }

    calc_today_perform() {

    }
    debug() {
        console.log(this.home_Button);
    }

    initial_setting() {

    }
}

class Dashboard {
    constructor() {
        // User Defined Parameter
        this.MAX_TASK_NUMBER = 10;
        const DASH_BOARD = this;
        const Dash_TABLE_INDEX = {
            "Task Name": 0,
            "Due Date": 1,
        };
        const SCHEDULE_CELL_WIDTH = "30px";
        const SCHEDULE_COLOR_STANDARD = {
            Level1: {
                min: 0,
                max: 5
            },
            Level2: {
                min: 6,
                max: 10
            },
            Level3: {
                min: 11,
                max: 15
            },
            Level4: {
                min: 16,
                max: 20
            },
            Level5: {
                min: 21,
                max: 25
            },
        };
        const SCHEDULE_COLOR = {
            Level5: "#0E6251",
            Level4: "#148F77",
            Level3: "#1ABC9C",
            Level2: "#76D7C4",
            Level1: "#D1F2EB",
        };

        this.Home_TaskLists; // Home Task Lists;

        this.localstoraged_taskinfo = "HOME_TASK_INFO";
        this.taskObject_list = []; // task object들의 모음 => 삭제 해야함


        // DOM Setting
        this.home_dashboard__table_DOM = document.querySelector(".home_dashboard__table");
        this.dashTable_AddBtn_DOM = document.querySelector(".Task_Btn__Add");
        this.dashTable_RemoveBtn_DOM = document.querySelector(".Task_Btn_Remove");
        this.dashTable_ChangeBtn_DOM = document.querySelector(".Task_Btn_Change");
        this.dashTable_ConfirmBtn_DOM = document.querySelector(".Task_Btn_Confirm");
        this.home_schedule__table = document.querySelector(".home_schedule__table");


        // Column Index Setting
        this.taskname_idx = 0;
        this.task_duedate = 1;

        // Button Event Setting
        this.dashTable_AddBtn_DOM.addEventListener("click", () => {
            this.add_dashTable_row();
            DASH_BOARD.updater.update_dashboardInfo();
        });
        this.dashTable_RemoveBtn_DOM.addEventListener("click", () => {
            this.remove_dashTable_row();
        });

        this.dashTable_ChangeBtn_DOM.addEventListener("click", () => {
            // [1] 버튼 상태 변경
            this.dashTable_AddBtn_DOM.disabled = true;
            this.dashTable_RemoveBtn_DOM.disabled = true;
            this.dashTable_ChangeBtn_DOM.style.display = "none";
            this.dashTable_ConfirmBtn_DOM.style.display = "block";

            // [2] Table 수정 허용
            DASH_BOARD.dash_tool.set_table_editable(true);
        });

        this.dashTable_ConfirmBtn_DOM.addEventListener("click", () => {
            // [1] 버튼 상태 변경
            this.dashTable_AddBtn_DOM.disabled = false;
            this.dashTable_RemoveBtn_DOM.disabled = false;
            this.dashTable_ChangeBtn_DOM.style.display = "block";
            this.dashTable_ConfirmBtn_DOM.style.display = "none";

            //[2] Table 수정 허용
            DASH_BOARD.dash_tool.set_table_editable(false); // 수정 금지
            let isName_overlap = DASH_BOARD.dash_tool.check_taskName();
            if (isName_overlap === false) {
                DASH_BOARD.updater.update_dashboardInfo();
            } else {
                alert("overlaped name error!");
            }



        });



        this.dash_tool = {
            set_table_editable: function (editable) {
                let row_num = DASH_BOARD.home_dashboard__table_DOM.rows.length;
                let cell_num = DASH_BOARD.home_dashboard__table_DOM.rows[0].cells.length;

                // 수정가능 항목 : 1. Task Name, 2: Due Date
                let taskname_idx = Dash_TABLE_INDEX["Task Name"];
                let duedate_idx = Dash_TABLE_INDEX["Due Date"];

                for (let i = 0; i < row_num; i++) {
                    for (let j = 0; j < cell_num; j++) {
                        if (j === taskname_idx || j === duedate_idx) {
                            DASH_BOARD.home_dashboard__table_DOM.rows[i].cells[j].setAttribute("contenteditable", editable);
                        }

                    }
                }

            },
            check_taskName: function () {
                // 동일한 task name이 있는지 확인
                let Home_TaskLists = JSON.parse(localStorage.getItem(DASH_BOARD.localstoraged_taskinfo));
                let row_num = DASH_BOARD.home_dashboard__table_DOM.rows.length;
                let taskname_idx = Dash_TABLE_INDEX["Task Name"];
                let name_list = [];
                let taskname;
                let result = false;

                for (let i = 0; i < row_num; i++) {
                    if (i >= 2) { // header  제외
                        taskname = DASH_BOARD.home_dashboard__table_DOM.rows[i].cells[taskname_idx].innerText.trim();
                        if (name_list.indexOf(taskname) !== -1) {
                            // 이미 리스트에 존재하는 경우
                            result = true;

                            // local storage에 저장된 값으로 원복
                            for (let row_idx = 0; row_idx < DASH_BOARD.home_dashboard__table_DOM.rows.length - 1; row_idx++) {
                                if (row_idx >= 2) {
                                    DASH_BOARD.home_dashboard__table_DOM.rows[row_idx].cells[taskname_idx].innerText = Home_TaskLists[row_idx - 2].dash_boardInfo.task_name;
                                }

                            }

                            break;
                        } else {
                            name_list.push(taskname);
                        }
                    }


                }
                return result;
            },
            set_row_property: function (row, editable, text_align) {
                let cell_number = row.cells.length;
                for (let i = 0; i < cell_number; i++) {
                    row.cells[i].setAttribute("contenteditable", editable);
                    row.cells[i].style.textAlign = text_align;
                }
            },

            find_task: function (task_name) {
                let Home_TaskLists = JSON.parse(localStorage.getItem(DASH_BOARD.localstoraged_taskinfo));
                let result = {
                    is_find: false,
                    task_loc: -1,
                }
                if (Home_TaskLists !== null) {
                    for (let i = 0; i < Home_TaskLists.length; i++) {
                        if (task_name === Home_TaskLists[i].dash_boardInfo.task_name) {
                            result.is_find = true;
                            result.task_loc = i;
                            break;
                        }
                    }
                }

                return result;
            },

            get_taskObj: function (task_name) {
                let Home_TaskLists = JSON.parse(localStorage.getItem(DASH_BOARD.localstoraged_taskinfo));
                let find_Result = this.find_task(task_name);
                if (find_Result.is_find === true) {
                    return Home_TaskLists[find_Result.task_loc];
                } else {
                    alert("gettaskobj error!");
                    return undefined;
                }
            },
            get_dayInfo: function (hist__start_time) {
                //start_date: "2021. 8. 16. 오전 2:27:59"
                let day_array = hist__start_time.split(".");
                let month = parseInt(day_array[1]);
                let date = parseInt(day_array[2]);
                let result = {
                    month: month,
                    date: date,
                };
                return result;
            },
            calc_mothly_statistics: function () {
                let Home_TaskLists = JSON.parse(localStorage.getItem(DASH_BOARD.localstoraged_taskinfo));
                let today = new Date();
                let this__month = today.getMonth() + 1;//Get the month as a number (0-11)
                let chart_dataPoints = {};
                let this_year = today.getFullYear();
                let daysInMonth = new Date(this_year, this__month, 0).getDate();

                // [1] 기록이 있는 날짜에 대한 통계 처리
                if (Home_TaskLists !== null) {
                    for (let i = 0; i < Home_TaskLists.length; i++) {
                        let taskobj = Home_TaskLists[i];
                        let taskobj_detail_lists = taskobj.tableInfo.task_detail_lists;
                        for (let j = 0; j < taskobj_detail_lists.length; j++) {
                            let detail_obj_hist = taskobj_detail_lists[j].timer_info.today_history;
                            for (let [key, value] of Object.entries(detail_obj_hist)) {
                                let day_info = value.start_date;
                                let recorded_time = value.recorded_time;

                                let hist_info = DASH_BOARD.dash_tool.get_dayInfo(day_info);
                                let hist_month = hist_info.month;
                                let hist_date = hist_info.date;
                                //console.log(recorded_time, typeof (recorded_time));
                                if (this__month === hist_month) {
                                    if (chart_dataPoints.hasOwnProperty(hist_date) === true) {
                                        chart_dataPoints[hist_date] += recorded_time;
                                    } else {
                                        chart_dataPoints[hist_date] = recorded_time;
                                    }

                                }
                            }
                        }
                    }
                }

                // [2] 기록이 없는 날도 포함해서 chart_dataPoints의 빈 데이터 보완
                for (let d = 0; d < daysInMonth; d++) {
                    let day = d + 1;
                    if ((day in chart_dataPoints) === false) {
                        chart_dataPoints[day] = 0;
                    }

                }
                return chart_dataPoints;
            },
        }
        this.loader = {
            load_localstorage_to_Home: function () {
                let Home_TaskLists = JSON.parse(localStorage.getItem(DASH_BOARD.localstoraged_taskinfo));
                let home_data_num = Home_TaskLists.length;

                if (Home_TaskLists !== null) {
                    for (let idx = 0; idx < home_data_num; idx++) {
                        const newRow = DASH_BOARD.home_dashboard__table_DOM.insertRow(DASH_BOARD.home_dashboard__table_DOM.rows.length);

                        const newCell0 = newRow.insertCell(0); // 'task';
                        newCell0.innerText = Home_TaskLists[idx].dash_boardInfo.task_name;
                        const newCell1 = newRow.insertCell(1); // "due date";
                        newCell1.innerText = Home_TaskLists[idx].dash_boardInfo.due_date;
                        const newCell2 = newRow.insertCell(2); // "remain date"
                        newCell2.innerText = Home_TaskLists[idx].dash_boardInfo.remain_day;
                        const newCell3 = newRow.insertCell(3); // progress
                        newCell3.innerText = Home_TaskLists[idx].dash_boardInfo.progress;
                        const newCell4 = newRow.insertCell(4); // remain total
                        newCell4.innerText = Home_TaskLists[idx].dash_boardInfo.remain_total;
                        const newCell5 = newRow.insertCell(5); // remain perday
                        newCell5.innerText = Home_TaskLists[idx].dash_boardInfo.remain_perday;

                        // table 수정 가능 속성
                        DASH_BOARD.dash_tool.set_row_property(newRow, false, "left");
                    }
                }

                // table color load
                DASH_BOARD.Schedule.make_schedule_table();
                DASH_BOARD.Schedule.change_scheduleUI();
            },
        }
        this.updater = {
            update_homeTasklist: function (updated_homeTask) {
                localStorage.setItem(DASH_BOARD.localstoraged_taskinfo, JSON.stringify(updated_homeTask));
            },

            update_dashboardInfo: function () { // UI -> Local Storage
                /*
                수정가능 목록 : Task name, Due Date 
                */
                let Home_TaskLists = JSON.parse(localStorage.getItem(DASH_BOARD.localstoraged_taskinfo));
                let dash_table_rows = DASH_BOARD.home_dashboard__table_DOM.rows.length;
                let task_idx = Dash_TABLE_INDEX["Task Name"];
                let duedate_idx = Dash_TABLE_INDEX["Due Date"];
                for (let i = 0; i < dash_table_rows; i++) {
                    if (i >= 2) { // header 제외
                        let table_Taskname = DASH_BOARD.home_dashboard__table_DOM.rows[i].cells[task_idx].innerText.trim();
                        let table_Duedate = DASH_BOARD.home_dashboard__table_DOM.rows[i].cells[duedate_idx].innerText.trim();

                        // [1] task_name update
                        Home_TaskLists[i - 2].dash_boardInfo.task_name = table_Taskname;
                        // [2] due_date update
                        Home_TaskLists[i - 2].dash_boardInfo.due_date = table_Duedate;

                    }

                }
                this.update_homeTasklist(Home_TaskLists);// update to local storage

            }
        }
        this.Schedule = {
            get_thisMonth_info: function () {
                let date_info = new Date();

                let this_month = date_info.getMonth() + 1;
                let this_year = date_info.getFullYear();

                let daysInMonth = new Date(this_year, this_month, 0).getDate();
                let result = {
                    month: this_month,
                    year: this_year,
                    daysInMonth: daysInMonth,
                }
                return result;

            },
            apply_color: function (time) {
                let result = SCHEDULE_COLOR["Level1"];

                for (let [key, value] of Object.entries(SCHEDULE_COLOR_STANDARD)) {
                    if (value.max >= time && time >= value.min) {
                        result = SCHEDULE_COLOR[key];
                        break;
                    }
                }
                return result;
            },
            make_schedule_table: function () {
                function make_header(month, daysin_month) {    // Table Header Setting
                    let header_tr = document.createElement('tr');
                    let header_td = document.createElement('td');
                    header_tr.classList.add("home_schedule__header");
                    header_tr.appendChild(header_td);
                    header_td.innerText = String(month) + "月";
                    header_td.colSpan = String(daysin_month + 1);
                    header_td.style.textAlign = "center";
                    header_td.style.fontWeight = "bold";
                    return header_tr;
                }

                let month_info = this.get_thisMonth_info();
                let header_tr = make_header(month_info.month, month_info.daysInMonth);

                DASH_BOARD.home_schedule__table.appendChild(header_tr);
                let Hometask_lists = JSON.parse(localStorage.getItem(DASH_BOARD.localstoraged_taskinfo));
                let Task_numbers = Hometask_lists.length;
                for (let row_idx = 0; row_idx < Task_numbers + 1; row_idx++) {
                    //[1] Row Setting
                    let tr = document.createElement('tr');
                    tr.classList.add("schedule_row_" + String(row_idx));

                    //[2] Column Setting
                    for (let col_idx = 0; col_idx < month_info.daysInMonth + 1; col_idx++) {
                        if (row_idx === 0) { //header행인 경우
                            tr.classList.add("home_scedule__daylists");
                            let td = document.createElement('td');
                            if (col_idx === 0) {
                                td.innerText = "Task Name";
                                td.style = "word-wrap";
                            } else {
                                td.innerText = String(col_idx);
                                td.style.width = SCHEDULE_CELL_WIDTH;
                            }

                            td.classList.add("header" + String(col_idx));

                            td.style.textAlign = "center";
                            td.style.fontWeight = "bold";
                            tr.appendChild(td);
                        } else { // header행이 아닌경우
                            let taskname = Hometask_lists[row_idx - 1].dash_boardInfo.task_name;
                            tr.classList.add(taskname);
                            let td = document.createElement('td');
                            if (col_idx === 0) {
                                td.innerText = taskname;
                                td.style = "word-wrap";
                            } else {
                                td.innerText = ".";
                                td.style.textAlign = "center";
                                td.style.width = SCHEDULE_CELL_WIDTH;
                            }

                            td.classList.add(taskname + "_D" + String(col_idx));

                            tr.appendChild(td);
                        }
                    }

                    //[3] Add row
                    DASH_BOARD.home_schedule__table.appendChild(tr);
                }
            },
            change_taskColorUI: function (task_name) {
                let today = new Date();
                let this__month = today.getMonth() + 1;//Get the month as a number (0-11)

                let task_Obj = DASH_BOARD.dash_tool.get_taskObj(task_name);
                let task__detail_lists = task_Obj.tableInfo.task_detail_lists;
                for (let i = 0; i < task__detail_lists.length; i++) {
                    let detail_obj_hist = task__detail_lists[i].timer_info.today_history;
                    for (let [key, value] of Object.entries(detail_obj_hist)) {
                        let day_info = value.start_date;
                        let recorded_time = value.recorded_time;

                        let hist_info = DASH_BOARD.dash_tool.get_dayInfo(day_info);
                        let hist_month = hist_info.month;
                        let hist_date = hist_info.date;
                        if (this__month === hist_month) {
                            let matched_row = DASH_BOARD.home_schedule__table.querySelector("." + task_name);
                            let matched_col = matched_row.querySelector("." + task_name + "_D" + String(hist_date));
                            if (matched_col.innerText === ".") {
                                matched_col.innerText = parseInt(recorded_time);
                                let matched_color = this.apply_color(parseInt(matched_col.innerText));
                                matched_col.style.backgroundColor = matched_color;
                            } else {
                                matched_col.innerText = parseInt(matched_col.innerText) + parseInt(recorded_time);
                                let matched_color = this.apply_color(parseInt(matched_col.innerText));
                                matched_col.style.backgroundColor = matched_color;
                            }
                        }
                    }
                }
            },
            change_scheduleUI: function () {
                let Home_TaskLists = JSON.parse(localStorage.getItem(DASH_BOARD.localstoraged_taskinfo));
                for (let i = 0; i < Home_TaskLists.length; i++) {
                    let task_name = Home_TaskLists[i].dash_boardInfo.task_name;
                    this.change_taskColorUI(task_name);
                }
            }
        }
        this.chart = {
            // https://canvasjs.com/javascript-charts/chart-index-data-label/
            month_info: {
                1: "January",
                2: "Feburary",
                3: "March",
                4: "April",
                5: "May",
                6: "Jun",
                7: "July",
                8: "August",
                9: "September",
                10: "October",
                11: "November",
                12: "December",
            },
            render_chart: function () {
                let month_rawdata = DASH_BOARD.dash_tool.calc_mothly_statistics();
                let converted_month_data = [];
                for (let [key, value] of Object.entries(month_rawdata)) {
                    let time_date = { x: parseInt(key), y: parseInt(value) };
                    converted_month_data.push(time_date);
                }

                let today = new Date();
                let this__month = today.getMonth() + 1;//Get the month as a number (0-11)
                let chart_title = this.month_info[this__month] + " Statisctics";

                let chart = new CanvasJS.Chart("chartContainer", {
                    animationEnabled: true,
                    theme: "dark1", // "light1", "light2", "dark1", "dark2"
                    title: {
                        text: chart_title,
                        fontSize: 20,
                    },
                    axisX: {
                        title: "Days",
                        labelFontSize: 15,
                        titleFontSize: 15,
                    },
                    axisY: {
                        title: "Working Time",
                        includeZero: true,
                        labelFontSize: 15,
                        titleFontSize: 15,
                    },
                    legend: {
                        fontSize: 10,
                    },
                    data: [{
                        type: "line",
                        color: "yellow", // data point color
                        lineColor: "red", //**Change the color here
                        indexLabelFontSize: 16,
                        dataPoints: converted_month_data,
                    }]
                });
                chart.render();
            },



        }
    }// constructor



    add_hometask_toLocalstorage() {

        //localStorage.setItem(this.localstoraged_taskinfo, JSON.stringify([]));

        let last_rowIdx = this.home_dashboard__table_DOM.rows.length - 1 // last row Index

        let last_row = this.home_dashboard__table_DOM.rows[last_rowIdx];
        let task_name = last_row.cells[this.taskname_idx].innerText;
        let task_duedate = last_row.cells[this.task_duedate].innerText;

        let today = new Date();

        // Load HomeTask List;
        let Home_TaskLists = JSON.parse(localStorage.getItem(this.localstoraged_taskinfo)); // "HOME_TASK_INFO";

        let new_taskobj = {
            // Initial Info

            registered_date: today.toLocaleString(), // only home

            is_activate: false, // both

            // Home Dashboard Info(needed to update)
            dash_boardInfo: {
                task_name: task_name,  // both
                due_date: task_duedate,  // both
                remain_day: 0, // only home dashboard
                progress: 0, // both// progress at 'home', progress ration at 'task'
                remain_total: 0, // only home dashboard
                remain_perday: 0, // only home dashboard
            },

            // Detail Table Info(needed to update)
            tableInfo: {
                task_detail_lists: [
                    /*
                    Task Object Form
                    task_obj1={
                        task : String,
                        expected_time : Integer,
                        performance: Integer,
                        remaining : Integer,
                        date : String,
                        timer_info:{
                            timer_total_time : Integer,
                            today_history : {
                                try1:{
                                    start_date: String,
                                    recorded_time: Integer,
                                    },
     
                                try2:{
                                    }
                            },
                        }
                    }
                    */
                ], // 항목별 정보
                total_taskNum: 0,
                expectedSum: 0,
                performanceSum: 0,
                remainingSum: 0,
                performed_expectedTime: 0,
                performance_amount: 0, // 현재시간까지의 performace time
                performance_until_yesterday: 0, // 어제까지 측정한 performance time 
                performance_ratio: 0,
                remaining_ratio: 0,
                performance_amount: 0,
                remaining_amount: 0,
            },

            // Today Work Time(reset on 12:00 AM)
            today_work: {
                total_worktime: 0, // 고정 변수
                task_detail: {
                    /* 
                    가변 변수 Form
                    task1 : {
                        runtime:0,
                        start_time:0
                    }
                    */
                },
            }
        }

        Home_TaskLists.push(new_taskobj);

        localStorage.setItem(this.localstoraged_taskinfo, JSON.stringify(Home_TaskLists));
    }

    remove_hometask_toLocalstorage() {
        // Remove Last Raw and reflect change to Local Storage
        let Home_TaskLists = JSON.parse(localStorage.getItem(this.localstoraged_taskinfo)); // "HOME_TASK_INFO";
        Home_TaskLists.pop();

        localStorage.setItem(this.localstoraged_taskinfo, JSON.stringify(Home_TaskLists));
    }

    add_dashTable_row() {
        // 가장 마지막 행에 추가
        //this.MAX_TASK_NUMBER = 10;
        let tasknumber = this.home_dashboard__table_DOM.rows.length - 2;
        if (tasknumber < this.MAX_TASK_NUMBER) {


            const newRow = this.home_dashboard__table_DOM.insertRow(this.home_dashboard__table_DOM.rows.length);

            const newCell0 = newRow.insertCell(0);

            newCell0.style.textAlign = "left";
            newCell0.innerText = 'task' + String(this.home_dashboard__table_DOM.rows.length - 2);
            const newCell1 = newRow.insertCell(1);
            newCell1.innerText = "";
            const newCell2 = newRow.insertCell(2);
            newCell2.innerText = 0;
            const newCell3 = newRow.insertCell(3);
            newCell3.innerText = 0;

            const newCell4 = newRow.insertCell(4);

            newCell4.innerText = 0;

            const newCell5 = newRow.insertCell(5);
            newCell5.innerText = 0;

            //origin
            //this.update_Home_to_localstorage();
            // new
            this.add_hometask_toLocalstorage();
        } else {
            alert("Task Number is Over!");
        }
    }

    remove_dashTable_row() {
        let tasknumber = this.home_dashboard__table_DOM.rows.length - 2;

        if (tasknumber > 0) {
            this.home_dashboard__table_DOM.deleteRow(this.home_dashboard__table_DOM.rows.length - 1);
            //originfvtrrhfgh
            //this.update_Home_to_localstorage();
            // new
            this.remove_hometask_toLocalstorage();
        } else {
            alert("Remove is Impossible")
        }

    }
    select_task(selected_task) {

        localStorage.setItem("selected_task", []); // 초기화 
        localStorage.setItem("selected_task", JSON.stringify(selected_task));
    }

    initial_setting() {

    }



}

let task_info = { "number": 3 };
function TEST() {
    //let TEST_timer_storage = JSON.parse(localStorage.getItem("HOME_TASK_INFO"));

    //test_taskobj=TEST_timer_storage[0];

}

function init() {
    const home = new Home();

    const dashboard = new Dashboard();
    dashboard.loader.load_localstorage_to_Home();
    dashboard.updater.update_dashboardInfo();

    dashboard.chart.render_chart();


}

init();

