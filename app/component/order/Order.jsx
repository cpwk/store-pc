import React from 'react';
import {Card, Icon, message, Modal, Pagination, Tabs} from 'antd';
import {App, U, Utils, CTYPE} from "../../common";
import "../../assets/css/order/orders.scss"

const {TabPane} = Tabs;

export default class Orders extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            status: 1,
            pagination: {
                pageSize: 12,
                current: 0,
                total: 0
            }
        };
    }

    componentDidMount() {
        U.setWXTitle('订单详情');
        this.loadData();
    }

    loadData = () => {
        let {pagination = {}, status} = this.state;
        App.api('/user/order/orders', {
            orderQo: JSON.stringify({
                status: status,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize

            })
        }).then((data) => {
            this.setState({list: data.content});
        })
    };

    remove = (id, index) => {
        Modal.confirm({
            title: '确认删除操作？',
            onOk: () => {
                App.api('/user/order/remove', {id}).then(() => {
                    let {list = []} = this.state;

                    list = U.array.remove(list, index);
                    this.setState({list});
                    message.success('删除成功');
                });
            },
            onCancel() {
            },
        })
    };

    changeStatus = (key) => {
        this.setState({
            status: key,
            current: 1,
        }, () => this.loadData())
    };

    onPageChange = (current, pageSize) => {
        let pagination = this.state.pagination;
        this.setState({
            pagination: {
                ...pagination,
                current, pageSize
            }
        }, () => this.loadData());
    };

    pay = (order) => {
        App.api('/user/order/pay', {order: JSON.stringify(order)}).then((res) => {
            if (res == null) {
                message.success("付款成功，请注意收货！");
                this.loadData();
            }
        })
    };

    receive = (order) => {
        App.api('/user/order/receive', {order: JSON.stringify(order)}).then((res) => {
            if (res == null) {
                message.success("收货成功，请评价商品！");
                this.loadData();
            }
        })
    };

    evalproduct = (order) => {
        App.api('/user/order/evalproduct', {order: JSON.stringify(order)}).then((res) => {
            if (res == null) {
                message.success("评价成功，祝您生活愉快！");
                this.loadData();
            }
        })
    };

    render() {

        let {list, pagination = {}} = this.state;

        return <div className="main-page">

            <div className="my-order">我的订单</div>

            <Card>

                <Tabs defaultActiveKey="1" onChange={(key) => {
                    this.changeStatus(key)
                }}>
                    <TabPane tab="待付款" key="1">

                        {list.map((order, index) => {
                            let {id, products, total, createdAt, orderNum, address, status} = order;
                            let rowSpan = products.length;
                            return <React.Fragment key={index}>
                                {status == 1 && <table className='table'>

                                    <tbody>
                                    <tr className='head'>
                                        <th className='order-detail'>订单详情</th>
                                        <th className='person'>收货人</th>
                                        <th className='amount'>金额</th>
                                        <th className='status'>状态</th>
                                        <th className='opt'>操作</th>
                                    </tr>
                                    </tbody>

                                    <tbody>
                                    <tr className='top'>
                                        <td colSpan="5"/>
                                    </tr>

                                    <tr className='order-num'>
                                        <td colSpan="5" className='order-message'>
                                        <span
                                            className='time'>{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')}</span>
                                            <span className='num'><span
                                                className='char'>订单编号：</span>{orderNum}</span>
                                            <Icon className='delete' type='delete' onClick={() => {
                                                this.remove(id, index)
                                            }}/>
                                        </td>
                                    </tr>

                                    {products.map((item, index) => {
                                        let {num, product} = item;
                                        let {name, img} = product;

                                        return <tr className='product' key={index}>
                                            <td className='product-detail'>
                                                <div className='detail'>
                                                    <img className='img' src={img} style={{width: 50, height: 50}}/>
                                                    <div className='shop-name'>{name}</div>
                                                    <div className='num'>x&nbsp;{num}</div>
                                                </div>
                                            </td>

                                            {index === 0 && <React.Fragment>

                                                <td className='user-name' rowSpan={rowSpan}>
                                                    <span>{address.name}&nbsp;<Icon type="user"/></span>
                                                </td>
                                                <td className='product-amount' rowSpan={rowSpan}>总额￥{total}</td>
                                                <td className='product-status' rowSpan={rowSpan}>待付款</td>
                                                <td className='product-opt' rowSpan={rowSpan}>
                                                    <div className='button'>
                                                        <div className='icon'/>
                                                        <p onClick={() => {
                                                            this.pay(order)
                                                        }}>立即付款</p>
                                                    </div>
                                                </td>
                                            </React.Fragment>}
                                        </tr>
                                    })}
                                    </tbody>

                                </table>}
                            </React.Fragment>
                        })}
                    </TabPane>

                    <TabPane tab="待收货" key="3">

                        {list.map((order, index) => {
                            let {id, products, total, createdAt, orderNum, address, status} = order;
                            let rowSpan = products.length;
                            return <React.Fragment key={index}>
                                {status == 2 && <table
                                    className='table'>

                                    <tbody>

                                    <tr
                                        className='head'>
                                        <th
                                            className='order-detail'> 订单详情
                                        </th>
                                        <th className='person'>收货人</th>
                                        <th
                                            className='amount'> 金额
                                        </th>
                                        <th className='status'>状态</th>
                                        <th
                                            className='opt'> 操作
                                        </th>
                                    </tr>

                                    </tbody>

                                    <tbody key={index}>
                                    <tr className='top'>
                                        <td colSpan="5"/>
                                    </tr>

                                    <tr className='order-num'>
                                        <td colSpan="5" className='order-message'>
                            <span
                                className='time'>{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')}</span>
                                            <span className='num'><span className='char'>订单编号：</span>{orderNum}</span>

                                            <Icon className='delete' type='delete' onClick={() => {
                                                this.remove(id, index)
                                            }}/>
                                        </td>
                                    </tr>

                                    {products.map((item, index) => {
                                        let {num, product} = item;
                                        let {name, img} = product;

                                        return <tr className='product' key={index}>
                                            <td className='product-detail'>
                                                <div className='detail'>
                                                    <img className='img' src={img} style={{width: 50, height: 50}}/>
                                                    <div className='shop-name'>{name}</div>
                                                    <div className='num'>x&nbsp;{num}</div>
                                                </div>
                                            </td>

                                            {index === 0 && <React.Fragment>

                                                <td className='user-name' rowSpan={rowSpan}>
                                                    <span>{address.name}&nbsp;<Icon type="user"/></span>
                                                </td>
                                                <td className='product-amount' rowSpan={rowSpan}>总额￥{total}</td>
                                                <td className='product-status' rowSpan={rowSpan}>已支付</td>
                                                <td className='product-opt' rowSpan={rowSpan}>
                                                    <div className='button'>
                                                        <div className='icon'/>
                                                        <p onClick={() => {
                                                            this.receive(order)
                                                        }}>确认收货</p>
                                                    </div>
                                                </td>
                                            </React.Fragment>}
                                        </tr>
                                    })}
                                    </tbody>
                                </table>}
                            </React.Fragment>
                        })}
                    </TabPane>

                    <TabPane tab="待评价" key="4">


                        {list.map((order, index) => {
                            let {id, products, total, createdAt, orderNum, address, status} = order;
                            let rowSpan = products.length;
                            return <React.Fragment key={index}>
                                {status == 3 && <table className='table'>
                                    <tbody>
                                    <tr className='head'>
                                        <th className='order-detail'>订单详情</th>
                                        <th className='person'>收货人</th>
                                        <th className='amount'>金额</th>
                                        <th className='status'>状态</th>
                                        <th className='opt'>操作</th>
                                    </tr>
                                    </tbody>


                                    <tbody key={index}>
                                    <tr className='top'>
                                        <td colSpan="5"/>
                                    </tr>

                                    <tr className='order-num'>
                                        <td colSpan="5" className='order-message'>
                                        <span
                                            className='time'>{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')}</span>
                                            <span className='num'><span
                                                className='char'>订单编号：</span>{orderNum}</span>
                                            <Icon className='delete' type='delete' onClick={() => {
                                                this.remove(id, index)
                                            }}/>
                                        </td>
                                    </tr>

                                    {products.map((item, index) => {
                                        let {num, product} = item;
                                        let {name, img} = product;

                                        return <tr className='product' key={index}>
                                            <td className='product-detail'>
                                                <div className='detail'>
                                                    <img className='img' src={img} style={{width: 50, height: 50}}/>
                                                    <div className='shop-name'>{name}</div>
                                                    <div className='num'>x&nbsp;{num}</div>
                                                </div>
                                            </td>

                                            {index === 0 && <React.Fragment>

                                                <td className='user-name' rowSpan={rowSpan}>
                                                    <span>{address.name}&nbsp;<Icon type="user"/></span>
                                                </td>
                                                <td className='product-amount' rowSpan={rowSpan}>总额￥{total}</td>
                                                <td className='product-status' rowSpan={rowSpan}>已签收</td>
                                                <td className='product-opt' rowSpan={rowSpan}>
                                                    <div className='button'>
                                                        <div className='icon'/>
                                                        <p onClick={() => {
                                                            this.evalproduct(order)
                                                        }}>立即评价</p>
                                                    </div>
                                                </td>
                                            </React.Fragment>}
                                        </tr>
                                    })}

                                    </tbody>

                                </table>}
                            </React.Fragment>
                        })}

                    </TabPane>
                </Tabs>
                <Pagination {...CTYPE.commonPagination}
                            style={{marginTop: '20px', float: 'right'}}
                            showQuickJumper={true}
                            onChange={(current, pageSize) => this.onPageChange(current, pageSize)}
                            onShowSizeChange={(current, pageSize) => {
                                this.onPageChange(current, pageSize)
                            }}
                            current={pagination.current} pageSize={pagination.pageSize} total={pagination.total}/>
            </Card>
        </div>
    }
}