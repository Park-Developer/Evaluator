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


        this.Home_TaskLists; // Home Task Lists;

        this.localstoraged_taskinfo = "HOME_TASK_INFO";
        this.taskObject_list = []; // task object들의 모음 => 삭제 해야함
        this.home_dashboard__table_DOM = document.querySelector(".home_dashboard__table");

        this.dashTable_AddBtn_DOM = document.querySelector(".Task_Btn__Add");
        this.dashTable_RemoveBtn_DOM = document.querySelector(".Task_Btn_Remove");



        // Column Index Setting
        this.taskname_idx = 0;
        this.task_duedate = 1;

        // Button Event Setting
        this.dashTable_AddBtn_DOM.addEventListener("click", () => {
            this.add_dashTable_row();
        });
        this.dashTable_RemoveBtn_DOM.addEventListener("click", () => {
            this.remove_dashTable_row();
        });

    }
    set_row_property(row, editable, text_align) {
        let cell_number = row.cells.length;
        for (let i = 0; i < cell_number; i++) {
            row.cells[i].setAttribute("contenteditable", editable);
            row.cells[i].style.textAlign = text_align;
        }
    }

    load_localstorage_to_Home() {
        const stored_home_table = localStorage.getItem(this.localstoraged_taskinfo);
        this.Home_TaskLists = JSON.parse(stored_home_table);

        let home_data_num = this.Home_TaskLists.length;


        if (this.Home_TaskLists !== null) {
            for (let idx = 0; idx < home_data_num; idx++) {
                const newRow = this.home_dashboard__table_DOM.insertRow(this.home_dashboard__table_DOM.rows.length);

                const newCell0 = newRow.insertCell(0); // 'task';
                newCell0.innerText = this.Home_TaskLists[idx].dash_boardInfo.task_name;
                const newCell1 = newRow.insertCell(1); // "due date";
                newCell1.innerText = this.Home_TaskLists[idx].dash_boardInfo.due_date;
                const newCell2 = newRow.insertCell(2); // "remain date"
                newCell2.innerText = this.Home_TaskLists[idx].dash_boardInfo.remain_day;
                const newCell3 = newRow.insertCell(3); // progress
                newCell3.innerText = this.Home_TaskLists[idx].dash_boardInfo.progress;
                const newCell4 = newRow.insertCell(4); // remain total
                newCell4.innerText = this.Home_TaskLists[idx].dash_boardInfo.remain_total;
                const newCell5 = newRow.insertCell(5); // remain perday
                newCell5.innerText = this.Home_TaskLists[idx].dash_boardInfo.remain_perday;

                // table 수정 가능 속성
                this.set_row_property(newRow, true, "center");
            }
        }

    }
    //임마가 문제네 ㅋ?

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
            newCell1.innerText = "due date";
            const newCell2 = newRow.insertCell(2);
            newCell2.innerText = "remain date";
            const newCell3 = newRow.insertCell(3);
            newCell3.innerText = "progress date";

            const newCell4 = newRow.insertCell(4);
            let today = new Date();
            newCell4.innerText = today.toLocaleDateString();

            const newCell5 = newRow.insertCell(5);
            newCell5.innerText = "perdat";

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
    dashboard.load_localstorage_to_Home();

    let home_TestBtn_DOM = document.querySelector(".Test");
    home_TestBtn_DOM.addEventListener("click", () => {
        TEST();
    });


    let calculatedObj = home.task_search("HOME_TASK_INFO");
    console.log("calculatedObj", calculatedObj);
}

init();

/*
dashboard에서 정의해야할 함수 -> Event 함수로 만들기
  select_task(taskCls_list) {
        for (let idx = 0; idx < taskCls_list.length; idx++) {
            if (taskCls_list[idx].is_activate == true) {
                this.task_name = taskCls_list[idx].task_name;
                this.local_storage_name = taskCls_list[idx].task_local_storage;
                this.due_date = taskCls_list[idx].due_date;
                break;
            }

        }

    }
 */