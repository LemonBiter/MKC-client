import chineseMessages from "ra-language-chinese-new";

const customChineseMessages = {
    ...chineseMessages,
    pos: {
        search: 'Search',
        configuration: 'Configuration',
        language: 'Language',
        theme: {
            name: 'Theme',
            light: 'Light',
            dark: 'Dark',
        },
        dashboard: {
            monthly_revenue: 'Monthly Revenue',
            month_history: '30 Day Revenue History',
            new_orders: 'New Orders',
            pending_reviews: 'Pending Reviews',
            all_reviews: 'See all reviews',
            new_customers: 'New Customers',
            all_customers: 'See all customers',
            pending_orders: 'Pending Orders',
            order: {
                items:
                    'by %{customer_name}, one item |||| by %{customer_name}, %{nb_items} items',
            },
            welcome: {
                title: 'Welcome to the react-admin e-commerce demo',
                subtitle:
                    "This is the admin of an imaginary poster shop. Feel free to explore and modify the data - it's local to your computer, and will reset each time you reload.",
                ra_button: 'react-admin site',
                demo_button: 'Source for this demo',
            },
        },
        menu: {
            sales: 'Sales',
            catalog: 'Catalog',
            customers: 'Customers',
        },
    },
    resources: {
        message: {
          name: '消息中心'
        },
        order: {
            name: '订单',
            tabs: {
                ordered: '已下单',
                preparing: '制作中',
                delivered: '已送达',
                assembling: '安装中',
                completed: '已完成',
            }
        },
        accessory: {
            name: '配件'
        },
        material: {
            name: '物料'
        },
        employee: {
            name: '员工'
        }
    },
};

export default customChineseMessages;
