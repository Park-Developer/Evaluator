const TASK = document.querySelector(".Task");
// [TABLE SETTING]
const Task_Table__table = TASK.querySelector(".Task_Table__table");
const Task_Btn_Add = TASK.querySelector(".Task_Btn__Add");
const Task_Btn_Remove = TASK.querySelector(".Task_Btn_Remove");
const Task_Selector = TASK.querySelector(".Task_Selector__selection");
const Task_Name = TASK.querySelector(".Task_Title");

/***********************************************************/

// [STATISTIC SETTING]
const Summary = document.querySelector(".Summary");

const Performance_ratio__value = Summary.querySelector(".performance_ratio__value");
const Remaining_ratio__value = Summary.querySelector(".remaining_ratio__value");
const Performance_amount__value = Summary.querySelector(".performance_amount__value");
const Remaining_amount__value = Summary.querySelector(".remaining_amount__value");

// FOR TEST
const TEST_BTN = TASK.querySelector(".Test");
//

const Task_Table__tasklist_Sum = TASK.querySelector(".Task_Table__tasklist_Sum");

const TASK_TABLE_Storage = "TASK_TABLE_INFO"; // local storage 변수명


function update_selection() { // mig ok
    Task_Name.innerHTML = Task_Selector.value;
}

function update_progress_ratio(task_cls) {
    Performance_ratio__value.innerHTML = task_cls.expectedSum
    Remaining_ratio__value.innerHTML = task_cls.expectedSum
}

function update_progress_amount(task_cls) {
    Performance_amount__value.innerHTML = task_cls.expectedSum
    Remaining_amount__value.innerHTML = task_cls.expectedSum
}

class Task_home {
    constructor() {
        this.Task_Home_Btn = document.querySelector(".home_Retry_Btn");
        this.is_taskhome = true;

        // Button Event Setting
        this.Task_Home_Btn.addEventListener("click", () => {

            location.href = "../main.html";

        });
    }

    debug() {

    }
}

class Task_Table_UI {
    constructor(TASK_element) {

        this.Home_TaskLists;
        this.selected_taskObj;
        this.selected_taskIndex;
        /********************************************** */
        // TASK OBJECT PARAMETER


        this.registered_date;

        this.task_name;
        this.due_date;
        this.remain_day;
        this.progress;
        this.remain_total;
        this.remain_perday;


        // calculated parameter
        this.task_detail_lists;
        this.expectedSum = 0;
        this.performanceSum = 0;
        this.remainingSum = 0;

        this.performed_expectedTime = 0;
        this.performance_amount = 0;
        this.performance_until_yesterday = 0;
        this.performance_ratio = 0;
        this.remaining_ratio = 0;
        this.performance_amount = 0;
        this.remaining_amount = 0;

        // Today Work Time
        this.total_worktime = 0;
        this.task_detail = {};

        /********************************************** */
        this.home_taskInfo = "HOME_TASK_INFO"; // 등록된 task들의 모음 in localstoraged
        this.timer_storage = "TASK_TIMER"; // 현재 Task의 Timer 시간 모음
        this.TASK_element = TASK_element; // DOM Element

        // Column Index
        this.taskname_index = 0;
        this.expextedtime_index = 1;
        this.performancetine_index = 2;
        this.remainingtime_index = 3;
        this.data_index = 4;

        // DOM ELEMENT Setting
        this.Task_Table__table = this.TASK_element.querySelector(".Task_Table__table");
        this.Task_Btn_Add = this.TASK_element.querySelector(".Task_Btn__Add");
        this.Task_Btn_Remove = this.TASK_element.querySelector(".Task_Btn_Remove");
        this.Task_Selector = this.TASK_element.querySelector(".Task_Selector__selection");
        this.Task_UI_Title = this.TASK_element.querySelector(".Task_Title");

        // Button Event setting
        this.Task_Btn_Add.addEventListener("click", () => {
            this.add_table_row();
        });

        this.Task_Btn_Remove.addEventListener("click", () => {
            this.remove_table_row();
        });

        // Selector Event
        this.Task_Selector.addEventListener("change", () => {
            this.change_selected_task();
        });


        // last low element
        this.Table_tasklist_Sum = this.TASK_element.querySelector(".Task_Table__tasklist_Sum");


        this.Table__expectedtime_Sum_DOM = this.TASK_element.querySelector(".Task_Table__expectedtime_Sum");
        this.Table__performance_Sum_DOM = this.TASK_element.querySelector(".Task_Table__performance_Sum");

        this.Table__remaining_Sum_DOM = this.TASK_element.querySelector(".Task_Table__remaining_Sum");

        this.task_selector_DOM = this.TASK_element.querySelector(".Task_Selector__selection");


        // Summary UI
        this.Summary = document.querySelector(".Summary");

        this.Performance_ratio__value_DOM = Summary.querySelector(".performance_ratio__value");
        this.Remaining_ratio__value_DOM = Summary.querySelector(".remaining_ratio__value");
        this.Performance_amount__value_DOM = Summary.querySelector(".performance_amount__value");
        this.Remaining_amount__value_DOM = Summary.querySelector(".remaining_amount__value");


        // Chart
        this.CHART_BACKGROUND_LIST = ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"]; //mig ok
        this.work_chart = new Chart(document.querySelector(".today_chart__bar_chart"), {//mig ok
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
        });
    }


    reset_timer_storage(timer_storage) {
        localStorage.setItem(timer_storage, JSON.stringify([]));
    }

    load_timerfrom_taskObj_toLocal(selected_task_detail_lists) {
        let taskName;


        let Timer_info_ToUpdate = [];

        let today_history;
        let timer_total_time;

        for (let row_idx = 0; row_idx < selected_task_detail_lists.length; row_idx++) {
            taskName = selected_task_detail_lists[row_idx].task;

            timer_total_time = selected_task_detail_lists[row_idx].timer_info.timer_total_time;
            today_history = selected_task_detail_lists[row_idx].timer_info.today_history;

            let timerObj = {
                task_name: taskName,
                timer_total_time: timer_total_time,
                today_history: today_history,
            }

            Timer_info_ToUpdate.push(timerObj);
        }

        localStorage.setItem(this.timer_storage, JSON.stringify([]));
        localStorage.setItem(this.timer_storage, JSON.stringify(Timer_info_ToUpdate));
    }


    change_selected_task() {
        console.log('debuyg test');
        this.reset_current_table();
        this.selected_taskObj = this.select_task(this.task_selector_DOM.value, this.home_taskInfo);
        this.copy_selected_info(this.selected_taskObj); // copy data from localstarage to class member

        this.reset_timer_storage(this.timer_storage); // Timer local storage reset
        this.load_timerfrom_taskObj_toLocal(this.task_detail_lists);
        this.load_localstoarge_table();

        // Chart Update
        let today_chartObj = this.update_TodayhistoryUI(this.timer_storage);
        this.update_chart(today_chartObj);

    }
    update_taskOption_ini() { // initial func
        const registered_tasklist = localStorage.getItem(this.home_taskInfo);
        this.Home_TaskLists = JSON.parse(registered_tasklist);


        for (let i = 0; i < this.Home_TaskLists.length; i++) {

            let option = document.createElement('option');
            option.value = option.text = this.Home_TaskLists[i].dash_boardInfo.task_name;
            this.task_selector_DOM.add(option);
        }

        // default selection
        this.select_task(this.task_selector_DOM.value, this.home_taskInfo);
    }

    copy_selected_info(selected_taskObj) {
        // copy data from localstarage to class member
        this.registered_date = selected_taskObj.registered_date;
        this.is_activate = selected_taskObj.is_activate;


        //   dash_boardInfo
        this.task_name = selected_taskObj.dash_boardInfo.task_name;
        this.due_date = selected_taskObj.dash_boardInfo.due_date;

        this.remain_day = selected_taskObj.dash_boardInfo.remain_day;
        this.progress = selected_taskObj.dash_boardInfo.progress;
        this.remain_total = selected_taskObj.dash_boardInfo.remain_total;
        this.remain_perday = selected_taskObj.dash_boardInfo.remain_perday;

        //  tableInfo
        this.task_detail_lists = selected_taskObj.tableInfo.task_detail_lists;
        /* task_detail_lists form
        task_obj1={
            task : String,
            expected_time : Integer,
            performance: Integer,
            performance_today : Integer,
            performance_until_yesterday : Integer,
            remaining : Integer,
            date : String,
        }

        */
        this.expectedSum = selected_taskObj.tableInfo.expectedSum;
        this.performanceSum = selected_taskObj.tableInfo.performanceSum;
        this.remainingSum = selected_taskObj.tableInfo.remainingSum;

        this.performed_expectedTime = selected_taskObj.tableInfo.performed_expectedTime;
        this.performance_amount = selected_taskObj.tableInfo.performance_amount;
        this.performance_until_yesterday = selected_taskObj.tableInfo.performance_until_yesterday;
        this.performance_ratio = selected_taskObj.tableInfo.performance_ratio;
        this.remaining_ratio = selected_taskObj.tableInfo.remaining_ratio;
        this.performance_amount = selected_taskObj.tableInfo.performance_amount;
        this.remaining_amount = selected_taskObj.tableInfo.remaining_amount;

        // Today Work
        this.total_worktime = selected_taskObj.today_work.total_worktime;
        this.task_detail = selected_taskObj.today_work.task_detail;

    }
    change_taskActivation(selected_taskIndex, hometask_storage) {
        let home_tasklist = JSON.parse(localStorage.getItem(hometask_storage));

        for (let i = 0; i < home_tasklist.length; i++) {
            if (i == selected_taskIndex) {
                home_tasklist[i].is_activate = true;
            } else {
                home_tasklist[i].is_activate = false;
            }
        }

        localStorage.setItem(this.home_taskInfo, JSON.stringify(home_tasklist));
    }
    select_task(selected_taskName, hometask_storage) {
        // select task through combo box
        let home_tasklist = JSON.parse(localStorage.getItem(hometask_storage));
        let selectd_taskobj;

        for (let i = 0; i < home_tasklist.length; i++) {

            if (selected_taskName === home_tasklist[i].dash_boardInfo.task_name) {
                this.selected_taskIndex = i; // new selected task index


                this.change_taskActivation(this.selected_taskIndex, hometask_storage); // change task activation
                //this.selected_taskObj = home_tasklist[i]; // select task_obj

                selectd_taskobj = home_tasklist[i]; // select task_obj
            }

        }
        return selectd_taskobj;

    }



    test() {

        // this.home_taskInfo = "HOME_TASK_INFO"; // 등록된 task들의 모음 in localstoraged
        // this.timer_storage = "TASK_TIMER"; // 현재 Task의 Timer 시간 모음
        console.log(", this.expectedSum ", this.expectedSum);
        console.log(this.update_TodayhistoryUI(this.timer_storage));
        let today_chartObj = this.update_TodayhistoryUI(this.timer_storage);
        this.update_chart(today_chartObj);
        console.log("DEBUGGING");
        //this.update_to_localstoarge2();
    }
    change_task(task_name) {
        this.task_name = task_name;
        this.local_storage_name = task_name;

    }
    set_row_property(row, editable, text_align) { // mig ok
        let cell_number = row.cells.length;
        for (let i = 0; i < cell_number; i++) {
            row.cells[i].setAttribute("contenteditable", editable);
            row.cells[i].style.textAlign = text_align;
        }
    }
    update_timerStorage() { //=> Init func
        let taskObj;
        this.task_detail_lists;
        /*
        timer_storage=[ // type : list
        timer_obj1 = { // detail task1
        task_name: newtask_name,
        timer_total_time: 0,
        today_history: {},
        };
        */

        localStorage.setItem(this.timer_storage, JSON.stringify([])); //  timer local 저장소 초기화

        let Timer_storaged_List = [];



        for (let i = 0; i < this.task_detail_lists.length; i++) {
            taskObj = this.task_detail_lists[i];

            let timerObj = new Object;
            timerObj = {
                task_name: taskObj.task,
                timer_total_time: taskObj.timer_info.timer_total_time,
                today_history: taskObj.timer_info.today_history,
            }

            Timer_storaged_List.push(timerObj);

        }
        localStorage.setItem(this.timer_storage, JSON.stringify(Timer_storaged_List)); //  t
    }
    load_localstoarge_table() {
        // load table data from selected task's task detail lists
        if (this.task_detail_lists !== null) {
            for (let strg_idx = 0; strg_idx < this.task_detail_lists.length; strg_idx++) {

                const newRow = this.Task_Table__table.insertRow(this.Task_Table__table.rows.length - 1);

                const newCell0 = newRow.insertCell(0); // task
                newCell0.innerText = this.task_detail_lists[strg_idx].task;

                const newCell1 = newRow.insertCell(1); // expected time
                newCell1.innerText = this.task_detail_lists[strg_idx].expected_time;

                const newCell2 = newRow.insertCell(2); // performance
                newCell2.innerText = this.task_detail_lists[strg_idx].performance;



                const newCell3 = newRow.insertCell(3); // remaining
                newCell3.innerText = this.task_detail_lists[strg_idx].remaining;

                const newCell4 = newRow.insertCell(4); // date
                newCell4.innerText = this.task_detail_lists[strg_idx].date;

                const newCell5 = newRow.insertCell(5); //
                let timer_info = {
                    task_name: this.task_name,
                    task_index: strg_idx,
                    detail_subtask_name: this.task_detail_lists[strg_idx].task,
                    timer_storage: this.timer_storage, //this.timer_storage = "TASK_TIMER"
                    task_storage: this.home_taskInfo, //"HOME_TASK_INFO"
                }

                // Button Setting 
                console.log("loadiadad", timer_info.task_name);
                let timer = new Timer(timer_info); // task_id = row_id


                // Event Setting
                //timer.setEvent();

                // DOM Setting
                newCell5.style.display = "flex";
                newCell5.appendChild(timer.Timer_Start_button_DOM);
                newCell5.appendChild(timer.Timer_End_button_DOM);
                newCell5.appendChild(timer.Timer_display_DOM);
                // table 수정 가능 속성
                this.set_row_property(newRow, true, "center");

            }
        }

        // Statistics Update
        this.update_table_statistics();
    }

    reset_current_table() {
        // reset all rows in table except header
        let row_number = this.Task_Table__table.rows.length;

        for (let row_idx = 0; row_idx < row_number - 2; row_idx++) {
            this.Task_Table__table.deleteRow(this.Task_Table__table.rows.length - 2);
        }

    }

    calc_progress_raio() {
        if (this.expectedSum == 0) {
            this.performance_ratio = 0;
            this.remaining_ratio = 0;
        } else {
            this.performance_ratio = (this.performed_expectedTime / this.expectedSum) * 100;
            this.remaining_ratio = 100 - this.performance_ratio;
        }
    }

    update_progress_UI() {
        // Task Information
        this.Task_UI_Title.innerHTML = this.Task_Selector.value;

        // Sum 
        this.Table_tasklist_Sum.innerText = this.Task_Table__table.rows.length - 2;
        this.Table__expectedtime_Sum_DOM.innerHTML = this.expectedSum;
        this.Table__performance_Sum_DOM.innerHTML = this.performanceSum;
        this.Table__remaining_Sum_DOM.innerHTML = this.remainingSum;

        // Progress
        this.Performance_ratio__value_DOM.innerHTML = this.performance_ratio.toFixed(2) + "%";
        this.Remaining_ratio__value_DOM.innerHTML = this.remaining_ratio.toFixed(2) + "%";
        this.Performance_amount__value_DOM.innerHTML = this.performance_amount;
        this.Remaining_amount__value_DOM.innerHTML = this.remaining_amount;


    }

    calc_ramaining_time() {
        //this.expextedtime_index=1;
        //this.performancetine_index=2;
        //this.remainingtime_index=3;
        let remain_time = 0;
        let expected_time = 0;
        let performance_time = 0;

        for (let row_idx = 0; row_idx < this.Task_Table__table.rows.length; row_idx++) {
            if (row_idx >= 1 && row_idx < this.Task_Table__table.rows.length - 1) {
                expected_time = parseInt(this.Task_Table__table.rows[row_idx].cells[this.expextedtime_index].innerText);
                performance_time = parseInt(this.Task_Table__table.rows[row_idx].cells[this.performancetine_index].innerText);

                remain_time = expected_time - performance_time;

                this.Task_Table__table.rows[row_idx].cells[this.remainingtime_index].innerText = remain_time;
            }
        }
    }
    update_table_statistics() {

        // 합계 통계
        this.calc_eachPara_sum();

        this.calc_performance_and_remaining_time();

        this.calc_progress_raio();

        this.update_progress_UI();
    }


    add_table_row() {
        const newRow = this.Task_Table__table.insertRow(this.Task_Table__table.rows.length - 1);

        let newtask_name = 'task' + String(this.Task_Table__table.rows.length - 2);
        const newCell0 = newRow.insertCell(0);
        newCell0.innerText = newtask_name
        const newCell1 = newRow.insertCell(1);
        newCell1.innerText = 0;
        const newCell2 = newRow.insertCell(2);
        newCell2.innerText = 0;
        const newCell3 = newRow.insertCell(3);
        newCell3.innerText = 0;

        const newCell4 = newRow.insertCell(4);
        let today = new Date();
        newCell4.innerText = today.toLocaleString();

        const newCell5 = newRow.insertCell(5);
        console.log("task_indextask_indextask_index", this.task_detail_lists, this.Task_Table__table.rows.length - 3);
        let timer_info = {
            task_name: this.task_name,
            task_index: this.Task_Table__table.rows.length - 2,
            detail_subtask_name: newtask_name,
            timer_storage: this.timer_storage, //this.timer_storage = "TASK_TIMER"
            task_storage: this.home_taskInfo, //"HOME_TASK_INFO"
        }
        // Button Setting 
        let timer = new Timer(timer_info); // task_id = row_id

        // DOM setting
        newCell5.style.display = "flex";
        newCell5.appendChild(timer.Timer_Start_button_DOM);
        newCell5.appendChild(timer.Timer_End_button_DOM);
        newCell5.appendChild(timer.Timer_display_DOM);

        this.set_row_property(newRow, true, "center");


        //Timer Storage setting
        let timer_storage = JSON.parse(localStorage.getItem(this.timer_storage));
        let timer_obj = {
            task_name: newtask_name,
            timer_total_time: 0,
            today_history: {},
        };

        timer_storage.push(timer_obj); // timer storage에서 마지막 행 제거
        localStorage.setItem(this.timer_storage, JSON.stringify(timer_storage));

        this.update_to_localstoarge2();
        let today_chartObj = this.update_TodayhistoryUI(this.timer_storage);
        this.update_chart(today_chartObj);
    }

    remove_table_row() {
        let lastrow_index = this.Task_Table__table.rows.length - 2;

        if (lastrow_index > 0) {
            // Timer Setting
            let timer_storage = JSON.parse(localStorage.getItem(this.timer_storage));
            timer_storage.pop();
            localStorage.setItem(this.timer_storage, JSON.stringify(timer_storage));

            // Table UI Setting
            this.Task_Table__table.deleteRow(lastrow_index);

            this.update_to_localstoarge2();
        }
        let today_chartObj = this.update_TodayhistoryUI(this.timer_storage);
        this.update_chart(today_chartObj);
    }


    calc_column_sum(column_idx) {
        let row_number = this.Task_Table__table.rows.length;

        let sum_result = 0;
        let table_text;
        for (let row_idx = 0; row_idx < row_number; row_idx++) {
            if (row_idx >= 1 && row_idx < row_number - 1) {
                table_text = this.Task_Table__table.rows[row_idx].cells[column_idx].innerText;

                if (typeof (table_text) == "string") {
                    sum_result += parseInt(table_text);
                }
            }
        }
        return sum_result;
    }

    calc_eachPara_sum() {
        /*
        Parameter     | Index
        ----------------------
        Expected time | 1
        Performance   | 2
        Remaining     | 3
        Date          | 4
        */
        this.expectedSum = this.calc_column_sum(1);
        this.performanceSum = this.calc_column_sum(2);
        this.remainingSum = this.calc_column_sum(3);

    }

    calc_performance_and_remaining_time() {
        /*
            calculation (performance_amount,performed_expectedTime)
        */
        let performance_idx = 2;
        let expected_idx = 1;
        let perform_time;
        let expected_time;

        this.performance_amount = 0;
        this.performed_expectedTime = 0;
        this.remaining_amount = 0;
        for (let i = 0; i < this.Task_Table__table.rows.length; i++) {
            if (i >= 1 && i < this.Task_Table__table.rows.length - 1) {

                perform_time = this.Task_Table__table.rows[i].cells[performance_idx].innerText;
                console.log(" perform_time", perform_time, typeof (perform_time));
                if (typeof (perform_time) == "string") {

                    this.performance_amount += parseInt(perform_time);

                    if (parseInt(perform_time) != 0) {
                        console.log("무야호!");
                        expected_time = this.Task_Table__table.rows[i].cells[expected_idx].innerText;
                        if (typeof (expected_time) == "string") {
                            this.performed_expectedTime += parseInt(expected_time);
                        }
                    } else {
                        expected_time = this.Task_Table__table.rows[i].cells[expected_idx].innerText;
                        if (typeof (expected_time) == "string") {
                            this.remaining_amount += parseInt(expected_time);
                        }
                    }


                }
            }
        }

    }
    update_calculated_Parameter() {
        console.log("update_calculated_Parameter");

        this.update_table_statistics();
    }

    calc_ramaining_day() {
        let today = new Date();
        // due_day form 2021. 7. 26
        let due_ary = this.due_date.split(".");

        let due__year = due_ary[0];
        let due__month = due_ary[1];
        let due__day = due_ary[2];

        let dueday = new Date(due__year, due__month, due__day);
        let gap = dueday.getTime() - today.getTime();
        this.remain_day = Math.ceil(gap / (1000 * 60 * 60 * 24));


    }

    // Deal with Timer Local Stoarge
    get_timer_fromLocalStorage(task_name) { // task_name : detail task name
        //local storage에 있는 timer정보 return
        let timer_obj = new Object();
        timer_obj = {
            timer_total_time: 0,
            today_history: {}
        }


        let timer_storage = JSON.parse(localStorage.getItem(this.timer_storage));
        if (timer_storage !== null) {

            if (typeof (timer_storage[task_name]) !== "undefined") {
                timer_obj.timer_total_time = timer_storage[task_name].timer_total_time;
                timer_obj.today_history = timer_storage[task_name].today_history;
            }
        } else {
            let initial_timer_storage = new Object();
            localStorage.setItem(this.storage_address, JSON.stringify(timer_storage));

        }
        return timer_obj;
    }


    update_to_localstoarge2 = () => {
        /*
        localstorage에 있는 값을 초기화하고, 현재 table값으로 업데이트
        */

        // STEP1 : Table 정보 Update하기
        this.task_detail_lists = []; // this.task_detail_lists 초기화
        for (let row_idx = 0; row_idx < this.Task_Table__table.rows.length - 1; row_idx++) {
            if (row_idx >= 1) {

                let task_obj = new Object();

                let row = this.Task_Table__table.rows[row_idx];


                if (row_idx == this.Task_Table__table.rows.length - 1) {
                    task_obj.row_id = "Summary";
                } else {
                    task_obj.row_id = row_idx;
                }
                let task_name = row.cells[0].innerHTML;
                task_obj.task = task_name;
                task_obj.expected_time = row.cells[1].innerHTML;
                task_obj.performance = row.cells[2].innerHTML;
                task_obj.remaining = row.cells[3].innerHTML;
                task_obj.date = row.cells[4].innerHTML;

                // Timer parameter
                console.log("task_nametask_nametask_name", task_name);
                task_obj.timer_info = this.get_timer_fromLocalStorage(task_name); // Timer Info return



                this.task_detail_lists.push(task_obj);
            }
        }

        // STEP2 : Calculated parameter update
        this.update_calculated_Parameter();

        //STEP3 : object Update
        this.Home_TaskLists[this.selected_taskIndex].registered_date = this.registered_date;
        //this.Home_TaskLists[this.selected_taskIndex].is_activate = this.is_activate;

        // Home Dashboard Info
        this.Home_TaskLists[this.selected_taskIndex].dash_boardInfo.task_name = this.task_name;
        this.Home_TaskLists[this.selected_taskIndex].dash_boardInfo.due_date = this.due_date;
        console.log("this.due_date;", this.due_date);
        this.calc_ramaining_day();
        this.Home_TaskLists[this.selected_taskIndex].dash_boardInfo.remain_day = this.remain_day;
        this.Home_TaskLists[this.selected_taskIndex].dash_boardInfo.progress = this.performance_ratio.toFixed(2); // diff date update
        this.Home_TaskLists[this.selected_taskIndex].dash_boardInfo.remain_total = this.remainingSum; // diff date update
        this.Home_TaskLists[this.selected_taskIndex].dash_boardInfo.remain_perday = this.remain_perday;

        //tableInfo
        this.Home_TaskLists[this.selected_taskIndex].tableInfo.task_detail_lists = this.task_detail_lists;
        this.Home_TaskLists[this.selected_taskIndex].tableInfo.expectedSum = this.expectedSum;
        this.Home_TaskLists[this.selected_taskIndex].tableInfo.performanceSum = this.performanceSum;
        this.Home_TaskLists[this.selected_taskIndex].tableInfo.remainingSum = this.remainingSum;
        this.Home_TaskLists[this.selected_taskIndex].tableInfo.performed_expectedTime = this.performed_expectedTime;
        this.Home_TaskLists[this.selected_taskIndex].tableInfo.performance_amount = this.performance_amount;
        this.Home_TaskLists[this.selected_taskIndex].tableInfo.remaining_amount = this.remaining_amount;


        //STEP3 : Load to Local Storage

        localStorage.setItem(this.home_taskInfo, JSON.stringify(this.Home_TaskLists)); // local storage 초기화
    }

    initial_setting() {
        this.update_taskOption_ini();
        this.selected_taskObj = this.select_task(this.task_selector_DOM.value, this.home_taskInfo);
        this.copy_selected_info(this.selected_taskObj);
        console.log("initial setting", this.selected_taskObj);
        this.load_localstoarge_table();
        this.update_timerStorage();
    }
    update_TodayhistoryUI(timer_storage) {
        /* 
        1. Localstorage에 저장되어 있는 timer list를 읽어서 저장된 timer 정보 확인
        2. 오늘 수행된 시간 계산
        */

        let today = new Date();
        let today__month = today.getMonth() + 1;//Get the month as a number (0-11)
        let today__date = today.getDate();//Get the day as a number (1-31)

        let dateAry;
        let task__month;
        let task__date;

        let timerobj;
        let timerobj__history;
        let timerobj__name;

        let today_chartObj = {}; // today performance 모음
        /*
        today_chartObj={
            task1:Integer,
            task2:Integer,


        }
        */
        let timer_lists = JSON.parse(localStorage.getItem(timer_storage));

        let start_date;
        let recorded_time;


        for (let i = 0; i < timer_lists.length; i++) { // loop for timer object
            timerobj = timer_lists[i];

            timerobj__history = timerobj.today_history;
            timerobj__name = timerobj.task_name;

            for (let [key, value] of Object.entries(timerobj__history)) { // loop for history
                //key : try N 
                // value : {start_date: String, recorded_time: Integer,}
                start_date = value.start_date;
                recorded_time = value.recorded_time;

                dateAry = start_date.split('.');
                task__month = parseInt(dateAry[1]);
                task__date = parseInt(dateAry[2]);

                //console.log( object_2.hasOwnProperty('test_1') ) // true
                if (today__month === task__month && today__date === task__date) {
                    if (today_chartObj.hasOwnProperty(timerobj__name) == true) {
                        today_chartObj[timerobj__name] += recorded_time;
                    } else {
                        today_chartObj[timerobj__name] = recorded_time;
                    }

                }
            }
        }
        return today_chartObj;
    }
    update_chart(today_chartObj) {
        /*
        today_chartObj={
            task1:Integer,
            task2:Integer,
        }*/
        let task_labels = [];
        let task_data = [];
        let background = [];
        let bg_cnt = 0;

        for (let [key, value] of Object.entries(today_chartObj)) {

            task_labels.push(key); // key : task name
            task_data.push(value); // value : task time
            background.push(this.CHART_BACKGROUND_LIST[bg_cnt % this.CHART_BACKGROUND_LIST.length]);

            bg_cnt += 1;
        }

        this.work_chart["data"]["labels"] = task_labels;
        this.work_chart["data"]["datasets"][0]["data"] = task_data;

        this.work_chart["data"]["datasets"][0]["backgroundColor"] = background;

        /*
        for (let i = 0; i < work_list_number; i++) {
    
            work_chart["data"]["labels"].push(work_lists[i]["text"]);
            work_chart["data"]["datasets"][0]["data"].push(parseInt(work_lists[i]["timer_stored__time"]));
            work_chart["data"]["datasets"][0]["backgroundColor"].push(CHART_BAR_COLOR[i % bar_color_num]);
    
        }*/
        this.work_chart.update();

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
        this.task_name = timer_info.task_name;
        this.task_index = timer_info.task_index;
        this.detail_subtask_name = timer_info.detail_subtask_name;
        this.storage_address = timer_info.timer_storage; // timer local storage address
        this.task_address = timer_info.task_storage;//"HOME_TASK_INFO"

        this.stored_timerData;
        //************************************************************** */

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
    check_resettiming() {
        // reset할 타이밍인지 조사
    }
    display_recorded_time() {
        if (this.is_running == true) {
            this.Timer_display_DOM.innerHTML = Math.floor((Date.now() - this.start_time) / 1000);
        } else {
            this.Timer_display_DOM.innerHTML = 0;
        }
    }
    is_taskSaved(timerStorage_list, task_name) {
        let task_nameList = timerStorage_list.map(task => task.task_name);
        let find_idx = task_nameList.indexOf(task_name);
        let is_find;
        let task_location;

        if (find_idx == -1) {
            is_find = false;
            task_location = 9999;
        } else {
            is_find = true;
            task_location = find_idx;
        }

        return [is_find, task_location];
    }
    find_taskName(timerStorage_list, task_name) {

        let task_nameList = timerStorage_list.map(task => task.task_name);
        if (this.is_taskSaved(timerStorage_list, task_name) == true) {

        } else {
            throw new Error('찾고자 하는 원소가 없음');
        }
    }
    update_timer_toLocal(task_name) {
        console.log("this.detail_subtask_name", task_name);
        // 지금까지 누적된 Timer 시간을 local storage에 업데이트
        // end btn후에 동작

        let timer_storage = JSON.parse(localStorage.getItem(this.storage_address));

        if (timer_storage == null) {
            localStorage.setItem(this.storage_address, JSON.stringify([]));
        }

        let scan_result = this.is_taskSaved(timer_storage, task_name);
        let is_find = scan_result[0];
        let task_location = scan_result[1];
        let new_try;
        if (is_find == true) {
            //[1] timer_total_time Setting
            timer_storage[task_location].timer_total_time = this.cumulative_saved_time;

            //[2] history Setting
            new_try = "try" + String(Object.keys(timer_storage[task_location].today_history).length + 1);
            timer_storage[task_location].today_history[new_try] = {
                start_date: this.start_date,
                recorded_time: this.current_saved_time,
            }
        } else {
            let task_obj = new Object();
            //[1] timer_total_time Setting


            //[2] history Setting
            task_obj = {
                timer_total_time: this.cumulative_saved_time,
                today_history: {
                    try1: {
                        start_date: this.start_date,
                        recorded_time: this.current_saved_time,
                    }
                }
            }
            timer_storage.push(task_obj);
        }
        /////////////////////////////////////////////////////////////////////

        // timer obejct update to localstorage
        localStorage.setItem(this.storage_address, JSON.stringify(timer_storage));
    }

    get_timerInfo(task_name, timer_storage) {
        let TimerList = JSON.parse(localStorage.getItem(timer_storage));

        let timertask_nameList = TimerList.map(x => x.task_name);
        let task_loc = timertask_nameList.indexOf(task_name);

        if (task_loc == -1) {
            throw new Error("No task"); // migrage 하랴는 task가 존재하지 않음
        } else {
            return TimerList[task_loc]
        }
    }
    migrate_timer_To_task(task_name, task_storage, timer_storage) {
        let HomeTaskList = JSON.parse(localStorage.getItem(task_storage));

        let hometask_nameList = HomeTaskList.map(x => x.dash_boardInfo.task_name);
        let task_loc = hometask_nameList.indexOf(task_name);

        let detail_taskName;
        let detailTaskNum;

        let timerObj;

        if (task_loc == -1) {
            throw new Error("No task"); // migrage 하랴는 task가 존재하지 않음
        } else {
            detailTaskNum = HomeTaskList[task_loc].tableInfo.task_detail_lists.length;
            for (let i = 0; i < detailTaskNum; i++) {
                detail_taskName = HomeTaskList[task_loc].tableInfo.task_detail_lists[i].task;
                timerObj = this.get_timerInfo(detail_taskName, timer_storage);

                HomeTaskList[task_loc].tableInfo.task_detail_lists[i].timer_info.timer_total_time = timerObj.timer_total_time;
                HomeTaskList[task_loc].tableInfo.task_detail_lists[i].timer_info.today_history = timerObj.today_history;
            }
        }

        localStorage.setItem(task_storage, JSON.stringify(HomeTaskList));

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
        console.log(" this.current_saved_time", this.current_saved_time);
        this.update_btn_UI();
        this.update_timer_toLocal(this.detail_subtask_name);

        this.migrate_timer_To_task(this.task_name, this.task_address, this.storage_address);
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
    load_from_LocalStorage() {

    }
    initial_setting() {

    }
}






function init() {
    let taskHome = new Task_home();
    let tasktable = new Task_Table_UI(TASK);

    tasktable.initial_setting();
    console.log("tasktable.local_storage_name", tasktable.Home_TaskLists);
    TEST_BTN.addEventListener("click", function () { tasktable.test() }); // for test

}

init();


/* [THEORY]
yes it's possible. You need to invoke the method and retain the context, close over the object variable with a function:

var object = new ClassName();
document.getElementById('x').addEventListener('click', function (e) {
object.method(e)
}, false);
If you invoke without inside function, the 'this' would be set to the DOM element which initiated the event.
*/
