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

        this.Home_TaskLists; // Home Task Lists;

        this.localstoraged_taskinfo = "HOME_TASK_INFO";
        this.taskObject_list = []; // task object들의 모음 => 삭제 해야함


        // DOM Setting
        this.home_dashboard__table_DOM = document.querySelector(".home_dashboard__table");
        this.dashTable_AddBtn_DOM = document.querySelector(".Task_Btn__Add");
        this.dashTable_RemoveBtn_DOM = document.querySelector(".Task_Btn_Remove");
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

        this.dash_tool = {
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

            get_taskObj(task_name) {
                let Home_TaskLists = JSON.parse(localStorage.getItem(DASH_BOARD.localstoraged_taskinfo));
                let find_Result = this.find_task(task_name);
                if (find_Result.is_find === true) {
                    return Home_TaskLists[find_Result.task_loc];
                } else {
                    alert("gettaskobj error!");
                    return undefined;
                }
            }
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
                        DASH_BOARD.dash_tool.set_row_property(newRow, true, "center");
                    }
                }
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
                let task_numbers = Home_TaskLists.length;
                let task_idx = Dash_TABLE_INDEX["Task Name"];
                let duedate_idx = Dash_TABLE_INDEX["Due Date"];
                for (let i = 0; i < task_numbers; i++) {
                    if (i >= 1) { // header 제외
                        let table_Taskname = DASH_BOARD.home_dashboard__table_DOM.rows[i].cells[task_idx].innerText;
                        let table_Duedate = DASH_BOARD.home_dashboard__table_DOM.rows[i].cells[duedate_idx].innerText;

                        let taskFind_result = DASH_BOARD.dash_tool.find_task(table_Taskname);
                        if (taskFind_result.is_find === true) {
                            // [1] task_name update
                            Home_TaskLists[taskFind_result.task_loc].dash_boardInfo.task_name = table_Taskname;
                            // [2] due_date update
                            Home_TaskLists[taskFind_result.task_loc].dash_boardInfo.due_date = table_Duedate;
                        }
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
            make_schedule_table: function () {
                function make_header(month, daysin_month) {    // Table Header Setting
                    let header_tr = document.createElement('tr');
                    let header_td = document.createElement('td');
                    header_tr.classList.add("home_schedule__header");
                    header_tr.appendChild(header_td);
                    header_td.innerText = String(month) + "月";
                    header_td.colSpan = String(daysin_month + 1);
                    header_td.style.textAlign = "center";

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
                                td.innerText = "Task";
                            } else {
                                td.innerText = String(col_idx);
                            }

                            td.classList.add("header" + String(col_idx));
                            td.style.width = SCHEDULE_CELL_WIDTH;
                            tr.appendChild(td);
                        } else { // header행이 아닌경우
                            let td = document.createElement('td');
                            if (col_idx === 0) {
                                td.innerText = Hometask_lists[row_idx - 1].dash_boardInfo.task_name;
                            } else {
                                td.innerText = ".";
                            }

                            td.classList.add(Hometask_lists[row_idx - 1].dash_boardInfo.task_name + "_D" + String(col_idx));
                            td.style.width = SCHEDULE_CELL_WIDTH;
                            tr.appendChild(td);
                        }
                    }

                    //[3] Add row
                    DASH_BOARD.home_schedule__table.appendChild(tr);
                }
            }
        }
        this.chart = {

            work_chart: new Chart(document.querySelector(".month_statistics_chart"), {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: "Today Work!",
                            backgroundColor: this.chartBackground_list,
                            data: []
                        }
                    ]
                },
                options: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Work Chart'
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            min: 0
                        }
                    }
                }
            }),
            update_chartHistory: function () {
                /* 
                1. Localstorage에 저장되어 있는 timer list를 읽어서 저장된 timer 정보 확인
                2. 오늘 수행된 시간 계산
                */
                function get_Todayinfo() {
                    let today = new Date();
                    let today__month = today.getMonth() + 1;//Get the month as a number (0-11)
                    let today__date = today.getDate();//Get the day as a number (1-31)
                    let result = {
                        month: today__month,
                        date: today__date
                    }
                    return result;
                }
                let today_info = get_Todayinfo();

                let task_name = CLASS_Obj.loader.load_TaskName();
                let home_Storage = CLASS_Obj.HOME_TASKLIST_Storage;
                let home_tasklist = JSON.parse(localStorage.getItem(home_Storage));
                let taskinfo = CLASS_Obj.task_tool.find_task_inHome(task_name, home_Storage);
                let task_obj = home_tasklist[taskinfo.task_loc];
                let task_detail_lists = task_obj.tableInfo.task_detail_lists;

                let today_chartObj = {}; // today performance 모음
                /*
                today_chartObj={
                    task1:Integer,
                    task2:Integer
                }
                */

                for (let idx = 0; idx < task_detail_lists.length; idx++) {// task loop
                    let today_taskObj__name = task_detail_lists[idx].task;
                    let task_history = task_detail_lists[idx].timer_info.today_history;
                    for (let [key, value] of Object.entries(task_history)) { // loop for history
                        /*
                        key : try N 
                        value : {
                            start_date: String, 
                            recorded_time: Integer,
                        }
                        */
                        let start_date = value.start_date;
                        let recorded_time = value.recorded_time;
                        let dateAry = start_date.split('.');
                        let task__month = parseInt(dateAry[1]);
                        let task__date = parseInt(dateAry[2]);
                        if (today_info.month === task__month && today_info.date === task__date) {
                            if (today_chartObj.hasOwnProperty(today_taskObj__name) == true) {
                                today_chartObj[today_taskObj__name] += recorded_time;
                            } else {
                                today_chartObj[today_taskObj__name] = recorded_time;
                            }
                        }
                    }
                }
                return today_chartObj;
            },
            update_chartUI: function () {
                let today_chartObj = this.update_chartHistory();

                let task_labels = [];
                let task_data = [];
                let background = [];
                let bg_cnt = 0;
                const CHART = {
                    CHART_BACKGROUND_LIST: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                };
                for (let [key, value] of Object.entries(today_chartObj)) {

                    task_labels.push(key); // key : task name
                    task_data.push(value); // value : task time
                    background.push(CHART.CHART_BACKGROUND_LIST[bg_cnt % CHART.CHART_BACKGROUND_LIST.length]);

                    bg_cnt += 1;
                }
                this.work_chart["data"]["labels"] = task_labels;
                this.work_chart["data"]["datasets"][0]["data"] = task_data;

                this.work_chart["data"]["datasets"][0]["backgroundColor"] = background;
                this.work_chart.update();
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


class Schedule {
    constructor(task_info) {
        // Task Setting
        this.task_number = task_info.number;


        this.home_schedule__table = document.querySelector(".home_schedule__table");
        // [TABLE SETTING]
        // Date Setting
        let date_info = new Date();
        // dt.getMonth() will return a month between 0 - 11
        // we add one to get to the last day of the month 
        // so that when getDate() is called it will return the last day of the month
        this.month = date_info.getMonth() + 1;
        this.year = date_info.getFullYear();

        // this line does the magic (in collab with the lines above)
        this.daysInMonth = new Date(this.year, this.month, 0).getDate();
    }

    make_schedule_table() {
        // Table Header Setting
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        tr.appendChild(td);
        tr.classList.add("home_schedule__header");
        td.innerText = String(this.month) + "월";
        td.colSpan = String(this.daysInMonth);
        td.style.textAlign = "center";

        this.home_schedule__table.appendChild(tr);
        // Table Data Setting
        for (let row_idx = 0; row_idx < this.task_number + 1; row_idx++) {
            // Row Setting
            let tr = document.createElement('tr');
            tr.classList.add("scedule_row_" + String(row_idx));

            // Column Setting

            for (let col_idx = 0; col_idx < this.daysInMonth; col_idx++) {
                if (row_idx == 0) {
                    let td = document.createElement('td');
                    td.innerText = String(col_idx + 1) + "일";
                    tr.appendChild(td);
                } else {
                    let td = document.createElement('td');
                    td.innerText = "..";
                    tr.appendChild(td);
                }
            }


            this.home_schedule__table.appendChild(tr);
        }

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
    dashboard.Schedule.make_schedule_table();
    let home_TestBtn_DOM = document.querySelector(".Test");
    home_TestBtn_DOM.addEventListener("click", () => {
        TEST();
    });


    let calculatedObj = home.task_search("HOME_TASK_INFO");
    console.log("calculatedObj", calculatedObj);
}

init();

