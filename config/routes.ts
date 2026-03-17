export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
		hideInMenu: true,
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
		hideInMenu: true,
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
		hideInMenu: true,
	},
	{
        path: '/bai-1',
        name: 'Bài 1',   
        component: './bai1',
		hideInMenu: true,
    },
    {
        path: '/bai-2',
        name: 'Bài 2',   
        component: './bai2',
		hideInMenu: true,
    },

	///////////////////////////////////
	// HỆ THỐNG QUẢN LÝ DỊCH VỤ
	{
		path: '/quan-ly-nhan-vien-dich-vu',
		name: 'Quản lý Nhân viên & Dịch vụ',
		component: './QLDichVu/NhanVienDichVu',
	},
	{
		path: '/quan-ly-lich-hen',
		name: 'Quản lý Lịch hẹn',
		component: './QLDichVu/LichHen',
	},
	{
		path: '/danh-gia-dich-vu',
		name: 'Đánh giá Dịch vụ',
		component: './QLDichVu/DanhGia',
	},
	{
		path: '/thong-ke-bao-cao',
		name: 'Thống kê & Báo cáo',
		component: './QLDichVu/ThongKe',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
