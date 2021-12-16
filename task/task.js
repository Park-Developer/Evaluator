class Task {
    constructor(Task) {
        // CONST Setting
        this.HOME_TASKLIST_Storage = "HOME_TASK_INFO"; // local storage 변수명
        this.TEST_BTN = Task.querySelector(".Test");

        const CLASS_Obj = this;
        const TASK_TABLE_INDEX = {
            "Task": 0,
            "Expected Time": 1,
            "Performance": 2,
            "Remaining": 3,
            "Date": 4,
        };
        const MAX_DETAIL_TASK_NUM = 30;

        // DOM Setting
        // (1). TABLE DOM 
        this.Task_Table__table = Task.querySelector(".Task_Table__table");
        this.Task_Btn_Add = Task.querySelector(".Task_Btn__Add");
        this.Task_Btn_Remove = Task.querySelector(".Task_Btn_Remove");
        this.Task_Btn_Change = Task.querySelector(".Task_Btn_Change");
        this.Task_Btn_Confirm = Task.querySelector(".Task_Btn_Confirm");
        this.Task_Selector = Task.querySelector(".Task_Selector__selection");
        this.Task_UI_Title = Task.querySelector(".Task_Title");
        this.Task_Duedate = Task.querySelector(".Task_Title_duedate__value");
        this.Task_Home_Btn = document.querySelector(".home_Retry_Btn");


        this.Table_tasklist_Sum = Task.querySelector(".Task_Table__tasklist_Sum");
        this.Table__expectedtime_Sum_DOM = Task.querySelector(".Task_Table__expectedtime_Sum");
        this.Table__performance_Sum_DOM = Task.querySelector(".Task_Table__performance_Sum");
        this.Table__remaining_Sum_DOM = Task.querySelector(".Task_Table__remaining_Sum");

        // (2). SUMMARY DOM 
        this.Summary = document.querySelector(".Summary");
        this.Performance_ratio__value_DOM = this.Summary.querySelector(".performance_ratio__value");
        this.Remaining_ratio__value_DOM = this.Summary.querySelector(".remaining_ratio__value");
        this.Performance_amount__value_DOM = this.Summary.querySelector(".performance_amount__value");
        this.Remaining_amount__value_DOM = this.Summary.querySelector(".remaining_amount__value");

        // Button Event setting
        this.Task_Btn_Add.addEventListener("click", () => {
            let task_number = this.Task_Table__table.rows.length - 2;
            if (task_number < MAX_DETAIL_TASK_NUM) {
                this.table.add_lastrow();
            }

        });

        this.Task_Btn_Remove.addEventListener("click", () => {
            this.table.remove_lastrow();
        });

        this.Task_Btn_Change.addEventListener("click", () => {
            this.table.change_table();
        });

        this.Task_Btn_Confirm.addEventListener("click", () => {
            this.table.confirm_table();
        });
        // Selector Event
        this.Task_Selector.addEventListener("change", () => {
            this.table.change_selected_task();

        });

        this.Task_Home_Btn.addEventListener("click", () => {

            location.href = "../index.html";

        });




        this.home = {
            //Home Dashboard update lists
            get_all_tasklists: function () {
                let home_tasklist = JSON.parse(localStorage.getItem(home_Storage));

            },
            get_updated_remainDay: function (task_name) {
                let updated_remainDay;
            },
            get_updated_progress: function (task_name) {
                let updated_progress;
            },
            get_updated_remainTotal: function (task_name) {
                let updated_remainTotal;
            },
            get_updated_timerPerDay: function (task_name) {
                let updated_timerPerDay;
            },


        }

        this.task_tool = {  // local storage에 있는 데이러만 사용
            check_taskName: function () {
                // 동일한 task name이 있는지 확인
                let row_num = CLASS_Obj.Task_Table__table.rows.length;
                let taskname_idx = TASK_TABLE_INDEX["Task"];
                let name_list = [];
                let taskname;
                let result = false;

                for (let i = 0; i < row_num; i++) {
                    taskname = CLASS_Obj.Task_Table__table.rows[i].cells[taskname_idx].innerText.trim();
                    if (name_list.indexOf(taskname) !== -1) {
                        // 이미 리스트에 존재하는 경우
                        result = true;

                        // local storage에 저장된 값으로 원복
                        let curTask_info = CLASS_Obj.task_tool.get_CurrentTaskobj();
                        if (curTask_info.is_find === true) {
                            let curTask_obj = curTask_info.task_obj;
                            for (let row_idx = 0; row_idx < CLASS_Obj.Task_Table__table.rows.length - 1; row_idx++) {
                                if (row_idx >= 1) { // header 제외
                                    if (row_idx === curTask_obj.tableInfo.task_detail_lists[row_idx - 1].row_id) {
                                        CLASS_Obj.Task_Table__table.rows[row_idx].cells[taskname_idx].innerText = curTask_obj.tableInfo.task_detail_lists[row_idx - 1].task;
                                    } else {
                                        alert("Invalid row_id!");
                                        break;
                                    }
                                }
                            }
                        } else {
                            alert("update_tableInfo error!");
                        }

                        break;
                    } else {
                        name_list.push(taskname);
                    }

                }
                return result;
            },
            get_tableRowInfo: function (table_row) { // table row에서 각 항목별 정복 추출
                let result = {
                    task: table_row.cells[TASK_TABLE_INDEX["Task"]].innerText.trim(),
                    expected_time: table_row.cells[TASK_TABLE_INDEX["Expected Time"]].innerText.trim(),
                    performance: table_row.cells[TASK_TABLE_INDEX["Performance"]].innerText.trim(),
                    remaining: table_row.cells[TASK_TABLE_INDEX["Remaining"]].innerText.trim(),
                    date: table_row.cells[TASK_TABLE_INDEX["Date"]].innerText.trim(),
                };

                return result;
            },
            set_row_property: function (row, editable, text_align) {
                let cell_number = row.cells.length;
                for (let i = 0; i < cell_number; i++) {
                    row.cells[i].setAttribute("contenteditable", editable);
                    row.cells[i].style.textAlign = text_align;
                }
            },
            set_table_editable: function (editable) {
                let row_num = CLASS_Obj.Task_Table__table.rows.length;
                let cell_num = CLASS_Obj.Task_Table__table.rows[0].cells.length;

                // exception case : remaining은 수정 불가
                let remaining_idx = TASK_TABLE_INDEX["Remaining"];
                let perform_idx = TASK_TABLE_INDEX["Performance"];


                for (let i = 0; i < row_num; i++) {
                    for (let j = 0; j < cell_num; j++) {
                        if (j !== remaining_idx && j !== perform_idx) {
                            CLASS_Obj.Task_Table__table.rows[i].cells[j].setAttribute("contenteditable", editable);
                        }

                    }
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

            make_newDetail_obj: function (detailTask_name, row_id) {
                let newDatail_obj = {
                    task: detailTask_name,
                    expected_time: 0,
                    performance: 0,
                    remaining: 0,
                    row_id: row_id,
                    date: '',
                    timer_info: {
                        timer_total_time: 0,
                        today_history: {},
                    }
                }

                return newDatail_obj;
            },
            get_taskInfo: function (task_name) { //search in hometasklist

                if (task_name === undefined) {
                    task_name = CLASS_Obj.loader.load_TaskName();
                }


                let home_Storage = CLASS_Obj.HOME_TASKLIST_Storage;
                let taskinfo = CLASS_Obj.task_tool.find_task_inHome(task_name, home_Storage);

                return taskinfo;
            },
            get_detail_taskInfo: function (table_taskname, detail_task_lists) { // search in detail_task_lists
                // 이거쓰나?
                let detail_info = {
                    is_find: false,
                    detail_obj: {},
                    obj_loc: 0
                }
                for (let i = 0; i < detail_task_lists.length; i++) {
                    let de_obj = detail_task_lists[i];

                    if (de_obj.task === table_taskname) {
                        detail_info.is_find = true;
                        detail_info.obj_loc = i;
                        detail_info.detail_obj = de_obj;
                        break;
                    }
                }
                return detail_info;
            },
            get_CurrentTaskobj: function (task_name) {
                /*
                taskname이 입력되지 않으면 현재 taskname 대입
                */
                let home_tasklist = JSON.parse(localStorage.getItem(CLASS_Obj.HOME_TASKLIST_Storage));
                let taskinfo = this.get_taskInfo(task_name);
                let result;

                if (taskinfo.is_find === true) {
                    let task_obj = home_tasklist[taskinfo.task_loc];
                    result = {
                        is_find: true,
                        task_obj: task_obj,
                    }
                } else {
                    result = {
                        is_find: false,
                        task_obj: {},
                    }
                }
                return result
            },
            calc_eachPara_sum: function () {
                let curObjInfo = this.get_CurrentTaskobj();
                let totalTasknum;
                let expectedSum;
                let performanceSum;
                let remainingSum;


                if (curObjInfo.is_find === true) {
                    let cur_Obj = curObjInfo.task_obj;
                    let task_detail_lists = cur_Obj.tableInfo.task_detail_lists;
                    totalTasknum = task_detail_lists.length;
                    expectedSum = 0;
                    performanceSum = 0;
                    remainingSum = 0;

                    for (let i = 0; i < totalTasknum; i++) {
                        let detail_obj = task_detail_lists[i];
                        expectedSum += parseInt(detail_obj.expected_time);
                        performanceSum += parseInt(detail_obj.performance);
                        remainingSum += parseInt(detail_obj.remaining);
                    }
                } else {
                    alert("calc_eachPara_sum!!");
                }

                let result = {
                    totalTasknum: totalTasknum, // total task number
                    expectedSum: expectedSum,
                    performanceSum: performanceSum,
                    remainingSum: remainingSum,
                }
                return result;
            },
            calc_summaryInfo: function () {
                // local storage에 저장되어 있는 정보를 기준으로 계싼
                let curObjInfo = this.get_CurrentTaskobj();
                let excuted_taskNum;
                let cur_Obj;
                let task_detail_lists;

                if (curObjInfo.is_find === true) {
                    cur_Obj = curObjInfo.task_obj;
                    task_detail_lists = cur_Obj.tableInfo.task_detail_lists;
                    excuted_taskNum = 0
                    for (let i = 0; i < task_detail_lists.length; i++) {
                        let detail_obj = task_detail_lists[i];
                        if (parseInt(detail_obj.performance) !== 0) {
                            excuted_taskNum += 1;
                        }
                    }
                    let total_taskNum = task_detail_lists.length;
                    let performance_Ratio = String((100 * excuted_taskNum / total_taskNum).toFixed(2)) + "%";
                    let performance_Amount = cur_Obj.tableInfo.performanceSum;
                    let remaining_Ratio = String((100 * (1 - excuted_taskNum / total_taskNum)).toFixed(2)) + "%";
                    let remaining_Amount = cur_Obj.tableInfo.remainingSum;

                    let summary_info = {
                        Ratio: {
                            performance: performance_Ratio,
                            remaining: remaining_Ratio,
                        },
                        Amount: {
                            performance: performance_Amount,
                            remaining: remaining_Amount,
                        },
                    }

                    return summary_info;

                } else {
                    alert("calc_summaryInfo Error!");
                }
            }
        }
        this.updater = {
            update_Taskobj: function (updated_task_obj) {
                let taskinfo = CLASS_Obj.task_tool.get_taskInfo();
                if (taskinfo.is_find === true) {
                    let home_tasklist = JSON.parse(localStorage.getItem(CLASS_Obj.HOME_TASKLIST_Storage));
                    home_tasklist[taskinfo.task_loc] = updated_task_obj;
                    localStorage.setItem(CLASS_Obj.HOME_TASKLIST_Storage, JSON.stringify(home_tasklist));
                } else {
                    alert("update_Taskobj");
                }
            },

            update_Table_Sum: function () {
                this.update_tableInfo(); // table 데이터 local에 update
                let curSum_info = CLASS_Obj.task_tool.calc_eachPara_sum();
                let curTask_info = CLASS_Obj.task_tool.get_CurrentTaskobj();
                if (curTask_info.is_find === true) {
                    let curTask_obj = curTask_info.task_obj;

                    curTask_obj.tableInfo.total_taskNum = curSum_info.totalTasknum;
                    curTask_obj.tableInfo.expectedSum = curSum_info.expectedSum;
                    curTask_obj.tableInfo.performanceSum = curSum_info.performanceSum;
                    curTask_obj.tableInfo.remainingSum = curSum_info.remainingSum;
                    this.update_Taskobj(curTask_obj);

                } else {
                    alert("update_Table_Sum Error!");
                }
            },

            update_Summary: function () {
                // old Ver
                /*
                let curTask_info = CLASS_Obj.task_tool.get_CurrentTaskobj();
                if (curTask_info.is_find === true) {
                    let curTask_obj = curTask_info.task_obj;
                    curTask_obj.tableInfo.performance_ratio = curSummary_info.Ratio.performance;
                    curTask_obj.tableInfo.remaining_ratio = curSummary_info.Ratio.remaining;
                    curTask_obj.tableInfo.performance_amount = curSummary_info.Amount.performance;
                    curTask_obj.tableInfo.remaining_amount = curSummary_info.Amount.remaining;

                    this.update_Taskobj(curTask_obj);

                } else {
                    alert("update_Table_Summary Error!");
                }
                */
                // New Ver
                // local storage에 저장되어 있는 정보를 기준으로 계싼
                this.update_Table_Sum();

                let curObjInfo = CLASS_Obj.task_tool.get_CurrentTaskobj();
                let excuted_taskNum;
                let cur_Obj;
                let task_detail_lists;

                if (curObjInfo.is_find === true) {
                    cur_Obj = curObjInfo.task_obj;
                    task_detail_lists = cur_Obj.tableInfo.task_detail_lists;
                    excuted_taskNum = 0
                    for (let i = 0; i < task_detail_lists.length; i++) {
                        let detail_obj = task_detail_lists[i];
                        if (parseInt(detail_obj.performance) !== 0) {
                            excuted_taskNum += 1;
                        }
                    }
                    let total_taskNum = task_detail_lists.length;
                    let performance_Ratio = String((100 * excuted_taskNum / total_taskNum).toFixed(2)) + "%";
                    let performance_Amount = cur_Obj.tableInfo.performanceSum;
                    let remaining_Ratio = String((100 * (1 - excuted_taskNum / total_taskNum)).toFixed(2)) + "%";
                    let remaining_Amount = cur_Obj.tableInfo.remainingSum;


                    cur_Obj.tableInfo.performance_ratio = performance_Ratio;
                    cur_Obj.tableInfo.remaining_ratio = remaining_Ratio;
                    cur_Obj.tableInfo.performance_amount = performance_Amount;
                    cur_Obj.tableInfo.remaining_amount = remaining_Amount;
                    this.update_Taskobj(cur_Obj);
                    /*
                    let summary_info = {
                        Ratio: {
                            performance: performance_Ratio,
                            remaining: remaining_Ratio,
                        },
                        Amount: {
                            performance: performance_Amount,
                            remaining: remaining_Amount,
                        },
                    }

                    return summary_info;
                    */
                } else {
                    alert("calc_summaryInfo Error!");
                }
            },

            update_tableInfo: function () {
                // table의 각 행정보를 lcoal storag에 update
                let curTask_info = CLASS_Obj.task_tool.get_CurrentTaskobj();
                //CLASS_Obj.table.change_Table_remainingUI(); // remainingui update # 필여없을듯?
                let isName_overlap = false;

                if (curTask_info.is_find === true) {
                    let curTask_obj = curTask_info.task_obj;
                    // [1] Table값 update
                    for (let row_idx = 0; row_idx < CLASS_Obj.Task_Table__table.rows.length - 1; row_idx++) {
                        if (row_idx >= 1) { // header 제외
                            let table_row__info = CLASS_Obj.task_tool.get_tableRowInfo(CLASS_Obj.Task_Table__table.rows[row_idx]);
                            if (row_idx === curTask_obj.tableInfo.task_detail_lists[row_idx - 1].row_id) {
                                curTask_obj.tableInfo.task_detail_lists[row_idx - 1].task = table_row__info.task;
                                curTask_obj.tableInfo.task_detail_lists[row_idx - 1].expected_time = table_row__info.expected_time;
                                //curTask_obj.tableInfo.task_detail_lists[row_idx - 1].performance = table_row__info.performance;
                                curTask_obj.tableInfo.task_detail_lists[row_idx - 1].remaining = String(parseInt(table_row__info.expected_time) - parseInt(table_row__info.performance));
                                curTask_obj.tableInfo.task_detail_lists[row_idx - 1].date = table_row__info.date;
                            } else {
                                alert("Invalid row_id!");
                                break;
                            }

                        }
                    }

                    // [2] 중복 이름 검사
                    isName_overlap = CLASS_Obj.task_tool.check_taskName();

                    // [3] 이름 중복이 없는 경우, 현재 task Obj를 local storage에 업로드
                    if (isName_overlap === false) {
                        this.update_Taskobj(curTask_obj);
                    } else {
                        alert("overlaped name error!");
                    }

                } else {
                    alert("update_tableInfo error!");
                }

            },
            update_dashboardInfo: function () {
                function calc_remainDay(due_date) {
                    let termArr = due_date.split(".");
                    let due__year = parseInt(termArr[0]);
                    let due__month = parseInt(termArr[1]);
                    let due__date = parseInt(termArr[2]);
                    if (due__year && due__month && due__date) {
                        let today = new Date();
                        let today__year = today.getFullYear();
                        let today__month = today.getMonth() + 1;
                        let today__date = today.getDate();

                        let todayDate = new Date(today__year, today__month, today__date);
                        let dueDate = new Date(due__year, due__month, due__date);

                        let distance = dueDate.getTime() - todayDate.getTime();

                        let remain_day = Math.floor(distance / (1000 * 60 * 60 * 24));

                        return remain_day;
                    } {
                        alert("clar remain day Error!");
                        return 0;
                    }

                }

                let task_objInfo = CLASS_Obj.task_tool.get_CurrentTaskobj();
                if (task_objInfo.is_find === true) {
                    let cur_Obj = task_objInfo.task_obj;

                    cur_Obj.dash_boardInfo.progress = cur_Obj.tableInfo.performance_ratio;
                    cur_Obj.dash_boardInfo.remain_total = cur_Obj.tableInfo.remainingSum;

                    if (cur_Obj.dash_boardInfo.due_date !== undefined && cur_Obj.dash_boardInfo.due_date !== "") {
                        cur_Obj.dash_boardInfo.remain_day = calc_remainDay(cur_Obj.dash_boardInfo.due_date);
                        cur_Obj.dash_boardInfo.remain_perday = Math.floor(cur_Obj.tableInfo.remainingSum / calc_remainDay(cur_Obj.dash_boardInfo.due_date));
                    }

                    this.update_Taskobj(cur_Obj);
                } else {
                    alert("   update_dashboardInfo Error!");
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
                    CLASS_Obj.Task_Selector.add(option);
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
                CLASS_Obj.table.reset_current_table(); // table 초기화

                let task_name = this.load_TaskName();
                let home_Storage = CLASS_Obj.HOME_TASKLIST_Storage;
                let home_tasklist = JSON.parse(localStorage.getItem(home_Storage));
                let taskinfo = CLASS_Obj.task_tool.find_task_inHome(task_name, home_Storage);
                let task_obj;

                if (taskinfo.is_find === true) {
                    task_obj = home_tasklist[taskinfo.task_loc];
                    // Task Due date Change
                    CLASS_Obj.Task_Duedate.innerText = task_obj.dash_boardInfo.due_date;

                    let task_detail_lists = task_obj.tableInfo.task_detail_lists;

                    function load_table_Row(task_name, task_detail_lists) {
                        for (let strg_idx = 0; strg_idx < task_detail_lists.length; strg_idx++) {
                            let row_info = {
                                task_name: task_name,
                                detail_subtask_name: task_detail_lists[strg_idx].task,
                                expected_time: task_detail_lists[strg_idx].expected_time,
                                performance: task_detail_lists[strg_idx].performance,
                                remaining: task_detail_lists[strg_idx].remaining,
                                date: task_detail_lists[strg_idx].date,
                            };
                            CLASS_Obj.table.make_tableRow(row_info); // table row 생성
                        }
                    }

                    load_table_Row(task_name, task_detail_lists); // table의 각 행 load
                    CLASS_Obj.table.change_Table_Sum_UI();
                    CLASS_Obj.summary.change_Table_Summary_UI();
                    CLASS_Obj.chart.change_chartUI();
                } else {
                    alert("No Task Error!");
                }
            }

        }
        this.summary = {
            change_Table_Summary_UI: function () { // init func
                // local storage에 저장된 데이터를 HTML에 반영
                let curSummary_info = CLASS_Obj.task_tool.calc_summaryInfo();
                CLASS_Obj.Performance_ratio__value_DOM.innerText = curSummary_info.Ratio.performance;
                CLASS_Obj.Remaining_ratio__value_DOM.innerText = curSummary_info.Ratio.remaining;
                CLASS_Obj.Performance_amount__value_DOM.innerText = curSummary_info.Amount.performance;
                CLASS_Obj.Remaining_amount__value_DOM.innerText = curSummary_info.Amount.remaining;

            },
        }

        this.table = {
            this_class: CLASS_Obj,
            task_name: '',
            detail_object: {}, // 각각의 Detail Object들의 list
            storage_address: CLASS_Obj.HOME_TASKLIST_Storage,
            sample: "saampE!", // for test

            change_Table_remainingUI() {
                let remainIdx = TASK_TABLE_INDEX["Remaining"];
                let curTask_info = CLASS_Obj.task_tool.get_CurrentTaskobj();
                if (curTask_info.is_find === true) {
                    for (let row_idx = 0; row_idx < CLASS_Obj.Task_Table__table.rows.length - 1; row_idx++) {
                        if (row_idx >= 1) { // header 제외
                            //let detail_taskName=CLASS_Obj.Task_Table__table.rows[row_idx].cells[0].innerText;
                            let expectedTime = curTask_info.task_obj.tableInfo.task_detail_lists[row_idx - 1].expected_time;
                            let performaceTime = curTask_info.task_obj.tableInfo.task_detail_lists[row_idx - 1].performance;

                            CLASS_Obj.Task_Table__table.rows[row_idx].cells[remainIdx].innerText = String(expectedTime - performaceTime);

                        }
                    }
                } else {
                    alert("update_Table_Summary Error!");
                }
                this.change_Table_Sum_UI();
            },

            change_Table_Sum_UI: function () { // init func // **
                // local storage에 저장된 데이터를 HTML에 반영
                let curSum_info = CLASS_Obj.task_tool.calc_eachPara_sum();

                CLASS_Obj.Table_tasklist_Sum.innerText = curSum_info.totalTasknum;
                CLASS_Obj.Table__expectedtime_Sum_DOM.innerHTML = curSum_info.expectedSum;
                CLASS_Obj.Table__performance_Sum_DOM.innerHTML = curSum_info.performanceSum;
                CLASS_Obj.Table__remaining_Sum_DOM.innerHTML = curSum_info.remainingSum;

            },
            change_Table_performanceUI: function () {
                // timer end 버튼을 누르면 실행
                let curTask_info = CLASS_Obj.task_tool.get_CurrentTaskobj();
                if (curTask_info.is_find === true) {
                    for (let row_idx = 0; row_idx < CLASS_Obj.Task_Table__table.rows.length - 1; row_idx++) {
                        if (row_idx >= 1) { // header 제외
                            //let detail_taskName=CLASS_Obj.Task_Table__table.rows[row_idx].cells[0].innerText;
                            CLASS_Obj.Task_Table__table.rows[row_idx].cells[2].innerText = curTask_info.task_obj.tableInfo.task_detail_lists[row_idx - 1].performance;

                        }
                    }
                } else {
                    alert("update_Table_Summary Error!");
                }
                this.change_Table_Sum_UI();
                //this.update_Table_Sum();
            },


            change_tableUI: function () {
                this.change_Table_Sum_UI();
                this.change_Table_remainingUI();
                this.change_Table_performanceUI();
            },
            make_tableRow: function (row_info) {
                let task_name = row_info.task_name;
                let detail_subtask_name = row_info.detail_subtask_name;
                let expected_time = row_info.expected_time;
                let performance = row_info.performance;
                let remaining = row_info.remaining;
                let date = row_info.date;

                let row_index = CLASS_Obj.Task_Table__table.rows.length - 1;
                const newRow = CLASS_Obj.Task_Table__table.insertRow(row_index);
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
                    storage_address: CLASS_Obj.HOME_TASKLIST_Storage,
                }

                // Button Setting 

                let timer = new Timer(timer_info); // task_id = row_id

                // DOM Setting
                newCell5.style.display = "flex";
                newCell5.appendChild(timer.Timer_Start_button_DOM);
                newCell5.appendChild(timer.Timer_End_button_DOM);
                newCell5.appendChild(timer.Timer_display_DOM);
                // table 수정 가능 속성

                CLASS_Obj.task_tool.set_row_property(newRow, false, "left");

            },
            reset_current_table: function () {
                let row_number = CLASS_Obj.Task_Table__table.rows.length;

                for (let row_idx = 0; row_idx < row_number - 2; row_idx++) {
                    CLASS_Obj.Task_Table__table.deleteRow(CLASS_Obj.Task_Table__table.rows.length - 2);
                }

            },
            change_table: function () {
                // [1]_ 버튼 상태 변경
                CLASS_Obj.Task_Btn_Change.style.display = "none";
                CLASS_Obj.Task_Btn_Confirm.style.display = "block";
                CLASS_Obj.Task_Btn_Add.disabled = true;
                CLASS_Obj.Task_Btn_Remove.disabled = true;

                // [2]_ Table 수정 허용
                CLASS_Obj.task_tool.set_table_editable(true);
            },
            confirm_table: function () {
                // [1]_ 버튼 상태 변경
                CLASS_Obj.Task_Btn_Change.style.display = "block";
                CLASS_Obj.Task_Btn_Confirm.style.display = "none";
                CLASS_Obj.Task_Btn_Add.disabled = false;
                CLASS_Obj.Task_Btn_Remove.disabled = false;

                // [2]_ Table 수정 금지
                CLASS_Obj.task_tool.set_table_editable(false);

                //[3] Update
                // [1] 변경된 UI를 Local Storage에 반영
                CLASS_Obj.updater.update_tableInfo();
                CLASS_Obj.updater.update_Table_Sum();
                CLASS_Obj.updater.update_Summary();

                // [2] TASK_TABLE UI 변경
                CLASS_Obj.chart.change_chartUI();
                this.change_tableUI();
                CLASS_Obj.summary.change_Table_Summary_UI();
            },
            add_lastrow: function () {
                let task_clsObj = this.this_class;

                // TABLE UI 
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

                let newDatail_obj = CLASS_Obj.task_tool.make_newDetail_obj(row_info.detail_subtask_name, row_info.row_index);
                let home_tasklist = JSON.parse(localStorage.getItem(CLASS_Obj.HOME_TASKLIST_Storage));

                this.make_tableRow(row_info); // row info 개선하기

                // Storage 
                let curTask_info = CLASS_Obj.task_tool.get_taskInfo();
                if (curTask_info.is_find === true) {
                    let curTask_obj = home_tasklist[curTask_info.task_loc];
                    curTask_obj.tableInfo.task_detail_lists.push(newDatail_obj);

                    CLASS_Obj.updater.update_Taskobj(curTask_obj);
                } else {
                    alert("add_lastrow error!");
                }
                //old ver
                // chart_update
                //CLASS_Obj.chart.change_chartUI();

                //update table ui
                //CLASS_Obj.table.change_Table_Sum_UI();
                // [1] 변경된 UI를 Local Storage에 반영
                CLASS_Obj.updater.update_tableInfo();
                CLASS_Obj.updater.update_Table_Sum();
                CLASS_Obj.updater.update_Summary();

                // [2] TASK_TABLE UI 변경
                CLASS_Obj.chart.change_chartUI();
                this.change_tableUI();
                CLASS_Obj.summary.change_Table_Summary_UI();

            },

            remove_lastrow: function () {
                let task_clsObj = this.this_class;
                let home_tasklist = JSON.parse(localStorage.getItem(CLASS_Obj.HOME_TASKLIST_Storage));
                let lastrow_index = task_clsObj.Task_Table__table.rows.length - 2;

                // Table UI
                if (lastrow_index > 0) {
                    task_clsObj.Task_Table__table.deleteRow(lastrow_index);
                }

                // Storage
                let curTask_info = CLASS_Obj.task_tool.get_taskInfo();
                if (curTask_info.is_find === true) {
                    let curTask_obj = home_tasklist[curTask_info.task_loc];
                    curTask_obj.tableInfo.task_detail_lists.pop();

                    CLASS_Obj.updater.update_Taskobj(curTask_obj);
                } else {
                    alert("add_lastrow error!");
                }
                // [1] 변경된 UI를 Local Storage에 반영
                CLASS_Obj.updater.update_tableInfo();
                CLASS_Obj.updater.update_Table_Sum();
                CLASS_Obj.updater.update_Summary();

                // [2] TASK_TABLE UI 변경
                CLASS_Obj.chart.change_chartUI();
                this.change_tableUI();
                CLASS_Obj.summary.change_Table_Summary_UI();

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
            change_chartUI: function () {
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
    }


    ini_setting() { // class method : initialization 
        this.loader.load_taskOption(this.HOME_TASKLIST_Storage); // task option list 생성
        this.loader.load_table(); // task table 생성
    }
}



function init() {
    //초기 실행 
    const TASK = document.querySelector(".Task");
    TASK_TABLE = new Task(TASK);


    TASK_TABLE.ini_setting();
}

init();