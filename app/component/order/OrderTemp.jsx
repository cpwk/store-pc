import React from 'react';
import {U} from "../../common";
import '../../assets/css/user/profile.scss'
import App from "../../common/App";
import {Avatar, Button, Card, Icon, InputNumber, message, Modal, Table, Tag} from "antd";
import Utils from '../../common/Utils'
import AddressUtils from ".././address/AddressUtils";

export default class Address extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addrIndex: -1,
            address: [],
            _ids: this.props.match.params.ids,
            ids: [],
            products: [],
            totalNum: 0,
            total: 0
        };
    }

    componentDidMount() {
        Utils.addr.loadRegion(this);
        U.setWXTitle('提交订单');
        this.loadData();
    };

    loadData = () => {

        let {_ids, ids, totalNum, total} = this.state;
        ids = decodeURIComponent(decodeURIComponent(_ids));
        ids = JSON.parse(ids);
        this.setState({ids});

        App.api(`/user/address/addresss`, {
            addressQo: JSON.stringify({})
        }).then((list) => {

            let addrIndex = list.length > 0 ? 0 : -1;

            this.setState({address: list, addrIndex});
        });

        App.api(`/user/car/findbyids`, {ids: JSON.stringify(ids)}).then((products) => {

            products.map((item) => {
                let {num, product} = item;
                let {price} = product;
                totalNum += parseInt(num);
                total += parseInt(price * num);
            });
            this.setState({total, totalNum, products});
        });
    };

    removeCar = () => {
        let {ids = []} = this.state;
        ids.map((id) => {
            App.api(`/user/car/remove`, {id})
        });
        App.go(`/user/order`);
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api(`/user/address/remove`, {id}).then((v) => {
                    if (v == null) {
                        message.success("删除成功");
                        let address = this.state.address;
                        this.setState({
                            address: U.array.remove(address, index)
                        })
                    }
                })
            },
            onCancel() {
            },
        });
    };

    edit = (Address) => {
        AddressUtils.EditAddress(Address, this.loadData);
    };

    def = (id) => {
        Modal.confirm({
            title: `确认设为默认地址?`,
            onOk: () => {
                App.api(`/user/address/def`, {id}).then(() => {
                    message.success("设置成功");
                    this.loadData();
                })
            },
            onCancel() {
            },
        });
    };

    order = () => {

        let {products, addrIndex, address, total} = this.state;

        address = address[addrIndex];


        App.api('user/order/save', {
                order: JSON.stringify({
                    address,
                    products,
                    total
                })
            }
        ).then(() => {
            message.success('订单已创建，请尽快付款哦亲');
            this.removeCar();

        });
    };

    render() {
        let {addrIndex = -1, address, products, total, totalNum} = this.state;
        return <div className="profile-page">

            {address.map((item, index) => {

                let {id, def, name} = item;

                let actions = [<Button onClick={() => {

                    this.edit(item)
                }}><Icon type="edit" key="setting"/>修改</Button>];

                if (def == 2) {
                    actions.push(<Button onClick={() => {
                        this.def(id)
                    }}><Icon type="setting" key="setting"/>设为默认</Button>);
                } else {
                    actions.push(<Button type="danger">默认地址</Button>)
                }

                actions.push(
                    <Button onClick={() => {
                        this.remove(id, index)
                    }}><Icon type="delete" key="setting"/>删除</Button>);

                let checked = addrIndex === index;

                return <Card
                    key={index}
                    title="收货地址"
                    hoverable={true}
                    style={{width: 350, float: "left"}}
                    actions={actions}>
                    <div style={checked ? {background: '#ff0000'} : {}} onClick={() => {
                        this.setState({addrIndex: index})
                    }}>
                        <div> 收货人：{name}</div>
                        <div> 手机号：{item.mobile}</div>
                        <div> 地址：{Utils.addr.getPCD(item.code)}</div>
                        <div> 街道：{item.detail}</div>
                    </div>
                </Card>
            })}

            <Card
                title="添加新地址"
                hoverable={true}
                style={{width: 350, height: 248, float: "left"}}
                actions={[]}>
                <div>
                    <Tag color='red' onClick={() => {
                        this.edit({id: 0})
                    }}>
                        <Icon type="edit"/>
                        <span>添加新地址......</span>
                    </Tag>
                </div>
            </Card>

            <div className='clearfix'/>

            <Table
                pagination={false}
                columns={[

                    {
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        width: '60px',
                        render: (col, row, i) => {
                            return <span>{(i + 1)}</span>
                        },
                    },

                    {
                        title: '商品展示',
                        dataIndex: 'product.img',
                        className: 'txt-center',
                        width: '200px',
                        render: (img, item, index) => {
                            return <img key={img} style={{
                                width: '60px',
                                height: '60px',
                                borderradius: '4px',
                                cursor: 'pointer'
                            }} src={img + '@!120-120'} onClick={() => {
                                Utils.common.showImgLightbox(img, index);
                            }}/>
                        }
                    },

                    {
                        title: '商品名称',
                        dataIndex: 'product.name',
                        className: 'txt-center',
                        width: '200px'
                    },

                    {
                        title: '商品价格￥',
                        dataIndex: '',
                        className: 'txt-center',
                        width: '200px',
                        render: (item) => {
                            let {product} = item;
                            let {price} = product;
                            return <Tag color='cyan'>{price}￥</Tag>
                        }
                    },

                    {
                        title: '商品数量',
                        dataIndex: 'num',
                        className: 'txt-center',
                        render: (num) => {
                            return <Tag color='cyan'>{num}</Tag>
                        }
                    },

                    {
                        title: '小计￥',
                        dataIndex: '',
                        className: 'txt-center',
                        render: (item) => {
                            let {num, product} = item;
                            let {price} = product;
                            let total = parseInt(num * price);
                            return <Tag color='purple'>{total}￥</Tag>
                        }
                    },
                ]}

                rowKey={(record) => record.id} dataSource={products}
            />

            <Button style={{float: 'right'}} type="danger" onClick={this.order}>提交订单</Button>
            <Button style={{float: 'right'}} type="dashed">总金额：{total}￥</Button>
            <Button style={{float: 'right'}} type="dashed">{totalNum}件商品</Button>

            <div className='clearfix-h20'/>
        </div>
    }
}