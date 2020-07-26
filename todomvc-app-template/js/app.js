(function (Vue) {
	const items = [{
			id: 0,
			content: "english",
			completed: true,
		},
		{
			id: 1,
			content: "math",
			completed: false,
		},
		{
			id: 2,
			content: "java",
			completed: true,

		},

	];
	//创建vue实例
	var app = new Vue({
		el: "#app",
		data: {
			items,
			currentItem: '', //选中的item
			currentContent: '', //选中的item的内容
			hash: 'all', //url默认hash值
		},
		//监听items的改变，并将items存入本地长期存储
		watch: {
			items: function (newItems) {
				window.localStorage.setItem('items', items);
				// items = window.localStorage.getItem('items');
			}
		},
		methods: {
			addmsg(event) {
				//添加新信息
				var msg = event.target.value;
				if (msg.length != 0) {
					this.items.push({
						id: this.items.length,
						content: msg,
						completed: false
					});

				} else {
					return null;
				}
				//添加完后才能以后，清空输入栏
				event.target.value = '';
			},
			//删除items选中的项
			removeItem(event) {
				this.items.splice(event.target.index, 1);
			},
			//清楚全部已经完成的工作事项
			clearCompleted() {
				this.items = this.items.filter(function (item) {
					return !item.completed;
				});
			},
			//进入编辑状态
			toEidt(item) {
				this.currentItem = item;
				this.currentContent = item.content;
				this.editFlag = !this.editFlag;
			},
			//完成了编辑
			finishEdit(item, event) {
				this.currentItem = '';
				this.currentContent = event.target.value;
				if (this.currentContent.trim() == 0) {
					this.items.splice(event.target.index, 1);
				}
				item.content = this.currentContent;
			},
			//退出编辑
			cancleEdit() {
				this.currentItem = '';
			},
		},
		computed: {
			//监听全选按钮
			allChange: {
				get: function () {
					if (this.completedItems == 0) {
						return true;
					} else {
						return false;
					}
				},
				set: function (newStatus) {
					this.items.forEach((item, index, arr) => {
						arr[index].completed = newStatus
					})
				}
			},
			//监听所有完成的事件，并将为完成的事件显示在footer
			completedItems(value) {
				var filters = this.items.filter(function (item, index) {
					return item.completed == false;
				});
				return filters.length;
			},
			//切换路由，设置监听器，过滤对应的item内容
			filteItems() {
				switch (this.hash) {
					case "active": {
						return items.filter(item => !item.completed);
						break;
					}
					case "completed": {
						return items.filter(item => item.completed);
						break;
					}
					default: {
						return items;
						break;
					}
				}
				console.log(filte);
			}
		},
		//自定义指令
		directives: {
			//自定义自动获取焦点的指令
			focus: function (el, binding) {
				el.focus();
			},
		},
	});
	//当window的hash值变化，就会触发下面的之间，可以实时的更新vue实例中的路由
	window.onhashchange = function () {
		const hash = window.location.hash.slice(2) || 'all';
		console.log(hash);
		app.hash = hash;
	};
	//进入页面就执行一次，将当前的hash值传给vue实例。
	window.onhashchange();
})(Vue);
