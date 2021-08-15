class Task {
    constructor(Task) {
        // CONST Setting
        this.HOME_TASKLIST_Storage = "HOME_TASK_INFO"; // local storage 변수명

        // DOM Setting

        this.Task_Table__table = Task.querySelector(".Task_Table__table");
        this.Task_Btn_Add = Task.querySelector(".Task_Btn__Add");
        this.Task_Btn_Remove = Task.querySelector(".Task_Btn_Remove");
        this.Task_Selector = Task.querySelector(".Task_Selector__selection");
        this.Task_UI_Title = Task.querySelector(".Task_Title");
        this.Task_Home_Btn = document.querySelector(".home_Retry_Btn");

        // Button Event setting
        this.Task_Btn_Add.addEventListener("click", () => {
            this.table.add_lastrow();
        });

        this.Task_Btn_Remove.addEventListener("click", () => {
            this.table.remove_lastrow();
        });

        // Selector Event
        this.Task_Selector.addEventListener("change", () => {
            this.table.change_selected_task();

        });

        this.Task_Home_Btn.addEventListener("click", () => {

            location.href = "../main.html";

        });


        this.TEST_BTN = Task.querySelector(".Test");

        const CLASS_Obj = this;

        this.home = {
            this_class: CLASS_Obj,

        }

        this.task_tool = {
            set_row_property: function (row, editable, text_align) {
                let cell_number = row.cells.length;
                for (let i = 0; i < cell_number; i++) {
                    row.cells[i].setAttribute("contenteditable", editable);
                    row.cells[i].style.textAlign = text_align;
                }
            },

            find_task_inHome: function (task_name, home_Storage) {
                let home_tasklist = JSON.parse(localStorage.getItem(home_Storage));
                let result = {
                    is_find: false,
                    task_loc: -1
                };
                for (let i = 0; i < home_tasklist.length; i++) {
                    if (task_name === home_tasklist[i].dash_boardInfo.task_name) {
                        result.is_find = true;
                        result.task_loc = i;
                        break;
                    }
                }
                // Error Check
                if (result.is_find === false) {
                    alert("No Task!");
                }
                return result;
            },

            make_tableRow: function (row_info) {
                let row_index = row_info.row_index;
                let table_dom = row_info.table_dom;
                let task_name = row_info.task_name;
                let detail_subtask_name = row_info.detail_subtask_name;
                let storage_address = row_info.storage_address;

                let expected_time = row_info.expected_time;
                let performance = row_info.performance;
                let remaining = row_info.remaining;
                let date = row_info.date;

                const newRow = table_dom.insertRow(row_index);
                const newCell0 = newRow.insertCell(0); // task name
                newCell0.innerText = detail_subtask_name;
                const newCell1 = newRow.insertCell(1); // expected time
                newCell1.innerText = expected_time;

                const newCell2 = newRow.insertCell(2); // performance
                newCell2.innerText = performance;

                const newCell3 = newRow.insertCell(3); // remaining
                newCell3.innerText = remaining;

                const newCell4 = newRow.insertCell(4); // date
                newCell4.innerText = date;

                const newCell5 = newRow.insertCell(5); //
                let timer_info = {
                    task_name: task_name,
                    detail_subtask_name: detail_subtask_name,
                    storage_address: storage_address,
                }

                // Button Setting 

                let timer = new Timer(timer_info); // task_id = row_id

                // DOM Setting
                newCell5.style.display = "flex";
                newCell5.appendChild(timer.Timer_Start_button_DOM);
                newCell5.appendChild(timer.Timer_End_button_DOM);
                newCell5.appendChild(timer.Timer_display_DOM);
                // table 수정 가능 속성

                this.set_row_property(newRow, true, "center");

            },


        }


        this.updater = {
            this_class: CLASS_Obj,

            update_timerInfo: function () {

            },

            update_table: function () {
                let task_name = this.this_class.loader.load_TaskName();
                let home_Storage = this.this_class.HOME_TASKLIST_Storage;
                let home_tasklist = JSON.parse(localStorage.getItem(home_Storage));
                let taskinfo = this.this_class.task_tool.find_task_inHome(task_name, home_Storage);
                let task_obj;

                if (taskinfo.is_find === true) {
                    // Function Definition

                    function find_detailObj_byName(detail_name, current_detail_list) {
                        result = {
                            is_find: false,
                            obj_loc: -1
                        }

                        for (let i = 0; i < current_detail_list.length; i++) { // searching to find matched detail object
                            if (detail_name === current_detail_list[i].task) {
                                result.is_find = true;
                                result.obj_loc = i;
                                break;
                            }
                        }

                        if (result.is_find === false) {
                            alert("No detail Object!");
                        }

                        return result;
                    }
                    function get_timerInfo() {

                    }
                    function update__detail_list() {
                        let table_dom = this.this_class.Task_Table__table;
                        let task_name = this.this_class.loader.load_TaskName();
                        let home_Storage = this.this_class.HOME_TASKLIST_Storage;
                        let home_tasklist = JSON.parse(localStorage.getItem(home_Storage));
                        let taskinfo = this.this_class.task_tool.find_task_inHome(task_name, home_Storage);
                        let task_obj = home_tasklist[taskinfo.task_loc]; // main task

                        let current_detail_list = task_obj.tableInfo.task_detail_lists; // Current Detatil Task List saved in Local Storage
                        let detail_obj; // in detail list

                        for (let row_idx = 0; row_idx < table_dom.rows.length - 1; row_idx++) {
                            if (row_idx >= 1) {
                                let row = table_dom.rows[row_idx];

                                let table__task_name = row.cells[0].innerHTML;
                                let find_result = find_detailObj_byName(table__task_name, current_detail_list)
                                if (find_result.is_find === true) {
                                    // Table과 local storage에 같은 값이 있는 경우 update

                                    current_detail_list[find_result.obj_loc].task = row.cells[0].innerHTML;
                                    current_detail_list[find_result.obj_loc].expected_time = row.cells[1].innerHTML;
                                    current_detail_list[find_result.obj_loc].performance = row.cells[2].innerHTML;
                                    current_detail_list[find_result.obj_loc].remaining = row.cells[3].innerHTML;
                                    current_detail_list[find_result.obj_loc].date = row.cells[4].innerHTML;
                                } else {
                                    //local storage에 없으면 새로 추가하기
                                    let temp_obj = { // 신규 obj
                                        task: row.cells[0].innerHTM,
                                        expected_time: row.cells[1].innerHTML,
                                        performance: row.cells[2].innerHTML,
                                        remaining: row.cells[3].innerHTML,
                                        date: row.cells[4].innerHTML,
                                        timer_info: get_timerInfo(),
                                    }

                                    current_detail_list.push(temp_obj);

                                }
                            }
                        }
                        return current_detail_list;
                    }

                    function update__summary_Data() {

                    }





                } else {
                    alert("No Task Error!");
                }
            }

        }

        this.loader = {
            this_class: CLASS_Obj,

            load_taskOption: function (home_Storage) { // for init
                let home_tasklist = JSON.parse(localStorage.getItem(home_Storage));
                for (let i = 0; i < home_tasklist.length; i++) {
                    let option = document.createElement('option');
                    option.value = option.text = home_tasklist[i].dash_boardInfo.task_name;
                    this.this_class.Task_Selector.add(option);
                }
            },

            load_TaskName: function () {
                let selected_taskName = CLASS_Obj.Task_Selector.value;
                return selected_taskName;
            },

            load_table: function () {
                /*
                현재 설정되어 있는 Task Name을 기반으로 Localstorage에서 데이터 load하여 Table UI에 반영
                */
                let task_name = this.load_TaskName();
                let home_Storage = CLASS_Obj.HOME_TASKLIST_Storage;
                let home_tasklist = JSON.parse(localStorage.getItem(home_Storage));
                let taskinfo = CLASS_Obj.task_tool.find_task_inHome(task_name, home_Storage);
                let task_obj;

                if (taskinfo.is_find === true) {
                    task_obj = home_tasklist[taskinfo.task_loc];

                    let task_detail_lists = task_obj.tableInfo.task_detail_lists;

                    let row_info = {
                        table_dom: this.this_class.Task_Table__table, // 고정 parameter 
                        task_name: this.load_TaskName(), // 고정 parameter 
                        storage_address: this.this_class.HOME_TASKLIST_Storage,// 고정 parameter 
                        detail_subtask_name: '',
                        row_index: 0,
                        expected_time: 0,
                        performance: 0,
                        remaining: 0,
                        date: 0,
                    }

                    function reset_current_table(this_class) {
                        let row_number = this_class.Task_Table__table.rows.length;

                        for (let row_idx = 0; row_idx < row_number - 2; row_idx++) {
                            this_class.Task_Table__table.deleteRow(this_class.Task_Table__table.rows.length - 2);
                        }

                    }

                    function load_table_fromLocal(this_class, row_info, task_detail_lists) {
                        for (let strg_idx = 0; strg_idx < task_detail_lists.length; strg_idx++) {
                            row_info.row_index = row_info.table_dom.rows.length - 1;

                            row_info.detail_subtask_name = task_detail_lists[strg_idx].task;
                            row_info.expected_time = task_detail_lists[strg_idx].expected_time;
                            row_info.performance = task_detail_lists[strg_idx].performance;
                            row_info.remaining = task_detail_lists[strg_idx].remaining;
                            row_info.date = task_detail_lists[strg_idx].date;
                            row_info.storage_address = CLASS_Obj.HOME_TASKLIST_Storage

                            this_class.task_tool.make_tableRow(row_info);

                        }

                    }

                    reset_current_table(this.this_class);
                    load_table_fromLocal(this.this_class, row_info, task_detail_lists);

                } else {
                    alert("No Task Error!");
                }
            }

        }


        this.table = {
            this_class: CLASS_Obj,
            task_name: '',
            detail_object: {}, // 각각의 Detail Object들의 list
            storage_address: CLASS_Obj.HOME_TASKLIST_Storage,
            sample: "saampE!", // for test

            add_lastrow: function () {
                let task_clsObj = this.this_class;


                let row_info = {
                    row_index: task_clsObj.Task_Table__table.rows.length - 1,
                    table_dom: task_clsObj.Task_Table__table,
                    task_name: task_clsObj.loader.load_TaskName(),
                    detail_subtask_name: 'detailtask' + String(task_clsObj.Task_Table__table.rows.length - 2),
                    storage_address: this.storage_address,
                    expected_time: 0,
                    performance: 0,
                    remaining: 0,
                    date: 0,
                }

                task_clsObj.task_tool.make_tableRow(row_info);
            },

            remove_lastrow: function () {
                let task_clsObj = this.this_class;

                let lastrow_index = task_clsObj.Task_Table__table.rows.length - 2;

                if (lastrow_index > 0) {
                    task_clsObj.Task_Table__table.deleteRow(lastrow_index);
                }
            },

            change_selected_task: function () {
                let task_clsObj = this.this_class;
                task_clsObj.loader.load_table();
            },
        }

        this.chart = {
            this_class: CLASS_Obj,
            work_chart: new Chart(document.querySelector(".today_chart__bar_chart"), {
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
            update_todayHistory: function () {
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
                let today_chartObj = this.update_todayHistory();

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
    }


    ini_setting() { // class method : initialization 
        this.loader.load_taskOption(this.HOME_TASKLIST_Storage);
        this.loader.load_table();
        this.chart.update_chartUI();
    }
}



function init() {
    //this.handler.loader.load_taskOption();
}

function simul() {
    const TASK = document.querySelector(".Task");
    test_table = new Task(TASK);
    test_table.ini_setting();

}

simul();