
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
        this.storage_address = timer_info.storage_address; // Home task list

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

        // timer tool function
        this.timerTool = {
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
            find_detailObj_byName: function (detail_name, current_detail_list) {
                let result = {
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
        }
    }

    display_recorded_time() {
        if (this.is_running == true) {
            this.Timer_display_DOM.innerHTML = Math.floor((Date.now() - this.start_time) / 1000);
        } else {
            this.Timer_display_DOM.innerHTML = 0;
        }
    }

    update_timerInfo() {
        let home_tasklist = JSON.parse(localStorage.getItem(this.storage_address));
        let task_info = this.timerTool.find_task_inHome(this.task_name, this.storage_address);
        if (task_info.is_find === true) {
            let task_obj = home_tasklist[task_info.task_loc];
            let current_detail_list = task_obj.tableInfo.task_detail_lists;

            let detail_ObjInfo = this.timerTool.find_detailObj_byName(this.detail_subtask_name, current_detail_list);
            if (detail_ObjInfo.is_find === true) {
                // 현재 저장되어 있는 Timer 정보
                let Cur_Timerinfo = current_detail_list[detail_ObjInfo.obj_loc].timer_info;
                let Cur_timerTotal_time = Cur_Timerinfo.timer_total_time;
                let Cur_todayHistory = Cur_Timerinfo.today_history;

                //  today_history 비어있는지 확인
                if (Object.keys(Cur_todayHistory).length === 0) {
                    Cur_Timerinfo.timer_total_time = this.current_saved_time
                    Cur_Timerinfo.today_history["try1"] = {
                        start_date: this.start_date,
                        recorded_time: this.current_saved_time,
                    }

                } else {
                    Cur_Timerinfo.timer_total_time += this.current_saved_time
                    let tryNum = "try" + String(Object.keys(Cur_todayHistory).length + 1);

                    Cur_Timerinfo.today_history[tryNum] = {
                        start_date: this.start_date,
                        recorded_time: this.current_saved_time,
                    }
                }
                //Upload updated timer info to local storage
                home_tasklist[task_info.task_loc].tableInfo.task_detail_lists[detail_ObjInfo.obj_loc].timer_info = Cur_Timerinfo;
                localStorage.setItem(this.storage_address, JSON.stringify(home_tasklist));
            } else {
                alert("TIMER ERROR1!");
            }

        } else {
            alert("TIMER ERROR2!");
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

        this.update_timerInfo();
        this.update_btn_UI();
        test_table.chart.update_chartUI();
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