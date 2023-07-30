//  this fn create pagination
function setPagination() {
  $(".my-todo-list").paginathing({
    perPage: 2,
    containerClass: "panel-footer",
    firstLast: false,
  });
}

$(() => {
  let arrData;

  // if the data array is not in the localStorage, it will be created (the first visit to the site).
  if (localStorage.getItem('arrData')) {
    arrData = JSON.parse(localStorage.getItem('arrData'));

    for (const task of arrData) {
      createTask(task.taskName, 'toDoList');

      // if task check as completed - line throw task
      const allTasksOnPage = $('li.my-todo-List__item');

      task.isCompleted && Array.from(allTasksOnPage).forEach(element => {
        if (task.taskName === $(element).find('div.my-todo-title  p').text()) {
          $(element).addClass('checked');
          $(element).find('input.form-check-input').attr('checked', 'checked');
        };
      });


      // to do list pagination
      if ($('#toDoList li').length > 2) {
        if ($('.panel-footer').length <= 0) {
          setPagination();
        }
        else {
          $(".panel-footer").remove();
          setPagination();
        };
      };
      // this code make sortable to do list
      $("#toDoList").sortable();
    };
  }
  else {
    arrData = [];
  };



  $('#btnAddToDo').on('click', () => {
    const toDoTitleText = $('#inputToDo').val().trim();

    // if input field is empty - show alert.
    if (toDoTitleText === '') {
      alertify.set('notifier', 'position', 'top-right');
      alertify.warning("Can't add an empty task", 2, 'warning');
    }
    // else add task in 'to do' list.
    else {
      const storageArrData = JSON.parse(localStorage.getItem('arrData'));

      createTask(toDoTitleText, 'toDoList');

      // save data to local storage
      const task = {
        taskName: toDoTitleText,
        isCompleted: false,
      };

      arrData.push(task);
      localStorage.setItem('arrData', JSON.stringify(arrData));
    };

    // clear input field afte click
    $('#inputToDo').val('');

    // to do list pagination
    if ($('#toDoList li').length > 2) {

      if ($('.panel-footer').length <= 0) {
        setPagination();
      }
      else {
        $(".panel-footer").remove();
        setPagination();
      };
    };

    // this code make sortable to do list
    $("#toDoList").sortable();
  });
});


function createTask(toDoTitleText, parentID) {
  const li = $('<li class="py-4 mb-2 my-todo-List__item"></li>');
  const toDoCheckAndTitleWrapper = $('<div class="d-flex align-items-center"></div>');
  const checkToDo = $('<input class="form-check-input m-0 me-3 shadow-none c-pointer" type="checkbox" />');
  const toDoTitleWrapper = $(`<div class="my-todo-title"></div>`);
  const toDoTitle = $(`<p class="m-0 fs-5">${toDoTitleText}</p>`);
  toDoTitleWrapper.append(toDoTitle);
  const editWrapper = $(`<div class="d-flex display-non my-edit-wrapper"></div>`);
  const editInput = $('<input class="form-control fs-5 my-edit-input" type="text"/>');
  const editBtnSave = $('<button type="button" class="btn btn-primary py-1 px-2 ms-2">Save</button>');
  editWrapper.append(editInput);
  editWrapper.append(editBtnSave);
  toDoTitleWrapper.append(editWrapper);
  toDoCheckAndTitleWrapper.append(checkToDo);
  toDoCheckAndTitleWrapper.append(toDoTitleWrapper);

  const toDoDeleteWrapper = $('<div class="btn-delete-wrapper"></div>');
  const btnDelete = $('<button class="c-pointer my-btn-delete"><i class="bi bi-trash text-danger fs-5" tabindex="0"></i></button>');
  toDoDeleteWrapper.append(btnDelete);

  li.append(toDoCheckAndTitleWrapper);
  li.append(toDoDeleteWrapper);
  $(`#${parentID}`).append(li);

  // task added alert
  alertify.set('notifier', 'position', 'top-right');
  alertify.success("'to do' successfully added", 2, 'success');

  // checked to do item as done
  checkToDo.on('click', (e) => {
    $(e.target).parents('li.my-todo-List__item').toggleClass('checked');

    const taskTitle = $(e.target).parents('li.my-todo-List__item').find('div.my-todo-title  p').text();
    const data = JSON.parse(localStorage.getItem('arrData'));

    data.forEach((element) => {
      if (element.taskName === taskTitle) {
        // delete task from local storage
        element.isCompleted = !element.isCompleted;
        // refresh tasks array and set data on local storage
        localStorage.setItem('arrData', JSON.stringify(data));
      };
    });

    const alertText = $(e.target).prop('checked') ? "Marked 'to do' as done" : 'Need to do';
    alertify.notify(alertText, 'checked', 2);
  });

  let taskPrevTitle;
  // edit task
  toDoTitle.on('dblclick', (e) => {
    editWrapper.removeClass('display-non');
    editInput.val($(e.target).text());
    taskPrevTitle = $(e.target).text();
  });

  // edit task btn save
  editBtnSave.on('click', () => {
    toDoTitle.text(editInput.val());

    const data = JSON.parse(localStorage.getItem('arrData'));

    data.forEach(element => {
      if (element.taskName === taskPrevTitle) {
        element.taskName = editInput.val();
        localStorage.setItem('arrData', JSON.stringify(data));
      };
    });

    editWrapper.addClass('display-non');
    alertify.success("'to do' has been edited", 2, 'success');
  });

  // delete task
  btnDelete.on('click', (e) => {
    $(e.target).parents('li.my-todo-List__item').remove();
    alertify.error("'to do' is deleted", 2, 'error');

    const taskTitle = $(e.target).parents('li.my-todo-List__item').find('div.my-todo-title  p').text();
    const data = JSON.parse(localStorage.getItem('arrData'));
    data.forEach((element, index) => {
      if (element.taskName === taskTitle) {
        // delete task from local storage
        data.splice(index, 1);
        // refresh tasks array and set data on local storage
        localStorage.setItem('arrData', JSON.stringify(data));
      };
    });

    // refresh pagination
    $('.panel-footer').remove();
    setPagination();

    // delete pagination if no tasks
    if ($("#toDoList li").length <= 2) {
      $('.panel-footer').remove();
    }
  });
};