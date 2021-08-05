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
                let storage_address = row_info.torage_address;

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

        this.handler = {
            this_class: CLASS_Obj,

            updater: {
                this_class: CLASS_Obj,

                update_table: function () {
                    let task_name = this.this_class.handler.loader.load_TaskName();
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
                            let task_name = this.this_class.handler.loader.load_TaskName();
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

            },

            loader: {
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
                    let task_name = CLASS_Obj.handler.loader.load_TaskName();
                    let home_Storage = CLASS_Obj.HOME_TASKLIST_Storage;
                    let home_tasklist = JSON.parse(localStorage.getItem(home_Storage));
                    let taskinfo = CLASS_Obj.task_tool.find_task_inHome(task_name, home_Storage);
                    let task_obj;

                    if (taskinfo.is_find === true) {
                        task_obj = home_tasklist[taskinfo.task_loc];

                        let task_detail_lists = task_obj.tableInfo.task_detail_lists;

                        let row_info = {
                            table_dom: this.this_class.Task_Table__table, // 고정 parameter 
                            task_name: this.this_class.handler.loader.load_TaskName(), // 고정 parameter 
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

                                this_class.task_tool.make_tableRow(row_info);

                            }

                        }

                        reset_current_table(this.this_class);
                        load_table_fromLocal(this.this_class, row_info, task_detail_lists);

                    } else {
                        alert("No Task Error!");
                    }
                }

            },
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
                    task_name: task_clsObj.handler.loader.load_TaskName(),
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
                task_clsObj.handler.loader.load_table();
            },
        };


    }

    ini_setting() { // class method : initialization 
        this.handler.loader.load_taskOption(this.HOME_TASKLIST_Storage);
        this.handler.loader.load_table();

    }
}


class Timer {
    constructor(timer_info) {
        /*
        timer_info = {
            task_name: this.task_name,
            task_index: strg_idx,
            detail_subtask: this.task_detail_lists[strg_idx].task,
            storage_address: this.home_taskInfo,
        }
         */
        this.task_name = timer_info.task_name
        this.detail_subtask_name = timer_info.detail_subtask_name;
        this.storage_address = timer_info.storage_address;


        // DOM Setting
        this.Timer_Start_button_DOM = document.createElement("button");
        this.Timer_Start_button_DOM.innerHTML = "▶";

        this.Timer_End_button_DOM = document.createElement("button");
        this.Timer_End_button_DOM.innerHTML = "⬜";

        this.Timer_display_DOM = document.createElement("span");
        this.Timer_display_DOM.innerHTML = 0;

        // Button Event Setting
        this.Timer_Start_button_DOM.addEventListener("click", () => {
            this.startTimer();
        });

        // end button event setting
        this.Timer_End_button_DOM.addEventListener("click", () => {
            this.endTimer();
        });

        this.current_saved_time = 0;
        this.cumulative_saved_time = 0;// 지금까지 기록된 시간
        this.start_time = 0;
        this.start_date;
        this.end_time = 0;

        this.is_running = false; //timer 측정중 여부

        // UI DOM Setting
        this.Timer_Start_button_DOM.style.display = "block";
        this.Timer_display_DOM.style.display = "block";
        this.Timer_End_button_DOM.style.display = "none";

    }
    display_recorded_time() {
        if (this.is_running == true) {
            this.Timer_display_DOM.innerHTML = Math.floor((Date.now() - this.start_time) / 1000);
        } else {
            this.Timer_display_DOM.innerHTML = 0;
        }
    }
    startTimer() {

        this.start_time = Date.now();
        this.is_running = true;
        let today = new Date();
        this.start_date = today.toLocaleString();
        this.update_btn_UI();

    }
    endTimer() {
        console.log("Timer Class endTimer");
        this.end_time = Date.now();
        this.current_saved_time = Math.floor((this.end_time - this.start_time) / 1000);
        this.cumulative_saved_time += this.current_saved_time;
        this.is_running = false;

        this.update_btn_UI();

        //this.storage_address => timer local storage address
        //this.task_address => "HOME_TASK_INFO"

        this.Timer_display_DOM.innerHTML = this.current_saved_time; // test
        // 5초 뒤에 사라지게 하기
    }

    update_btn_UI() {
        if (this.is_running == false) {
            this.Timer_Start_button_DOM.style.display = "block";
            this.Timer_End_button_DOM.style.display = "none";
            this.Timer_display_DOM.innerHTML = 0;
        } else {
            this.Timer_Start_button_DOM.style.display = "none";
            this.Timer_End_button_DOM.style.display = "block";

        }

        this.interval = setInterval(this.display_recorded_time.bind(this), 100);
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