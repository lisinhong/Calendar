Vue.component("day", {
  template: "#day",
  data: function() {
    return {
      dateOfPrevMonth: this.monthInfo[this.showedMonth-1]["days"]
    }
  },
  props: ["monthInfo", "showedYear", "currentDate", "showedMonth", "todoList"],
  mounted: function() {
    
  },
  computed: {
    showedDateOfPrevMonth: function() {
      return this.dateOfPrevMonth - this.monthInfo[this.showedMonth]["startWeekday"] +1;
    },
    showedDateOfNextMonth: function() {
      return (6 - this.monthInfo[this.showedMonth]["endWeekday"]);
    }
  },
  methods: {
    range: function(min, max) {
      var array = [];
      for(var i=min; i<=max; i++) {
        array.push(i);        
      }
      return array;
    }
  }
})
Vue.component("todo-list",{
  template: "#todo-list",
  props: ["todoList", "todos", "dateKey"],
  methods: {
    deleteTodo: function(key, index) {
      this.todoList[key].splice(index, 1);
    }
  }
})
Vue.component("add-todo", {
  template: "#add-todo",
  data: function() {
    return {
      showAddingTodoText: false,
      addingTodo: false,
      newTodo: "",
    }
  },
  props: ["todoList", "todoKey"],
  methods: {
    addTodo: function(key) {
      var hasValue = this.todoList[key];
      if(hasValue) {
        this.todoList[key].push(this.newTodo);
      }
      else {
        this.$set(this.todoList, key, [this.newTodo]);
      }
      this.newTodo = "";
      this.addingTodo = false;
      this.showAddingTodoText = false;
    }
  }
})

var vm = new Vue({
  el: "#app",
  data: {
    weekdays: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
    showedYear: 0,
    showedMonth: 0,
    currentDate: "",
    monthInfo: {
      0: { days: 31 }
    },
    todoList: {}
  },
  beforeMount: function() {
    this.initiateCalendar();
    this.getPastTodoList();
  },
  watch: {
    todoList: {
      handler: function() {
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
      },
      deep: true
    }
  },
  methods: {
    initiateCalendar: function() {
      var date = new Date(2018, 0, 1);

      for(var i=0; i<12; i++) {
        var year = date.getFullYear();
        var month = date.getMonth();
        var days = this.getDaysInMonth(year, month+1);
        var weekdayOfFirstDay = date.getDay();
        var weekdayOfEndDay = new Date(year, month, days).getDay();

        this.monthInfo[month+1] = {
          "days": days,
          "startWeekday": weekdayOfFirstDay,
          "endWeekday": weekdayOfEndDay
        }
        date.setMonth(month+1);
      }
      var currentDate = new Date();
      this.showedYear = currentDate.getFullYear();
      this.showedMonth = currentDate.getMonth() + 1;
      var date = currentDate.getDate();
      this.currentDate = String(this.showedMonth) + String(date);
    },
    getPastTodoList: function() {
      var todoList = localStorage.getItem("todoList") || {};
      this.todoList = JSON.parse(todoList);
    },
    getDaysInMonth: function(year, month) {
      return new Date(year, month, 0).getDate();
    },
    changeMonth: function(direction) {
      var month = this.showedMonth;
      if(direction == "next" && month < 12) {
        this.showedMonth ++;
      }
      else if(direction == "prev" && month > 1) {
        this.showedMonth --;
      }
    },
    backToToday: function() {
      this.showedMonth = new Date().getMonth()+1;      
    }
  }
})