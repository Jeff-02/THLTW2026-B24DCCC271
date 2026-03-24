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
	// HỆ THỐNG QUẢN LÝ VĂN BẰNG
	{
		path: '/quan-ly-so-van-bang',
		name: 'Quản lý sổ văn bằng',
		component: './QLDichVu/QuanLySoVanBang',
	},
	{
		path: '/quan-ly-quyet-dinh',
		name: 'Quyết định tốt nghiệp',
		component: './QLDichVu/QuanLyQuyetDinh',
	},
	{
		path: '/cau-hinh-bieu-mau-phu-luc',
		name: 'Cấu hình biểu mẫu phụ lục văn bằng',
		component: './QLDichVu/CauHinhPhuLuc',
	},
	{
		path: '/thong-tin-van-bang',
		name: 'Thông tin văn bằng',
		component: './QLDichVu/ThongTinVanBang',
	},
	{
		path: '/tra-cuu-van-bang',
		name: 'Tra cứu văn bằng',
		component: './QLDichVu/TraCuuVanBang',
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
